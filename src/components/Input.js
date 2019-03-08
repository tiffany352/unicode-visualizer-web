/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React, { Component } from 'react'
import Form from './Form'
import './Input.css'
import StringBlob, { Encoding } from '../StringBlob'

export default class Input extends Component {
  state = {
    text: '',
  }

  render () {
    const blob = StringBlob.stringDecode(Encoding.UTF16, this.state.text)
    return (
      <Form path={() => `/inspect/${blob.urlEncode()}`}>
        <input
          className="Input-text"
          type="text"
          value={this.state.text}
          onChange={this.textChanged}
          placeholder="Enter string to inspect..." />
        <input className="Input-button" type="submit" value="Inspect" />
      </Form>
    )
  }

  textChanged = (event) => {
    this.setState({
      text: event.target.value,
    })
  }
}
