import React, { Component } from 'react'
import './App.css'
import Input from './Input'
import Data from './Data'

class App extends Component {
  render () {
    return (
      <div className="App">
        <div className='App-header'>
          <Input />
        </div>
        <div className='App-content'>
          <div className='App-contentContainer'>
            <Data />
          </div>
        </div>
        <div className='App-sidebar'>
        </div>
      </div>
    )
  }
}

export default App