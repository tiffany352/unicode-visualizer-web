import React from 'react'
import './CodepointPage.css'
import { fetchCompressedDatabase } from '../Unicode';

function decimalToHex (d, padding) {
  var hex = Number(d).toString(16)

  while (hex.length < padding) {
      hex = "0" + hex
  }

  return hex
}

class CodepointPage extends React.Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    const props = this.state.data
    if (!props) {
      return (
        <div className="CodepointPage-container">
          <h1>Loading...</h1>
        </div>
      )
    }
    const data = []
    if (this.state.data) {
      for (const [name, value] of Object.entries(this.state.data)) {
        data.push(
          <li key={name}>{name} = {value}</li>
        )
      }
    }
    return (
      <div className="CodepointPage-container">
        <h1>
          U+{decimalToHex(this.props.codepoint, 4)} {props.na}
        </h1>
        <ul>
          {data}
        </ul>
      </div>
    )  
  }

  async download () {
    try {
      const unicode = await fetchCompressedDatabase()
      const codepoint = this.props.codepoint
      if (codepoint) {
        this.setState({
          data: unicode.getCodepoint(codepoint)
        })
      }
    }
    catch(e) {
      console.log(e)
    }
  }

  componentDidMount () {
    if (this.props.codepoint) {
      this.download()
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.codepoint !== this.props.codepoint && this.props.codepoint) {
      console.log("componentDidUpdate")
      this.download()
    }
  }
}

export default CodepointPage
