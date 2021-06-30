/* eslint-disable react/no-danger */
import Typography from '@common_typography';
import useStyles from '@core_modules/popular/pages/default/components/style';

import Loader from '@core_modules/rewardpoint/pages/default/components/skeleton';

const PopularPage = (props) => {
    const styles = useStyles();
    const {
        data, t, loading
    } = props;

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            {/* eslint-disable-next-line react/no-danger */}
            <Typography variant="h5" type="bold" align="left" letter="uppercase" className={styles.pageTitles}>
                {t('popular:pageTitle')}
            </Typography>

            <div className={styles.container}>
                {data.products.items.map((product) => (
                    <div className={styles.productCard}>
                        <img className='productCard__image' src={product.image.url} />
                        <Typography className='productCard__title'>{product.name}</Typography>
                    </div>
                ))}
            </div>
        </>
    );
};

export default PopularPage;
