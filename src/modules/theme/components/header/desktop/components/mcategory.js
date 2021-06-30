/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { WHITE, PRIMARY } from '@theme_color';
import Thumbor from '@common_image';
import getPath from '@helper_getpath';
import { setResolver, getResolver } from '@helper_localstorage';
import { features } from '@config';
import Link from 'next/link';

const generateLevel2 = (data, handleClick, generateLink) => {
    const [active, setActive] = React.useState(0);
    const child = data[active];
    return (
        <>
            <div className="nav-column nav-column-left col-lg-2">
                {data.map((val, idx) => (
                    <Link key={idx} href={generateLink(val)[0]} as={generateLink(val)[1]}>
                        <a onClick={() => handleClick(val)} className={active === idx ? 'active' : ''} onMouseEnter={() => setActive(idx)}>
                            {val.name}
                        </a>
                    </Link>
                ))}
            </div>
            <div className="nav-column nav-column-right col-lg-10 row">
                <div className={`${child.image_path ? 'col-lg-9' : 'col-lg-12'} row`}>
                    {child.children.map((lvl3, id3) => (
                        <div className="col-lg-3" key={id3}>
                            <Link href={generateLink(lvl3)[0]} as={generateLink(lvl3)[1]}>
                                <a onClick={() => handleClick(lvl3)}>{lvl3.name}</a>
                            </Link>
                            <ul className="list-item__menu">
                                {lvl3.children.map((lvl4, id4) => (
                                    <li key={id4}>
                                        <Link href={generateLink(lvl4)[0]} as={generateLink(lvl4)[1]}>
                                            <a onClick={() => handleClick(lvl4)}>{lvl4.name}</a>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                {child.image_path ? (
                    <div className="col-lg-3">
                        <Thumbor
                            // eslint-disable-next-line no-nested-ternary
                            src={child.image_path}
                            className="img_cat"
                            width={960}
                            height={577}
                            quality={80}
                            alt={child.name}
                        />
                    </div>
                ) : null}
            </div>
            <style jsx>
                {`
                    .row {
                        margin: 0;
                    }
                    .nav-column-left {
                        background: #f3f3f3;
                        padding: 15px 10px;
                    }
                    .nav-column-right {
                        padding: 15px 0;
                    }
                    .list-item__menu a {
                        font-weight: normal;
                    }
                `}
            </style>
        </>
    );
};

const Menu = (props) => {
    const { data, storeConfig } = props;
    const cmsPages = storeConfig && storeConfig.cms_page ? storeConfig.cms_page.split(',') : [];
    const menu = features.vesMenu.enabled ? data.vesMenu.items : data.categoryList[0].children;
    const generateLink = (cat) => {
        const link = cat.link ? getPath(cat.link) : `/${cat.url_path}`;
        if (features.vesMenu.enabled) {
            if (cat.link_type === 'category_link') {
                return ['/[...slug]', link];
            }
            const cms = cmsPages.find((cmsPage) => cmsPage === link.replace('/', ''));
            if (cms) {
                return ['/[...slug]', link];
            }
            return [link, link];
        }
        return ['/[...slug]', link];
    };
    const handleClick = async (cat) => {
        const link = cat.link ? getPath(cat.link) : `/${cat.url_path}`;
        const urlResolver = getResolver();
        if (features.vesMenu.enabled) {
            if (cat.link_type === 'category_link') {
                urlResolver[link] = {
                    type: 'CATEGORY',
                    id: cat.category_id,
                };
                await setResolver(urlResolver);
            } else {
                const cms = cmsPages.find((cmsPage) => cmsPage === link.replace('/', ''));
                if (cms) {
                    urlResolver[link] = {
                        type: 'CMS_PAGE',
                    };
                    await setResolver(urlResolver);
                }
            }
        } else {
            urlResolver[link] = {
                type: 'CATEGORY',
                id: cat.id,
            };
            await setResolver(urlResolver);
        }
    };
    return (
        <div className="menu-wrapper" role="navigation">
            <ul className="nav" role="menubar">
                {menu.map((val, idx) => {
                    if ((val.include_in_menu || features.vesMenu.enabled) && val.name) {
                        return (
                            <li key={idx} role="menuitem">
                                {val.link ? (
                                    <Link href={generateLink(val)[0]} as={generateLink(val)[1]}>
                                        <a onClick={() => handleClick(val)} dangerouslySetInnerHTML={{ __html: val.name }} />
                                    </Link>
                                ) : (
                                    <a href="#" dangerouslySetInnerHTML={{ __html: val.name }} />
                                )}

                                {val.children.length > 0 ? (
                                    <div className="mega-menu row" aria-hidden="true" role="menu">
                                        {generateLevel2(val.children, handleClick, generateLink)}
                                    </div>
                                ) : null}
                            </li>
                        );
                    }
                    return null;
                })}
                <li role="menuitem">
                    <Link href={`/popular`}>
                        <a dangerouslySetInnerHTML={{ __html: `Popular` }} />
                    </Link>
                </li>
            </ul>
            <style jsx global>
                {`
                    /* mini reset */
                    .nav {
                        width: 100%;
                    }
                    .nav,
                    .nav a,
                    .nav form,
                    .nav input,
                    .nav li,
                    .nav ul {
                        border: none;
                        margin: 0;
                        padding: 0;
                    }
                    .nav a {
                        text-decoration: none;
                    }
                    .nav li {
                        list-style: none;
                    }

                    /* menu container */
                    .nav {
                        cursor: default;
                        display: inline-block;
                        position: relative;
                        z-index: 500;
                    }

                    /* menu list */
                    .nav > li {
                        float: left;
                    }

                    /* menu links */
                    .nav > li > a {
                        background: ${WHITE};
                        color: ${PRIMARY};
                        display: block;
                        font-weight: bold;
                        line-height: 3.5;
                        padding: 0 1.25em;
                        transition: all 0.3s ease;
                        z-index: 510;
                        position: relative;
                    }
                    .nav > li > a:focus,
                    .nav > li:hover > a {
                        color: #4b4441;
                    }
                    .nav > li:first-child > a {
                        border-left: none;
                        border-radius: 3px 0 0 3px;
                    }

                    /* search form */
                    .nav-search > form {
                        border-left: 1px solid #4b4441;
                        height: 3.5em;
                        position: relative;
                        width: inherit;
                        z-index: 510;
                    }
                    .nav-search input[type='text'] {
                        background: #372f2b;
                        color: #999;
                        display: block;
                        float: left;
                        font-weight: bold;
                        line-height: 1.5;
                        padding: 1em 0;
                        text-shadow: 0 0 1px rgba(0, 0, 0, 0.35);
                        transition: all 0.3s ease 1s;
                        width: 0;
                    }
                    .nav-search input[type='text']:focus {
                        color: #fcfcfc;
                    }
                    .nav-search input[type='text']:focus,
                    .nav-search:hover input[type='text'] {
                        padding: 1em 1.25em;
                        transition: all 0.3s ease 0.1s;
                        width: 6.875em;
                    }
                    .nav-search input[type='submit'] {
                        background: #372f2b url(../img/search-icon.png) no-repeat center center; /* IE8 fallback */
                        background: #372f2b url(../img/search-icon.svg) no-repeat center center;
                        border-radius: 0 3px 3px 0;
                        cursor: pointer;
                        display: block;
                        float: left;
                        height: 3.5em;
                        padding: 0 1.25em;
                        transition: all 0.3s ease;
                    }
                    .nav-search input:focus,
                    .nav-search input[type='submit']:hover {
                        background-color: #4b4441;
                    }

                    /* menu dropdown */
                    .mega-menu {
                        background: #fff;
                        border: 1px solid #ddd;
                        border-radius: 0 0 3px 3px;
                        opacity: 0;
                        position: absolute;
                        transition: all 0.3s ease 0.15s;
                        visibility: hidden;
                        width: 100%;
                        left: 0;
                        margin: 0;
                        min-height: 300px;
                    }
                    li:hover > .mega-menu {
                        opacity: 1;
                        overflow: visible;
                        visibility: visible;
                    }

                    /* menu content */
                    .nav-column a {
                        color: #888;
                        display: block;
                        font-weight: bold;
                        line-height: 1.75;
                    }
                    .nav-column a:hover {
                        color: #2e3092 !important;
                    }

                    .nav-column .active {
                        color: #2e3092 !important;
                    }
                    .nav-column h3 {
                        color: #372f2b;
                        font-size: 0.95em;
                        font-weight: bold;
                        line-height: 1.15;
                        margin: 1.25em 0 0.75em;
                        text-transform: uppercase;
                    }
                    .cat-label-v2 {
                        top: -6px;
                        position: absolute;
                        background: red;
                        z-index: 99;
                        left: 10px;
                        height: 20px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                `}
            </style>
        </div>
    );
};

export default Menu;
