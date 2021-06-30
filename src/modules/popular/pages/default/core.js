import Layout from '@layout';
import { debuging } from '@config';
import gqlService from '@core_modules/popular/services/graphql';

const Popular = (props) => {
    const {
        Content, t, pageConfig, ErrorInfo, Skeleton
    } = props;

    const Config = {
        title: t('popular:pageTitle'),
        headerTitle: t('popular:pageTitle'),
        header: 'relative', // available values: "absolute", "relative", false (default)
        bottomNav: false
    };
    const [message, setMessage] = React.useState({
        open: false,
        variant: 'success',
        text: ''
    });
    const [load, setLoad] = React.useState(false);
    const { error, loading, data } = gqlService.getPopularProducts({ search: "" });
    if (error) {
        return <ErrorInfo variant="error" text={debuging.originalError ? error.message.split(':')[1] : props.t('common:error:fetchError')} />;
    }

    return (
        <Layout pageConfig={pageConfig || Config} {...props}>
            <Content
                t={t}
                Content={Content}
                error={error}
                message={message}
                setMessage={setMessage}
                loading={loading}
                data={data}
                Skeleton={Skeleton}
                load={load}
            />
        </Layout>
    );
};

export default Popular;
