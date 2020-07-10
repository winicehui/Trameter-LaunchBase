import React, { Component } from 'react';

import Header from './components/Header'
import ToolBar from './components/ToolBar'

import './App.css'

class App extends Component {
  render() {
    return (
      <div >
        <Header />
        <ToolBar />
      </div>
    );
  }
}

export default App;