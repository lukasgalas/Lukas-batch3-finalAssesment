/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */

const {
    ApolloServer,
    gql,
    introspectSchema,
    makeRemoteExecutableSchema,
} = require('apollo-server-express');
const cookieSession = require('cookie-session');
const express = require('express');
const next = require('next');
const fs = require('fs');
const http = require('http');
const https = require('https');
const nextI18NextMiddleware = require('next-i18next/middleware').default;
const { mergeSchemas } = require('graphql-tools');

const LRUCache = require('lru-cache');
const nextI18next = require('./src/lib/i18n');
const fetcher = require('./src/graphql-server');
const resolver = require('./src/graphql-server/resolver/index');
const { AuthSchema } = require('./src/graphql-server/schema/index');

const { json } = express;
const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

/* change the cerification files path as needed */
const privateKey = '/etc/letsencrypt/live/swiftpwa.testingnow.me/privkey.pem';
const certificate = '/etc/letsencrypt/live/swiftpwa.testingnow.me/cert.pem';

const {
    expiredToken, SESSION_SECRET, nossrCache, features,
} = require('./swift.config');
const generateXml = require('./src/xml');

// This is where we cache our rendered HTML pages
const ssrCache = new LRUCache({
    max: 100 * 1024 * 1024, /* cache size will be 100 MB using `return n.length` as length() function */
    length(n, key) {
        return n.length;
    },
    maxAge: 1000 * 60 * 60 * 24, // create max age 1 day
});

/*
 * NB: make sure to modify this to take into account anything that should trigger
 * an immediate page change (e.g a locale stored in req.session)
 */
function getCacheKey(req) {
    return `${req.path}`;
}

async function renderAndCache(req, res) {
    const key = getCacheKey(req);
    // If we have a page in the cache, let's serve it
    if (ssrCache.has(key) && typeof req.query.resetcache === 'undefined') {
        res.setHeader('x-cache', 'HIT');
        res.send(ssrCache.get(key));
        return;
    }

    // reset cache if have query resetcache
    if (req.query && typeof req.query.resetcache !== 'undefined') {
        ssrCache.reset();
    }

    try {
        // console.log(`key ${key} not found, rendering`);
        // If not let's render the page into HTML
        const html = await app.renderToHTML(req, res, req.path, req.query);

        // Something is wrong with the request, let's skip the cache
        if (res.statusCode !== 200) {
            res.send(html);
            return;
        }
        // Let's cache this page
        ssrCache.set(key, html);

        res.setHeader('x-cache', 'MISS');
        res.send(html);
    } catch (err) {
        app.renderError(err, req, res, req.path, req.query);
    }
}

(async () => {
    await app.prepare();
    const server = express();
    // if ssr cache on
    if (features.ssrCache) {
        // handle next js request
        server.get('/_next/*', (req, res) => {
            /* serving _next static content using next.js handler */
            handle(req, res);
        });

        server.get('/assets/*', (req, res) => {
            /* serving assets static content using next.js handler */
            handle(req, res);
        });

        server.get('/static/*', (req, res) => {
            /* serving static content using next.js handler */
            handle(req, res);
        });

        server.get('/manifest.json', (req, res) => {
            /* serving manifest json */
            handle(req, res);
        });

        server.get('/favicon.ico', (req, res) => {
            /* serving manifest json */
            handle(req, res);
        });

        server.get('/service-worker.js', (req, res) => {
            /* serving service-worker */
            handle(req, res);
        });
    }

    await nextI18next.initPromise;
    server.use(nextI18NextMiddleware(nextI18next));
    server.use(cookieSession({
        name: 'qwt-swift',
        keys: [SESSION_SECRET],
        maxAge: expiredToken,
    }));

    server.use(json({ limit: '2mb' }));

    const schema = makeRemoteExecutableSchema({
        schema: await introspectSchema(fetcher),
        fetcher,
    });

    const schemas = mergeSchemas({
        schemas: [schema, AuthSchema],
        resolvers: resolver,
    });

    // handle server graphql endpoint use `/graphql`
    const serverGraph = new ApolloServer({
        schema: schemas,
        context: ({ req }) => req,
        playground: {
            endpoint: '/graphql',
            settings: {
                'editor.theme': 'light',
            },
        },
        formatError: (err) => {
            if (err.message === 'graphql-authorization') {
                return {
                    message: err.message,
                    extensions: {
                        category: 'graphql-authorization',
                    },
                    status: 401,
                };
            }
            return err;
        },
    });
    serverGraph.applyMiddleware({ app: server });

    server.get('/sitemap.xml', generateXml);

    // server.get('*', (req, res) => handle(req, res));
    server.get('*', (req, res) => {
        const key = getCacheKey(req);
        // handle no cache ssr
        const found = nossrCache.find((val) => val === key);
        if (found || !features.ssrCache) {
            return handle(req, res);
        }
        /* serving page */
        return renderAndCache(req, res);
    });

    if (
        process.env.NODE_ENV === 'production'
        && fs.existsSync(privateKey)
        && fs.existsSync(certificate)
    ) {
        const credentials = {
            key: fs.readFileSync(privateKey),
            cert: fs.readFileSync(certificate),
        };

        // https
        const httpsServer = https.createServer(credentials, server);
        await httpsServer.listen(3030);
        console.log('> Ready on https://localhost:3030'); // eslint-disable-line no-console

        // http
        const httpServer = http.createServer(server);
        await httpServer.listen(3000);
        console.log('> Ready on http://localhost:3000'); // eslint-disable-line no-console
    } else {
        // http
        const httpServer = http.createServer(server);
        await httpServer.listen(3000);
        console.log('> Ready on http://localhost:3000'); // eslint-disable-line no-console
    }
})();
