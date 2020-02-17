/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React, { Component, ChangeEvent } from "react";
import Form from "./Form";
import "./Input.css";
import StringBlob, {
  Encoding,
  encodingToTag,
  encodingFromTag
} from "../StringBlob";
import { decimalToHex } from "../Util";
import RadioSwitch from "./RadioSwitch";
import RadioOption from "./RadioOption";

export default class DataEntry extends Component {
  state = {
    text: "",
    encoding: Encoding.Utf8
  };

  createUrl = () => {
    const data = this.state.text;
    const blob = StringBlob.rawDecode(this.state.encoding, data);
    const text = blob.stringEncode();
    const first = text.codePointAt(0);
    if (text.length === 0) {
      return `#`;
    } else if (first && String.fromCodePoint(first) === text) {
      return `/codepoint/u+${decimalToHex(first, 4)}`;
    } else {
      return `/inspect/${blob.urlEncode()}`;
    }
  };

  render() {
    return (
      <Form path={this.createUrl} className="">
        <RadioSwitch
          value={encodingToTag(this.state.encoding)}
          onSelect={this.onSelect}
        >
          <RadioOption value="utf8">UTF-8</RadioOption>
          <RadioOption value="utf16">UTF-16</RadioOption>
          <RadioOption value="utf32">UTF-32</RadioOption>
          <RadioOption value="windows1252">Windows-1252</RadioOption>
        </RadioSwitch>
        <div className="Input-form">
          <input
            className="Input-text"
            type="text"
            value={this.state.text}
            onChange={this.textChanged}
            placeholder="Enter base16 text..."
          />
          <input className="Input-button" type="submit" value="Inspect" />
        </div>
      </Form>
    );
  }

  onSelect = (value: string) => {
    this.setState({
      encoding: encodingFromTag(value)
    });
  };

  textChanged = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      text: event.target.value
    });
  };
}
