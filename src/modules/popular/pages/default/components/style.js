import makeStyles from '@material-ui/core/styles/makeStyles';

export default makeStyles((theme) => ({
    pageTitles: {
        marginBottom: '20px',
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    productCard: {
        [theme.breakpoints.down('md')]: {
            width: '47%',
            margin: '0 5px 5px 5px',
        },
        width: '23%',
        borderRadius: 8,
        border: '1px solid black',
        marginRight: 15,
        marginBottom: 15,
        padding: 5,
        display: 'flex',
        alignItems: 'center',
        ' & .productCard__title': {
            fontWeight: 'bold'
        },
        ' & .productCard__image': {
            width: 35,
            height: 35,
            borderRadius: 100,
            marginRight: 8
        }
    }
}));
