import { withTranslation } from '@i18n';
import { withApollo } from '@lib_apollo';
import Skeleton from '@core_modules/popular/pages/default/components/skeleton';
import Content from '@core_modules/popular/pages/default/components';
import ErrorInfo from '@core_modules/popular/pages/default/components/ErrorInfo';
import Core from '@core_modules/popular/pages/default/core';

const Page = (props) => (<Core {...props} Content={Content} ErrorInfo={ErrorInfo} Skeleton={Skeleton} />);

Page.getInitialProps = async () => ({ namespacesRequired: ['common', 'popular'] });

export default withApollo({ ssr: true })(withTranslation()(Page));
