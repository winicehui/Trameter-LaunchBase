import React, { Component } from 'react';

import ToolBar from './ToolBar'
import OnlineTable from './OnlineTable'
import users_list from '../static/Usertypes'

class Body extends Component {
    constructor(props) {
        super(props)
        this.state = {
            chosenCategoryId: '',
            web: 'Online', 
        }
    }

    handleToggleCategory = (categoryId) => {
        this.setState({ chosenCategoryId: categoryId})
    }

    handleToggleWeb = (web) => {
        this.setState({ web: web })
    }

    render() {
        const { chosenCategoryId, web} = this.state
        console.log(chosenCategoryId)
        return (
            <React.Fragment> 
                    <ToolBar 
                        handleToggleCategory = {this.handleToggleCategory} 
                        handleToggleWeb = {this.handleToggleWeb}
                    />
                    { !chosenCategoryId 
                        ? null 
                        : web === 'Online' 
                            ? <OnlineTable
                                chosenCategoryId={chosenCategoryId}
                                web={web}
                            />
                            : null 
                    }
            </React.Fragment>
        );
    }
}

export default Body;