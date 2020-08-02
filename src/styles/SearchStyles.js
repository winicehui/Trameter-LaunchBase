const styles = {
    //textField styling
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
    //title of Channel 
    title: {
        margin: '0px', 
        fontSize: '15px', 
        color: '#353B51'
    }, 
    // descrption of category + user of Channel
    location: {
        margin: '0px', 
        fontSize: '13px', 
        color: '#707070'
    }
}

export default styles;