import React, { Component } from 'react';

import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core'

import firebase from '../firebase'

class Body extends Component {
    constructor(props) {
        super(props)
        this.state = {
            categories: [],
            isLoaded: false
        }
    }

    componentDidMount() {
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


    render() {
        const { categories, isLoaded } = this.state
        return (
            isLoaded ? 
            <Autocomplete
                multiple
                options={this.state.categories}
                // getOptionLabel={(option) => option.title}
                defaultValue={[]}
                renderInput={(params) => (
                    <TextField
                        {...params}
                    />
                )}
            />
            : null
        );
    }
}

export default Body;