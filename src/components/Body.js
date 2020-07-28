import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";
import { Switch, Tooltip } from '@material-ui/core'

import ToolBar from './ToolBar'
import OnlineTable from './OnlineTable'
import OfflineTable from './OfflineTable'

import users_list from '../static/Usertypes'

import firebase from '../firebase'
import styles from '../styles/TableStyles'

class Body extends Component {
    constructor(props) {
        super(props)
        this.state = {
            chosenCategoryId: '',
            web: 'Online', 

            editMode: false,

            categories: [], 
            isLoaded: false, 
        }

        this.toggleEditMode = this.toggleEditMode.bind(this)
    }

    componentDidMount(){
        const catRef = firebase.database().ref('/categories')
        catRef.on('value', (snapshot) => { // called each time order of categories changes
            let categories = [];
            users_list.forEach((user) => {
                snapshot.forEach((categorySnapShot) => {
                    let newCategory = {
                        name: categorySnapShot.val(), // name of category
                        id: categorySnapShot.key, // id of category
                        user: user // user
                    }
                    categories.push(newCategory)
                })
            })
            this.setState({ categories: categories })
        })
    }

    handleToggleCategory = (categoryId) => {
        this.setState({ chosenCategoryId: categoryId })
    }

    handleToggleWeb = (web) => {
        this.setState({ web: web })
    }

    toggleEditMode = (e) => {
        const { editMode } = this.state
        this.setState({ editMode: !editMode })
    }

    render() {
        const { chosenCategoryId, web, categories, editMode } = this.state
        const { classes } = this.props
        return (
            <React.Fragment> 
                    <ToolBar 
                        handleToggleCategory = {this.handleToggleCategory} 
                        handleToggleWeb = {this.handleToggleWeb}
                    />
                    { !chosenCategoryId 
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
                                        chosenCategoryId={chosenCategoryId}
                                        categories = {categories}
                                        editMode = {editMode}
                                    />
                                    : <OfflineTable
                                        editMode={editMode}
                                    />
                                }
                        </div> 
                    }
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(Body);