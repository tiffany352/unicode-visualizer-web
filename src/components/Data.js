/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import './Data.css'
import { decimalToHex } from '../Util'
import StringBlob from '../StringBlob'

function createCodepointPredicate(index) {
  return (codepoint) => {
    return codepoint.first === index
  }
}

export default class Data extends Component {
  static propTypes = {
    blob: PropTypes.instanceOf(StringBlob),
  }

  render () {
    const legends = [ 'Offset', 'Codeunit', 'Codepoint', 'Grapheme Cluster' ]
      .map((legend) => {
      return (
        <th key={legend}>
          {legend}
        </th>
      )
    })

    const blob = this.props.blob
    const encoder = blob.getEncoder()

    const codeunits = encoder.codeunits()
    const codepoints = encoder.codepoints()
    const graphemes = encoder.graphemes()

    const rows = []
    for (var i = 0; i < codeunits.length; i++) {
      const codeHex = codeunits[i].text
      const codepoint = codepoints.find(createCodepointPredicate(i))
      const codepointData = codepoint &&
        <td key={`Codepoint${i}`} rowSpan={codepoint.last - codepoint.first + 1} className='Data-left Data-codepoint'>
          <Link to={`/codepoint/u+${decimalToHex(codepoint.value, 4)}`}>
            {(codepoint.value && (
              <React.Fragment>
                <span className='Data-numeric'>
                  U+{decimalToHex(codepoint.value, 4)}
                </span>
                &nbsp;
                {String.fromCodePoint(codepoint.value)}
              </React.Fragment>
            )) || codepoint.text || "Invalid UTF-16"}
          </Link>
        </td>
      const grapheme = graphemes.find(createCodepointPredicate(i))
      const graphemeData = grapheme &&
        <td key={`Grapheme${i}`} rowSpan={grapheme.last - grapheme.first + 1} className='Data-grapheme'>
          {grapheme.text}
        </td>
      const element = (
        <tr key={`Row${i}`}>
          <td className='Data-numeric Data-right Data-offset'>{i}</td>
          <td className='Data-numeric Data-codeunit'>
            {codeHex}
            <span className='Data-codeunitClass'>
              &#20; {codeunits[i].class}
            </span>
          </td>
          {codepointData}
          {graphemeData}
        </tr>
      )
      rows.push(element)
    }

    return (
      <table className="Data">
        <thead>
          <tr>
            {legends}
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    )
  }
}
