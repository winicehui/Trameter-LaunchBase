import React, { Component } from 'react';
import { withRouter } from "react-router";

import { Grid, Button } from '@material-ui/core'
import { withStyles } from "@material-ui/core/styles";

import OnlineCount from './OnlineCount'
import OfflineCount from './OfflineCount'
import Search from './Search'

import users_list from '../static/Usertypes'
import styles from '../styles/HeaderStyles'

import firebase from '../firebase'

class Header extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: ''
        }
        this.onClick = this.onClick.bind(this);
        this.toggleUser = this.toggleUser.bind(this);
    }

    componentDidMount(){
        const params = new URLSearchParams(window.location.search)
        const user = params.get('user') || users_list[0]
        this.setState({ user: user })
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const params = new URLSearchParams(nextProps.location.search)
        const user = params.get('user') || users_list[0]
        return (user.toLowerCase() !== prevState.user.toLowerCase())
            ? { user: user }
            : null
    }
    
    onClick() {
        this.props.history.push({
            pathname: '/'
        })
    }    

    toggleUser = (user) => {
        const params = new URLSearchParams(window.location.search)
        params.set('user', user)

        const web = this.props.location.pathname.substring(1) || 'Online'
        
        if (web.toLowerCase() === 'Online'.toLowerCase()){
            firebase.database().ref('/order/' + user).once('value').then((snapshot) => {
                let firstCatId = snapshot.val() ? snapshot.val()[0] : null 
                if (firstCatId) {
                    params.set('id', firstCatId)
                }
                const url = '?' + params.toString()
                this.props.history.push({
                    search: url
                })
            })
        } else {
            const url = '?' + params.toString()
            this.props.history.push({
                search: url
            })
        }
    }

    render() {
        const { classes } = this.props;
        const { user } = this.state
        return (
            <div className = "Header">
                <Grid container 
                    alignItems = 'center'
                    justify = 'center'
                >
                        <Grid item xs={2} align = "left">
                        <Button variant="contained" size="small" style={{ backgroundColor: '#F2F3F4', textTransform: 'none', color: '#353B51', float: 'left', margin: '0px' }}
                            onClick={() => firebase.auth().signOut()}> Sign Out </Button>
                        </Grid>
                        <Grid item xs={8} align="center">
                            < h1 className="Title" onClick={this.onClick}> LaunchBase </h1>
                        </Grid> 
                        <Grid item xs={2} align= "center">
                            <Grid container
                                direction = "column"
                                justify="center"
                                alignItems="flex-end">
                                    <OnlineCount />
                                    <OfflineCount />
                            </Grid>
                        </Grid>
                </Grid>

                <Grid
                    container
                    alignItems='center'
                    justify='center'
                    spacing = {4}
                >
                    {users_list.map((element, i) =>
                        (<Grid item xs={7} sm={4} md={3} lg={2} key={i}>
                            <Button 
                                className={ 
                                    user.toLowerCase() === element.toLowerCase() 
                                    ? classes.selectedbutton 
                                    : classes.button
                                } 
                                fullWidth 
                                onClick={() => this.toggleUser(element)}
                            > 
                                {element} 
                            </Button>
                        </Grid>)
                    )}

                    <Grid item xs={7} sm={4} md={3} lg={2}>
                        <Search/>
                    </Grid>
                </Grid>
            </div>
        ) 
    }
}

export default  withRouter(withStyles(styles)(Header));