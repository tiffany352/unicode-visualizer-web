import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import setText from '../actions/setText'
import './Input.css'
import normalizeText from '../actions/normalizeText';

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
}

Input.propTypes = {
  text: PropTypes.string.isRequired,
  textChanged: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  return {
    text: state.text
  }
}

const mapDispatchToProps = dispatch => {
  return {
    textChanged: (text, confirm) =>
      dispatch(setText(text, confirm)),
    normalizeText: (form) =>
      dispatch(normalizeText(form))
  }
}

const ConnectedInput = connect(mapStateToProps, mapDispatchToProps)(Input)

export default ConnectedInput
