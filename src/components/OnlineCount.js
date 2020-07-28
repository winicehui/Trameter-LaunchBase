import React, { Component } from 'react';

import { Grid, Fade } from '@material-ui/core'

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
        return (
            isLoaded ?
                <Fade in={isLoaded}>
                    <Grid item xs={12}>
                        <h4 style={{ textAlign: 'right', margin: '0px', color: '#FFFFFF' }}> Online Total: {numOnlineChannels} </h4>
                    </Grid>
                </Fade>
                : null 
        )
    }
}

export default OnlineCount;