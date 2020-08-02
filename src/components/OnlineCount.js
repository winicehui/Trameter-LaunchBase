import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";
import { Grid, Fade } from '@material-ui/core'
import styles from '../styles/HeaderStyles'
import firebase from '../firebase'

class OnlineCount extends Component {
    constructor(props) {
        super(props)
        this.state = {
            numOnlineChannels: 0,
            isLoaded: false
        }
    }

    componentDidMount() {
        const onlineRef = firebase.database().ref('/online_channels');
        onlineRef.on('value', (snapshot) => {
            let numPosts = snapshot.numChildren();
            this.setState({
                numOnlineChannels: numPosts,
                isLoaded: true
            })
        })
    }

    render() {
        const { numOnlineChannels, isLoaded } = this.state
        const { classes } = this.props
        return (
            isLoaded ?
                <Fade in={isLoaded}>
                    <Grid item xs={12}>
                        <h4 className={classes.count}> Online Total: {numOnlineChannels} </h4>
                    </Grid>
                </Fade>
                : null 
        )
    }
}

export default withStyles(styles)(OnlineCount);