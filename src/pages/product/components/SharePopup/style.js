import { makeStyles } from "@material-ui/core";
import { FlexRow, CreatePadding, CenterAbsolute } from '@theme/mixins'

export default makeStyles(theme => ({
    container : {
        ...FlexRow,
        flexWrap : 'wrap',
        alignItems : 'center',
        justifyContent : 'space-around',
        height : '35vh',
        ...CreatePadding(16,16,16,16),
        borderTopLeftRadius : 20,
        borderTopRightRadius : 20,
        position : 'relative'
    },
    root : {
        background : 'transparent !important'
    },
    title : {
        position : 'absolute',
        ...CenterAbsolute,
        top: 15
    },
    btnCancel : {
        position : 'absolute',
        ...CenterAbsolute,
        bottom: 15,
        width : '75%',
        [theme.breakpoints.up('sm')] : {
            width : 320
        }
    }
}))