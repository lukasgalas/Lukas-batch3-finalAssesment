/* eslint-disable max-len */
import { modules } from '@config';
import BannerSlider from '@core_modules/home/pages/default/components/Banner';
import FeaturedProducts from '@core_modules/home/pages/default/components/FeaturedProducts';
import CategoryList from '@core_modules/home/pages/default/components/CategoryList';
import useStyles from '@core_modules/home/pages/default/components/style';

const Content = (props) => {
    const styles = useStyles();
    const {
        BannerSliderSkeleton, BannerView, FeaturedSkeleton, FeaturedView, CategoryListSkeleton, CategoryListView, CmsPage, ...other
    } = props;
    const { useCmsPage } = modules.home;

    if (useCmsPage.enable) return <CmsPage onlyCms slug={[useCmsPage.identifier]} withLayoutHeader={false} withLayoutFooter={false} withCmsTitle={false} {...other} />;

    return (
        <div className={styles.container}>
            <FeaturedProducts FeaturedView={FeaturedView} FeaturedSkeleton={FeaturedSkeleton} {...other} />
            <CategoryList CategoryListSkeleton={CategoryListSkeleton} CategoryListView={CategoryListView} {...other} />
            <BannerSlider BannerSliderSkeleton={BannerSliderSkeleton} BannerView={BannerView} {...other} />
        </div>
    );
};

export default Content;
