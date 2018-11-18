import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Utf16 from '../Utf16'
import './Data.css'
import setInfoPage from '../actions/setInfoPage';
import Utf8 from '../Utf8';
import { decimalToHex } from '../Util'

function createCodepointPredicate(index) {
  return (codepoint) => {
    return codepoint.first === index
  }
}

class Data extends Component {
  render () {
    const legends = [ 'Offset', 'Codeunit', 'Codepoint', 'Grapheme Cluster' ]
      .map((legend) => {
      return (
        <th key={legend}>
          {legend}
        </th>
      )
    })

    const text = this.props.text
    var encoding = null
    switch (this.props.encoding) {
      case 'UTF-8':
      encoding = new Utf8(text);
      break;
      case 'UTF-16':
      default:
      encoding = new Utf16(text);
      break;
    }
    const codeunits = encoding.codeunits()
    const codepoints = encoding.codepoints()
    const graphemes = encoding.graphemes()

    const rows = []
    for (var i = 0; i < codeunits.length; i++) {
      const codeHex = codeunits[i].text
      const codepoint = codepoints.find(createCodepointPredicate(i))
      const codepointData = codepoint &&
        <td key={`Codepoint${i}`} rowSpan={codepoint.last - codepoint.first + 1} className='Data-left Data-codepoint'>
          <a className='Data-codepointButton'
            onClick={() => this.props.selectCodepoint(codepoint.value)}>
            {codepoint.value
              ? (
                <React.Fragment>
                  <span className='Data-numeric'>
                    U+{decimalToHex(codepoint.value, 4)}
                  </span>
                  &nbsp;
                  {String.fromCodePoint(codepoint.value)}
                </React.Fragment>
              )
              : "Invalid UTF-16"
            }
          </a>
        </td>
      const grapheme = graphemes.find(createCodepointPredicate(i))
      const graphemeData = grapheme &&
        <td key={`Grapheme${i}`} rowSpan={grapheme.last - grapheme.first + 1} className='Data-grapheme'>
          {grapheme.text}
        </td>
      const element = (
        <tr key={`Row${i}`}>
          <td className='Data-numeric Data-right Data-offset'>{i}</td>
          <td className='Data-numeric Data-codeunit'>{codeHex}</td>
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

Data.propTypes = {
  text: PropTypes.string.isRequired
}

const mapStateToProps = state => {
  return {
    text: state.text,
    encoding: state.encoding
  }
}

const mapDispatchToProps = dispatch => {
  return {
    selectCodepoint: (codepoint) => {
      dispatch(setInfoPage('codepoint', codepoint))
    }
  }
}

const ConnectedData = connect(mapStateToProps, mapDispatchToProps)(Data)

export default ConnectedData
