import React, { Component } from 'react';
import { withRouter } from "react-router";
import { withStyles } from "@material-ui/core/styles";
import { Switch, Tooltip } from '@material-ui/core'

import ToolBar from './ToolBar'
import OnlineTable from './OnlineTable'
import OfflineTable from './OfflineTable'

import users_list from '../static/Usertypes'
import styles from '../styles/TableStyles'

import firebase from '../firebase'

class Body extends Component {
    constructor(props) {
        super(props)
        this.state = {
            web: 'Online', 
            editMode: false,
            categories: [], 
            
            showTable: false
        }
        this.toggleEditMode = this.toggleEditMode.bind(this)
    }

    componentDidMount(){
        const catRef = firebase.database().ref('/categories')
        catRef.on('value', (snapshot) => { // called each time order of categories changes
            let categories = [];
            users_list.forEach((user) => {
                snapshot.forEach((categorySnapShot) => {
                    categories.push({
                        name: categorySnapShot.val(), // name of category
                        id: categorySnapShot.key, // id of category
                        user: user // user
                    })
                })
            })
            this.setState({ categories: categories })
        })
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const web = nextProps.location.pathname.substring(1)  || 'Online'
        const params = new URLSearchParams(window.location.search)
        const id = params.get('id')
        const user = params.get('user')
        const showTable = (id && user && web === 'Online') || ((web === 'Online') && !id && !user) || (web === 'Offline') ? true : false 
        
        return (web.toLowerCase() !== prevState.web.toLowerCase() || showTable !== prevState.showTable)
            ? { web: web, showTable: showTable } 
            : null
    }

    toggleEditMode = (e) => {
        const { editMode } = this.state
        this.setState({ editMode: !editMode })
    }

    render() {
        const { web, editMode, categories, showTable } = this.state
        const { classes } = this.props
        return (
            <React.Fragment> 
                    <ToolBar />
                    { !showTable 
                        ? null 
                        : <div> 
                            <Tooltip title={!editMode ? "Turn ON Edit Mode" : "Turn OFF Edit Mode"} placement="bottom">
                                <Switch
                                    checked={editMode}
                                    onChange={this.toggleEditMode}
                                    classes={{
                                        switchBase: classes.switchBase,
                                        checked: classes.checked,
                                        track: classes.track
                                    }}
                                />
                            </Tooltip>
                                { web === 'Online' 
                                    ? <OnlineTable
                                        categories = {categories}
                                        editMode = {editMode}
                                    />
                                    : <OfflineTable
                                        editMode={editMode}
                                    />
                                    // :null 
                                }
                        </div> 
                    }
            </React.Fragment>
        );
    }
}

export default withRouter(withStyles(styles)(Body));