/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React, { Component } from 'react'
import './App.css'
import Input from './Input'
import Data from './Data'
import InfoPage from './InfoPage'

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
          <InfoPage />
        </div>
      </div>
    )
  }
}

export default App
