const styles = {
    input: {
        color: '#F2F3F4',
        borderBottomColor: '#F2F3F4',
        '&:hover': {
            borderBottomColor: '#F2F3F4',//its when its hover and input is focused 
        },
        '&:after': {
            borderBottomColor: '#F2F3F4',//when input is focused, Its just for example. Its better to set this one using primary color
        },
        '&:before': {
            borderBottomColor: '#F2F3F4',// when input is not touched
        },
    },
}

export default styles;