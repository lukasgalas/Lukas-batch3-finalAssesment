import { makeStyles } from '@material-ui/core';
import { GRAY_PRIMARY, WHITE } from '@theme/colors';
import { FlexColumn } from '@theme/mixins';

const useStyles = makeStyles(() => ({
    container: {
        width: '100%',
        height: '100%',
        ...FlexColumn,
    },
    headContainer: {
        position: 'relative',
        backgroundColor: GRAY_PRIMARY,
    },
    headContainerNoBanner: {
        backgroundColor: WHITE,
        height: '40vh',
    },
    header: {
        left: '50%',
        right: '50%',
        top: '11px',
        position: 'absolute',
        borderBottom: 'none',
        fontWeight: 'bold',
    },
}));

export default useStyles;