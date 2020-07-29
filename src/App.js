import React, { Component } from 'react';

import Header from './components/Header'
import Body from './components/Body'

import { Fab } from '@material-ui/core';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import ScrollUpButton from 'react-scroll-up-button'

import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.anchor = React.createRef()
  }

  render() {
    return (
      <div>
        <Header />
        <Body />
        <ScrollUpButton 
          ContainerClassName="AnyClassForContainer"
          TransitionClassName="AnyClassForTransition"
        > 
            <Fab color="secondary" size="medium" aria-label="scroll back to top">
              <KeyboardArrowUpIcon />
            </Fab>
        </ScrollUpButton>
      </div>
    );
  }
}

export default App;