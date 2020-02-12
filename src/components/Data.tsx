/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Data.css";
import { decimalToHex } from "../Util";
import StringBlob from "../StringBlob";

function createCodepointPredicate(index: number) {
  return (codepoint: { first: number }) => {
    return codepoint.first === index;
  };
}

type Props = {
  blob: StringBlob;
};

export default class Data extends Component<Props> {
  render() {
    const blob = this.props.blob;

    const codeunits = blob.getCodeunits();
    const codepoints = blob.getCodepoints();
    const graphemes = blob.getGraphemes();

    const cells = [];

    const legends = ["", "Codeunit", "Codepoint", "Grapheme Cluster"];
    cells.push(
      <React.Fragment>
        {legends.map((legend, index) => (
          <div
            className="Data-cell Data-heading"
            key={legend}
            style={{
              gridColumn: index + 1
            }}
          >
            {legend}
          </div>
        ))}
      </React.Fragment>
    );

    for (var i = 0; i < codeunits.length; i++) {
      const codeHex = codeunits[i].text;
      const codepoint = codepoints.find(createCodepointPredicate(i));
      const codepointData = codepoint && (
        <div
          className="Data-cell Data-codepoint"
          key={`Codepoint${i}`}
          style={{
            gridRowStart: codepoint.first + 2,
            gridRowEnd: codepoint.last + 3
          }}
        >
          <Link to={`/codepoint/u+${decimalToHex(codepoint.value || 0, 4)}`}>
            {(codepoint.value && (
              <React.Fragment>
                <span className="Data-numeric">
                  U+{decimalToHex(codepoint.value, 4)}
                </span>
                &nbsp;
                {String.fromCodePoint(codepoint.value)}
              </React.Fragment>
            )) ||
              codepoint.text ||
              "Invalid UTF-16"}
          </Link>
        </div>
      );

      const grapheme = graphemes.find(createCodepointPredicate(i));
      const graphemeData = grapheme && (
        <div
          className="Data-cell Data-grapheme"
          key={`Grapheme${i}`}
          style={{
            gridRowStart: grapheme.first + 2,
            gridRowEnd: grapheme.last + 3
          }}
        >
          {grapheme.text}
        </div>
      );
      const element = (
        <React.Fragment key={`Row${i}`}>
          <div className="Data-cell Data-offset">{i}</div>
          <div className="Data-cell Data-codeunit">
            <span className="Data-numeric">{codeHex}</span>
            <span className="Data-codeunitClass">
              &#20; {codeunits[i].class}
            </span>
          </div>
          {codepointData}
          {graphemeData}
        </React.Fragment>
      );
      cells.push(element);
    }

    return <div className="Data-grid">{cells}</div>;
  }
}
