import React, { Component } from 'react';
import { withRouter } from "react-router";
import { withStyles } from "@material-ui/core/styles";
import { Switch, Tooltip } from '@material-ui/core'

import ToolBar from './ToolBar'
import OnlineTable from './OnlineTable'
import OfflineTable from './OfflineTable'

import styles from '../styles/TableStyles'

import firebase from '../firebase'

class Body extends Component {
    constructor(props) {
        super(props)
        this.state = {
            web: 'Online', 
            editMode: false,
            authorizedUsers: [],
            
            showTable: false
        }
        this.toggleEditMode = this.toggleEditMode.bind(this)
    }

    componentDidMount(){
        firebase.database().ref('authorizedEmails').on('value', (snapshot) => {
            let authorizedUsers = snapshot.val()
            this.setState({ authorizedUsers: authorizedUsers })
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
        const { web, editMode, authorizedUsers, showTable } = this.state
        const { classes } = this.props

        let canEdit = authorizedUsers.includes(firebase.auth().currentUser.email)

        return (
            <React.Fragment> 
                    <ToolBar />
                    { !showTable 
                        ? null 
                        : <div> 
                            {canEdit ? 
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
                            : null}
                                { web === 'Online' 
                                    ? <OnlineTable
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