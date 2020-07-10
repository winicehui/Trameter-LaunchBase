import React, { Component } from 'react';
import { withRouter } from "react-router";

import { Grid, Button, TextField } from '@material-ui/core'
import { withStyles } from "@material-ui/core/styles";

import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search';

import users_list from '../static/Usertypes'

import styles from '../styles/HeaderStyles'

class Header extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pathname: ''
        }
        this.toggleUser = this.toggleUser.bind(this);
    }

    componentDidMount(){
        const pathname =  this.props.location.pathname.substring(1) || users_list[0]
        this.setState({ pathname: pathname })
    }

    toggleUser = (user) => {
        this.props.history.push({
            pathname: '/'+ user
        })
    }    

    static getDerivedStateFromProps(nextProps, prevState) {
        return (nextProps.location.pathname.substring(1).toLowerCase() !== prevState.pathname.toLowerCase())
            ? { pathname: nextProps.location.pathname.substring(1) || users_list[0] }
            : null
    }

    render() {
        const { classes } = this.props;
        return (
            <div className = "Header">
                <h1 className = "Title"> LaunchBase </h1>
                <Grid
                    container
                    alignItems='center'
                    justify='center'
                    spacing = {4}
                >
                    {users_list.map((element, i) =>
                        (<Grid item xs={5} sm={3} md={2} lg={2} key={i}>
                            <Button 
                                className={ this.state.pathname.toLowerCase() === element.toLowerCase() 
                                    ? classes.selectedbutton 
                                    : classes.button} 
                                fullWidth 
                                onClick={() => this.toggleUser(element)}
                            > 
                                {element} 
                            </Button>
                        </Grid>)
                    )}

                    <Grid item xs={5} sm={3} md={2} lg={2}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            size="small"
                            type="search"
                            placeholder="Search"
                            className={classes.search}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment>
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            // onChange={this.handleSearch}
                            // value={text}
                        />
                    </Grid>
                </Grid>
            </div>
        ) 
    }
}

export default  withRouter(withStyles(styles)(Header));