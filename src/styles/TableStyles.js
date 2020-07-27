const styles = {
    // textField components for editRow cells
    textfield: {
        color: '#707070',
        margin: '0px',
        padding: '0px',
        "&:hover": {
            color: '#2B2B2B',
        },
    },
    // select components for editRow cells
    select: {
        color: '#707070',
        "&:focus": {
            backgroundColor: "#FFFFFF"
        },
        "&:hover": {
            color: '#2B2B2B',
        },
    },
    //autocomplete textfield for editRow cells
    autocomplete_textfield: {
        color: '#707070'
    },
    // rows (edit + normal)
    tableRow: {
        color: '#707070',
        "& td": {
            border: "1px solid black !important",
        }
    },
    // cellStyle 
    cell:{
        margin: '0px',
        padding: '10px',
        // textAlign: 'center',
        wordBreak: 'break-word',
        hyphens: 'auto',
    },
    // toolBar 
    toolBar: {
        padding: '0px',
        margin: '0px',
        display: 'flex'
    },
    //sub/link styling
    hyperlink: {
        textAlign: 'center',
        "&:link": {
            color: '#353B51',
        },
        "&:hover": {
            color: '#2B2B2B',
        },
        "&:visited": {
            color: '#663366',
        },
    },
    // channel count styling
    channel_count: {
        fontSize: '16px',
        float: 'right',
        margin: '10px 0px 10px 0px',
        padding: '10px 15px 10px 15px',
        border: '1px solid #707070',
        color: '#707070',
        borderRadius: '5px'
    },
    //editMode switch
    switchBase: {
        color: '#707070',
        "&$checked": {
            color: '#353B51',
            '& + $track': {
                backgroundColor: '#353B51',
                opacity: 1,
                border: 'none',
            },
        },
    },
    checked: {
        color: '#353B51'
    },
    track: {
        backgroundColor: '#353B51'
    }
}

export default styles;