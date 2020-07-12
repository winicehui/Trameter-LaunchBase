const styles = {
    textfield: {
        borderBottomColor: '#353B51',
        minWidth: '50px',
        padding: '8px',
        '& .MuiInput-underline:after': {
            borderBottomColor: '#353B51',
        }
    },
    selectedButton: {
        backgroundColor: '#707070',
        color: '#FFFFFF',
        "&:hover": {
            backgroundColor: '#707070',
            color: '#FFFFFF',
        }
    },
    isDraggingButton: {
        backgroundColor: '#D6DADD',
        color: '#707070',
        "&:hover": {
            color: '#2B2B2B'
        }
    },
    Button: {
        backgroundColor: '#FFFFFF',
        color: '#707070',
        "&:hover": {
            color: '#2B2B2B',
            backgroundColor: '#FFFFFF'
        }
    }
}

export default styles;