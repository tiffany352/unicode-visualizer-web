/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import './App.css'
import Input from './Input'
import Index from './Pages/Index'
import Inspect from './Pages/Inspect'
import Codepoint from './Pages/Codepoint'

class App extends Component {
  render () {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <div className="App">
          <div className='App-header'>
            <Link to="/" className="App-logo">Home</Link>
            <Input />
          </div>
          <Route path="/" exact component={Index} />
          <Route path="/inspect/:blob" component={Inspect} />
          <Route path="/codepoint/u+:code" component={Codepoint} />
        </div>
      </Router>
    )
  }
}

export default App
