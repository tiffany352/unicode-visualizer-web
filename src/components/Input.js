import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import setText from '../actions/setText'
import './Input.css'

class Input extends Component {
  constructor (props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
  }

  render () {
    return (
      <div className="Input">
        <input
          className="Input-text"
          type="text"
          value={this.props.text}
          onChange={this.handleChange}
          placeholder="Enter string to inspect..." />
      </div>
    )
  }

  handleChange (event) {
    this.props.textChanged(event.target.value)
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
      dispatch(setText(text, confirm))
  }
}

const ConnectedInput = connect(mapStateToProps, mapDispatchToProps)(Input)

export default ConnectedInput
