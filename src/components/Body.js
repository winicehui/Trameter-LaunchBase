import React, { Component } from 'react';

import ToolBar from './ToolBar'
import OnlineTable from './OnlineTable'

import { Fade } from '@material-ui/core'

import firebase from '../firebase'

class Body extends Component {
    constructor(props) {
        super(props)
        this.state = {
            chosenCategoryId: '',
            web: 'Online', 

            categories: [], 
            isLoaded: false
        }
    }

    componentDidMount(){
        console.log("componentDidMount")
        const catRef = firebase.database().ref('/categories')
        catRef.on('value', (snapshot) => { // called each time order of categories changes
            let categories = [];
            snapshot.forEach((categorySnapShot) => {
                let category = categorySnapShot.val()
                categories.push(category)
            })
            this.setState({
                categories: categories 
            })
        })
    }

    handleToggleCategory = (categoryId) => {
        this.setState({ chosenCategoryId: categoryId })
    }

    handleToggleWeb = (web) => {
        this.setState({ web: web })
    }

    render() {
        const { chosenCategoryId, web, categories} = this.state
        return (
            <React.Fragment> 
                    <ToolBar 
                        handleToggleCategory = {this.handleToggleCategory} 
                        handleToggleWeb = {this.handleToggleWeb}
                    />
                    { !chosenCategoryId 
                        ? null 
                        : web === 'Online' 
                            ? <Fade in = {true}> 
                                <OnlineTable
                                    chosenCategoryId={chosenCategoryId}
                                    categories = {categories}
                                />
                        </Fade>
                            : null 
                    }
            </React.Fragment>
        );
    }
}

export default Body;