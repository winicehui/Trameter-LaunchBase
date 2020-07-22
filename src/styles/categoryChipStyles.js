const styles = {
    textfield: {
        borderBottomColor: '#353B51',
        minWidth: '50px',
        padding: '8px',
        '& .MuiInput-underline:after': {
            borderBottomColor: '#353B51',
        }
    },
    // Selected Button
    selectedButton: {
        backgroundColor: '#707070',
        color: '#FFFFFF',
        "&:hover": {
            backgroundColor: '#707070',
            color: '#FFFFFF',
        }
    },
    // Dragging Button
    isDraggingButton: {
        backgroundColor: '#D6DADD',
        color: '#707070',
        "&:hover": {
            color: '#2B2B2B'
        }
    },
    // Regular Button
    Button: {
        backgroundColor: '#FFFFFF',
        color: '#707070',
        "&:hover": {
            color: '#2B2B2B',
            backgroundColor: '#F2F3F4'
        }
    }
}

export default styles;