import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";

import { TextField, InputAdornment, IconButton, Grid } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import styles from '../styles/HeaderStyles'

import firebase from '../firebase'

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            passwordText : '',
            showPassword: false, 
            error: false, 
            errorText: 'Wrong password. Try again.'
        }
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
        this.handleMouseDownPassword = this.handleMouseDownPassword.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
    }

    handleTextChange = (e) => {
        this.setState({ passwordText: e.target.value })
    }

    handleClickShowPassword =  (e) => {
        const { showPassword } = this.state
        this.setState({ showPassword: !showPassword })
    }

    handleMouseDownPassword = (e) => {
        e.preventDefault()
    }

    onKeyPress = (e) => {
        if (e.key === 'Enter') {
            const { passwordText } = this.state
            firebase.database().ref('/password').once('value', (snapshot) => {
                let password = snapshot.val()
                if (passwordText === password) {
                    this.props.toggleAuthentication(true)
                } else {
                    this.setState({
                        passwordText: '', 
                        error: true, 
                    })
                }
            }
            )
        }
    }

    render() {
        const { passwordText, showPassword, error, errorText } = this.state
        const { classes } = this.props
        return (
            <Grid container> 
                <Grid item xs={12} align="center">
                    <TextField 
                        value = {passwordText} 
                        placeholder={'Password'}
                        onChange={this.handleTextChange}
                        onKeyPress={this.onKeyPress}
                        type={showPassword ? 'text' : 'password'}
                        InputProps={{ 
                            endAdornment: (
                                <InputAdornment position="end" >
                                    <IconButton
                                        onClick={this.handleClickShowPassword}
                                        onMouseDown={this.handleMouseDownPassword}
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                        autoFocus
                        className = "centered"
                        variant = "outlined"
                        error = {error}
                        helperText = {error ? errorText : null}
                        classes = {{root: classes.password}}
                        />
                    </Grid>
                </Grid> 
        );
    }
}

export default withStyles(styles)(App);