const styles = {
    // Online/Offline Selection button
    select: {
        textAlign: 'center',
        fontSize: '17px',
        color: '#707070',
        "&:focus": {
            backgroundColor: "#FFFFFF"
        },
        "&:hover": {
            color: '#2B2B2B', 
            backgroundColor: '#F2F3F4',
            borderRadius: '10px',
        }, 
    },
    // Add TextField
    textfield: {
        borderBottomColor: '#353B51',
        padding: '8px',
        minWidth: '50px',
        '& .MuiInput-underline:after': {
            borderBottomColor: '#353B51',
        }
    }, 
    // Edit/Done/Add Icons
    Icon: {
        cursor: 'pointer',
        // height:'50px',
        height: '65px',
        color: '#707070',
        "&:hover": {
            color: '#2B2B2B'
        },
        "&:focus": {
            color: '#2B2B2B'
        },
        "&:active": {
            color: '#2B2B2B'
        }
    },
    // Toolbar Grid
    Toolbox: {
        borderWidth: '0px 0px 1px 0px',
        borderColor: '#707070',
        borderStyle: 'solid'
    }, 
    // Left Toolbar Grid
    LeftToolbox: {
        borderRight: '1px solid #707070',
        // height: '50px',
        // padding: '10px',
        height: '65px',
        padding: '16px'
    }, 
    // Middle Toolbar Grid
    MiddleToolbox: {
        borderRight: '1px solid #707070',
        // height: '50px',
        height: '65px'
    },
    // Right Toolbar Grid
    RightToolbox: {
        // height: '50px',
        height: '65px'
    },   
}

export default styles;