import React, { Component } from 'react';

import Header from './components/Header'
import Body from './components/Body'

import { Fab, Button } from '@material-ui/core';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import ScrollUpButton from 'react-scroll-up-button'

import firebase from "./firebase"
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"

import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isSignedIn: false, 
      isLoaded: false
    }
    this.anchor = React.createRef()
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({
        isSignedIn: !!user, 
        isLoaded: true
      })
    })
  }

  render() {
    let uiConfig = {
      signInFlow: "popup",
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
      ], 
      callbacks: { 
        signInSuccess: () => false
      }
    }
    const { isLoaded } = this.state
    return ( isLoaded 
      ? <div>
        { this.state.isSignedIn
          ? <React.Fragment>
            <Button 
              variant="contained" 
              size="small" 
              style={{ 
                backgroundColor: '#F2F3F4', 
                textTransform: 'none', 
                color: '#353B51', 
                float: 'left', 
                margin: '20px 0px 0px 30px' 
              }}
              onClick={() => firebase.auth().signOut()}
            > Sign Out 
            </Button>
            <Header />
            <Body />
            <ScrollUpButton
              ContainerClassName="AnyClassForContainer"
              TransitionClassName="AnyClassForTransition"
            >
              <Fab style={{ backgroundColor: '#CC5F72', color: '#FFFFFF' }} size="medium" aria-label="scroll back to top">
                <KeyboardArrowUpIcon />
              </Fab>
            </ScrollUpButton>
          </React.Fragment> 
          : <StyledFirebaseAuth
            uiConfig = {uiConfig}
            firebaseAuth = {firebase.auth()}/>}
        </div>
      : null 
    );
  }
}

export default App;