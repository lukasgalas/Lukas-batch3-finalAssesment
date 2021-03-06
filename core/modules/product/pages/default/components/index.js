/* eslint-disable react/no-danger */
/* eslint-disable array-callback-return */
import Button from '@common_button';
import PriceFormat from '@common_priceformat';
import Banner from '@common_slick/BannerThumbnail';
// import Caraousel from '@common_slick/Caraousel';
// import CarouselSkeleton from '@common_slick/Caraousel/Skeleton';
import Typography from '@common_typography';
import IconButton from '@material-ui/core/IconButton';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorderOutlined from '@material-ui/icons/FavoriteBorderOutlined';
import ShareOutlined from '@material-ui/icons/ShareOutlined';
import classNames from 'classnames';
import ProductItem from '@plugin_productitem';
import React from 'react';
import { getHost } from '@helper_config';
import Breadcrumb from '@common_breadcrumb';
import RatingStar from '@common_ratingstar';
import { breakPointsUp } from '@helper_theme';
import dynamic from 'next/dynamic';
import useStyles from '@core_modules/product/pages/default/components/style';
import ExpandDetail from '@core_modules/product/pages/default/components/ExpandDetail';
import ListReviews from '@core_modules/product/pages/default/components/ListReviews';
import OptionItem from '@core_modules/product/pages/default/components/OptionItem';
import RightDrawer from '@core_modules/product/pages/default/components/RightDrawer';
import SharePopup from '@core_modules/product/pages/default/components/SharePopup';
import ModalPopupImage from '@core_modules/product/pages/default/components/ModalPopupImage';

const DesktopOptions = dynamic(() => import('@core_modules/product/pages/default/components/OptionItem/DesktopOptions'), { ssr: true });
const TabsView = dynamic(() => import('@core_modules/product/pages/default/components/DesktopTabs'), { ssr: true });
const ItemShare = dynamic(() => import('@core_modules/product/pages/default/components/SharePopup/item'), { ssr: true });
const Caraousel = dynamic(() => import('@common_slick/Caraousel'), { ssr: false });

const ProductPage = (props) => {
    const styles = useStyles();
    const {
        t,
        data,
        openOption,
        handleOption,
        setOpenOption,
        setBanner,
        setPrice,
        openShare,
        setOpenShare,
        route,
        banner,
        openDrawer,
        setOpenDrawer,
        breadcrumbsData,
        price,
        handleWishlist,
        reviewValue,
        wishlist,
        expandData,
        relateData,
        openImageDetail,
        handleOpenImageDetail,
        stockStatus,
        additionalPrice,
    } = props;

    const desktop = breakPointsUp('sm');

    const favoritIcon = wishlist ? <Favorite className={styles.iconShare} /> : <FavoriteBorderOutlined className={styles.iconShare} />;

    let contentCaraousel = '';
    if (typeof window !== 'undefined' && relateData.length > 0) {
        contentCaraousel = <Caraousel enableQuickView={false} data={relateData} Item={ProductItem} />;
    }

    return (
        <>
            <div className="hidden-mobile">
                {data && data.upsell_products && data.upsell_products.length > 0 && (
                    <RightDrawer open={openDrawer} setOpen={() => setOpenDrawer(!openDrawer)} {...props} />
                )}
                <ModalPopupImage open={openImageDetail} setOpen={handleOpenImageDetail} banner={banner} />
            </div>
            <OptionItem {...props} open={openOption} setOpen={() => setOpenOption(!openOption)} setBanner={setBanner} setPrice={setPrice} />
            <SharePopup open={openShare} setOpen={() => setOpenShare(!openShare)} link={getHost() + route.asPath} {...props} />
            <div className={classNames(styles.container, 'row')}>
                <div className="col-lg-12 hidden-mobile">
                    <Breadcrumb data={breadcrumbsData} variant="text" />
                </div>
                <div className={classNames(styles.headContainer, 'col-xs-12 col-lg-6')}>
                    <Banner
                        data={banner}
                        noLink
                        thumbnail
                        showArrow
                        contentWidth="auto"
                        autoPlay={false}
                        width={960}
                        height={1120}
                        actionImage={desktop ? handleOpenImageDetail : () => {}}
                    />
                    <div className="hidden-desktop">
                        {data && data.upsell_products && data.upsell_products.length > 0 && (
                            <RightDrawer open={openDrawer} setOpen={() => setOpenDrawer(!openDrawer)} {...props} />
                        )}
                    </div>
                </div>
                <div className={classNames(styles.body, 'col-xs-12 col-lg-6')}>
                    <div className={classNames(styles.titleContainer, 'hidden-desktop')}>
                        <Breadcrumb data={breadcrumbsData} variant="text" />
                    </div>

                    <div className={styles.titleContainer}>
                        <div className={styles.titlePriceContainer}>
                            <Typography variant="title" type="bold" letter="capitalize" className={classNames(styles.title, 'clear-margin-padding')}>
                                {data.name}
                            </Typography>
                            <PriceFormat {...price} additionalPrice={additionalPrice} />
                        </div>
                        <div className={styles.shareContainer}>
                            <IconButton className={styles.btnShare} onClick={handleWishlist}>
                                {favoritIcon}
                            </IconButton>
                            <div className="hidden-desktop">
                                <IconButton className={classNames(styles.btnShare, 'hidden-desktop')} onClick={() => setOpenShare(true)}>
                                    <ShareOutlined className={styles.iconShare} />
                                </IconButton>
                            </div>
                        </div>
                    </div>
                    <div className={styles.titleContainer}>
                        <div className={classNames('row', styles.sku)}>
                            <Typography className="clear-margin-padding" variant="p" type="regular" letter="capitalize">
                                SKU#:
                                {' '}
                            </Typography>
                            <Typography variant="p" type="bold" letter="none">
                                {data.sku || ''}
                            </Typography>
                        </div>
                        <Typography variant="p" type="bold" letter="uppercase">
                            {stockStatus.replace(/_/g, ' ') || ''}
                        </Typography>
                    </div>

                    <div className={styles.titleContainer}>
                        <div className={styles.ratingContainer}>
                            <RatingStar value={reviewValue || 0} />
                            <Typography variant="p" type="regular" letter="capitalize">
                                {data.review.reviews_count || 0}
                                {' '}
                                {t('product:review')}
                            </Typography>
                        </div>
                    </div>

                    <div className="hidden-desktop">
                        {' '}
                        <div className={styles.desc}>
                            <Typography variant="span" type="regular" size="10">
                                {data.short_description.html ? <span dangerouslySetInnerHTML={{ __html: data.short_description.html }} /> : null}
                            </Typography>
                        </div>
                        <div>
                            <ExpandDetail data={expandData} />
                        </div>
                    </div>
                    <div className="hidden-mobile">
                        <DesktopOptions {...props} setOpen={setOpenOption} setBanner={setBanner} setPrice={setPrice} />
                        <div className={styles.desktopShareIcon}>
                            <Typography className={styles.shareTitle} variant="title">
                                {t('product:shareTitle')}
                            </Typography>
                            <ItemShare link={getHost() + route.asPath} />
                        </div>
                    </div>
                </div>
                <div className="hidden-desktop">
                    <ListReviews {...props} />
                </div>
                <div className={classNames(styles.tabs, 'col-xs-12 col-lg-12 hidden-mobile')}>
                    <TabsView {...props} dataInfo={expandData} />
                </div>
                {relateData.length !== 0 ? (
                    <div className={classNames(styles.carouselContainer, 'col-xs-12 col-lg-12')}>
                        <Typography variant="h1" component="h2" align="center" className={styles.carouselTitle}>
                            {t('common:title:relatedProduct')}
                        </Typography>
                        {contentCaraousel}
                    </div>
                ) : null}

                <div className={classNames(styles.footer, 'hidden-desktop')}>
                    <Button
                        className={styles.btnAddToCard}
                        color="primary"
                        onClick={handleOption}
                        disabled={data && data.stock_status === 'OUT_STOCK'}
                    >
                        <Typography variant="span" align="center" type="bold" letter="uppercase" color="white">
                            {t('product:addToCart')}
                        </Typography>
                    </Button>
                </div>
            </div>
        </>
    );
};

export default ProductPage;
