import React from 'react'
import { withRouter } from 'react-router-dom'
import Data from '../Data'
import StringBlob from '../../StringBlob'
import './Inspect.css'

class Inspect extends React.Component {
  render() {
    const { match } = this.props

    const blob = StringBlob.urlDecode(match.params.blob)

    return (
      <div className="App-content">
        <div className='App-contentContainer'>

          <button
            className="Inspect-button"
            onClick={this.normalizeNFC}>
            NFC
          </button>
          <button
            className="Inspect-button"
            onClick={this.normalizeNFD}>
            NFD
          </button>
          <button
            className="Inspect-button"
            onClick={this.convertUtf8}>
            UTF-8
          </button>
          <button
            className="Inspect-button"
            onClick={this.convertUtf16}>
            UTF-16
          </button>

          <blockquote>
            {blob.stringOf()}
          </blockquote>

          <Data blob={blob} />
        </div>
      </div>
    )  
  }

  transform(func) {
    const { match, history } = this.props

    const blob = StringBlob.urlDecode(match.params.blob)
    const result = func(blob.stringOf())

    history.push(`${result.urlEncode()}`)
  }

  normalizeNFC = (event) =>
    this.transform((str) =>
      StringBlob.fromString(str.normalize('NFC')))

  normalizeNFD = (event) =>
    this.transform((str) =>
      StringBlob.fromString(str.normalize('NFD')))

  convertUtf8 = (event) =>
    this.transform((str) =>
      StringBlob.encodeUtf8(str))

  convertUtf16 = (event) =>
    this.transform((str) =>
      StringBlob.fromString(str))
}

export default withRouter(Inspect)
