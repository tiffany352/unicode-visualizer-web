import React from 'react'
import { withRouter } from 'react-router-dom'

class NavForm extends React.Component {
  submitHandler = (event) => {
    event.preventDefault()
    this.props.history.push(this.props.path())
  }

  render() {
    return (
      <form onSubmit={this.submitHandler}>
        {this.props.children}
      </form>
    )
  }
}

export default withRouter(NavForm)
