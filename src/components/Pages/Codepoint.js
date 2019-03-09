import React from 'react'
import { withRouter } from 'react-router-dom'
import CodepointPage from '../CodepointPage'

class Codepoint extends React.Component {
  render() {
    const { match } = this.props

    const codepoint = parseInt(match.params.code, 16)

    return (
      <div className="App-content">
        <div className='App-contentContainer'>
          <CodepointPage codepoint={codepoint} />
        </div>
      </div>
    )
  }
}

export default withRouter(Codepoint)
