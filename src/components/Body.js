import React, { Component } from 'react';
import { withRouter } from "react-router";

import ToolBar from './ToolBar'
import Table from './Table'
import users_list from '../static/Usertypes'

class Body extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pathname: '',
            isLoaded: false, 

            chosenCategory: '',
            web: 'Online'
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

    handleToggleCategory = (category) => {
        this.setState({ chosenCategory: category})
    }

    handleToggleWeb = (web) => {
        this.setState({ web: web })
    }

    render() {
        const {pathname, isLoaded, chosenCategory, web} = this.state
        return (
            isLoaded 
            ?   <React.Fragment> 
                    <ToolBar pathname={pathname} handleToggleCategory = {this.handleToggleCategory} handleToggleWeb = {this.handleToggleWeb}/>
                    <Table pathname = {pathname} chosenCategory = {chosenCategory} web = {web}/>
                </React.Fragment>
            : null
        );
    }
}

export default withRouter(Body);