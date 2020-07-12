const styles = {
    // User Button (unselected)
    button: {
        color: '#FFFFFF',
        textTransform: 'none',
        fontSize: '18px',
        border: '1.5px solid #353B51',
        fontFamily: 'Helvetica',
        '&:active': {
            color: '#353B51',
            border: '1.5px solid #F2F3F4',
            backgroundColor: '#F2F3F4',
        },
        '&:hover': {
            border: '1.5px solid #F2F3F4'
        },
    },
    // User Button (selected)
    selectedbutton: {
        color: '#FFFFFF',
        textTransform: 'none',
        fontSize: '18px',
        border: '1.5px solid #FFFFFF',
        fontFamily: 'Helvetica',
        '&:active': {
            color: '#353B51',
            border: '1.5px solid #F2F3F4',
            backgroundColor: '#F2F3F4',
        },
        '&:hover': {
            border: '1.5px solid #FFFFFF'
        },
    },
}

export default styles;