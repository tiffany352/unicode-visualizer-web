/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React, { Component, ChangeEvent } from "react";
import Form from "./Form";
import "./Input.css";
import StringBlob, { Encoding } from "../StringBlob";
import { decimalToHex } from "../Util";

export default class CodepointEntry extends Component {
  state = {
    text: ""
  };

  createUrl = () => {
    const input = this.state.text;
    const array = input.split(/[^0-9a-fA-F]+/g).filter(str => str.length > 0);
    const codepoints = array.map(str => parseInt(str, 16));
    const text = String.fromCodePoint(...codepoints);
    const first = text.codePointAt(0);
    if (text.length === 0) {
      return `#`;
    } else if (first && String.fromCodePoint(first) === text) {
      return `/codepoint/u+${decimalToHex(first, 4)}`;
    } else {
      const blob = StringBlob.stringDecode(Encoding.Utf16, text);
      return `/inspect/${blob.urlEncode()}`;
    }
  };

  render() {
    return (
      <Form path={this.createUrl} className="Input-form">
        <input
          className="Input-text"
          type="text"
          value={this.state.text}
          onChange={this.textChanged}
          placeholder="Enter codepoints..."
        />
        <input className="Input-button" type="submit" value="Inspect" />
      </Form>
    );
  }

  textChanged = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      text: event.target.value
    });
  };
}
