import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import setText from '../actions/setText'
import './Input.css'
import normalizeText from '../actions/normalizeText';
import setEncoding from '../actions/setEncoding';

class Input extends Component {
  render () {
    return (
      <div className="Input">
        <input
          className="Input-text"
          type="text"
          value={this.props.text}
          onChange={this.handleChange}
          placeholder="Enter string to inspect..." />
        <button
          className="Input-button"
          onClick={this.normalizeNFC}>
          NFC
        </button>
        <button
          className="Input-button"
          onClick={this.normalizeNFD}>
          NFD
        </button>
        <select
          className="Input-button"
          value={this.props.encoding}
          onChange={this.handleEncodingChange}>
          <option value="UTF-8">utf-8</option>
          <option value="UTF-16">utf-16</option>
        </select>
      </div>
    )
  }

  handleChange = (event) => {
    this.props.textChanged(event.target.value)
  }

  normalizeNFC = () => {
    this.props.normalizeText('NFC')
  }

  normalizeNFD = () => {
    this.props.normalizeText('NFD')
  }

  handleEncodingChange = (event) => {
    this.props.setEncoding(event.target.value)
  }
}

Input.propTypes = {
  text: PropTypes.string.isRequired,
  textChanged: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  return {
    text: state.text,
    encoding: state.encoding
  }
}

const mapDispatchToProps = dispatch => {
  return {
    textChanged: (text, confirm) =>
      dispatch(setText(text, confirm)),
    normalizeText: (form) =>
      dispatch(normalizeText(form)),
    setEncoding: (encoding) =>
      dispatch(setEncoding(encoding))
  }
}

const ConnectedInput = connect(mapStateToProps, mapDispatchToProps)(Input)

export default ConnectedInput
