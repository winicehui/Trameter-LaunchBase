import React, { Component } from 'react';
import { withRouter } from "react-router";

import ToolBar from './ToolBar'
import users_list from '../static/Usertypes'

class Body extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pathname: '',
            isLoaded: false
        }
    }

    componentDidMount() {
        const pathname = this.props.location.pathname.substring(1) || users_list[0]
        this.setState({ pathname: pathname, isLoaded: true })
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return (nextProps.location.pathname.substring(1).toLowerCase() !== prevState.pathname.toLowerCase())
            ? { pathname: nextProps.location.pathname.substring(1) || users_list[0] }
            : null
    }

    render() {
        const {pathname, isLoaded} = this.state
        return (
            isLoaded 
            ? <ToolBar pathname = {pathname}/>
            : null
        );
    }
}

export default withRouter(Body);