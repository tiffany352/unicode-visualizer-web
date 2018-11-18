import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Utf16 from '../Utf16'
import './Data.css'
import setInfoPage from '../actions/setInfoPage';

function decimalToHex (d, padding) {
  var hex = Number(d).toString(16)

  while (hex.length < padding) {
      hex = "0" + hex
  }

  return hex
}

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
        <th>
          {legend}
        </th>
      )
    })

    const text = this.props.text
    const utf16 = new Utf16(text)
    const codepoints = utf16.codepoints()
    const graphemes = utf16.graphemes()

    const rows = []
    for (var i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i)
      const codeHex = decimalToHex(code, 4)
      const codepoint = codepoints.find(createCodepointPredicate(i))
      const codepointData = codepoint &&
        <td rowspan={codepoint.last - codepoint.first + 1} className='Data-left Data-codepoint'>
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
        <td rowspan={grapheme.last - grapheme.first + 1} className='Data-grapheme'>
          {grapheme.text}
        </td>
      const element = (
        <tr>
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
          {legends}
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
    text: state.text
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
