import React, { Component } from 'react';

import ToolBar from './ToolBar'
import OnlineTable from './OnlineTable'
import users_list from '../static/Usertypes'

class Body extends Component {
    constructor(props) {
        super(props)
        this.state = {
            chosenCategory: '',
            web: 'Online', 
        }
    }

    handleToggleCategory = (category) => {
        this.setState({ chosenCategory: category})
    }

    handleToggleWeb = (web) => {
        this.setState({ web: web })
    }

    render() {
        const { chosenCategory, web} = this.state
        return (
            <React.Fragment> 
                    <ToolBar 
                        handleToggleCategory = {this.handleToggleCategory} 
                        handleToggleWeb = {this.handleToggleWeb}
                    />
                    { web === 'Online' 
                        ? <OnlineTable
                            chosenCategory={chosenCategory}
                            web={web}
                        />
                        : null 
                    }
            </React.Fragment>
        );
    }
}

export default Body;