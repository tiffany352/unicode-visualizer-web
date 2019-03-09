import React from 'react'
import { withRouter } from 'react-router-dom'
import Data from '../Data'
import StringBlob, { encodingFromTag, encodingToTag, Encoding } from '../../StringBlob'
import RadioSwitch from '../RadioSwitch'
import RadioOption from '../RadioOption'
import './Inspect.css'

class Inspect extends React.Component {
  render() {
    const { match } = this.props

    const blob = StringBlob.urlDecode(match.params.blob)
    const string = blob.stringEncode()

    const isNFC = string === string.normalize('NFC')
    const isNFD = string === string.normalize('NFD')
    const isNFKC = string === string.normalize('NFKC')
    const isNFKD = string === string.normalize('NFKD')

    const isMojibake = blob.possiblyMojibake()

    return (
      <div className="App-content">
        <div className='App-contentContainer'>

          <RadioSwitch onSelect={this.onNormalize}>
            <RadioOption checked={isNFC} value="NFC" title="Canonical Composition (NFC)">NFC</RadioOption>
            <RadioOption checked={isNFD} value="NFD" title="Canonical Decomposition (NFD)">NFD</RadioOption>
            <RadioOption checked={isNFKC} value="NFKC" title="Compatibility Composition (NFKC)">NFKC</RadioOption>
            <RadioOption checked={isNFKD} value="NFKD" title="Compatibility Decomposition (NFKD)">NFKD</RadioOption>
          </RadioSwitch>

          <RadioSwitch value={encodingToTag(blob.encoding)} onSelect={this.onConvert}>
            <RadioOption value="utf8">UTF-8</RadioOption>
            <RadioOption value="utf16">UTF-16</RadioOption>
            {blob.encoding === Encoding.WINDOWS1252 && <RadioOption value="windows1252">Windows-1252</RadioOption>}
          </RadioSwitch>

          {!isMojibake && <button onClick={this.createMojibake} className="Inspect-button" title="Convert to UTF-8 and then reinterpret as Windows-1252">
            Create Mojibake
          </button>}

          {isMojibake && (
            <button onClick={this.undoMojibake} className="Inspect-button" title="Convert to Windows-1252 and then reinterpret as UTF-8">
              Undo Mojibake
            </button>
          )}

          <blockquote className="Inspect-blockquote">
            {blob.stringEncode()}
          </blockquote>

          <Data blob={blob} />
        </div>
      </div>
    )  
  }

  transform(func) {
    const { match, history } = this.props

    const blob = StringBlob.urlDecode(match.params.blob)
    const result = func(blob)

    history.push(`${result.urlEncode()}`)
  }

  onNormalize = (mode) =>
    this.transform((blob) => blob.normalize(mode))

  createMojibake = () =>
    this.transform((blob) => blob.convert(Encoding.UTF8).reinterpret(Encoding.WINDOWS1252))

  undoMojibake = () =>
    this.transform((blob) => blob.convert(Encoding.WINDOWS1252).reinterpret(Encoding.UTF8))
  
  onConvert = (name) =>
    this.transform((blob) => blob.convert(encodingFromTag(name)))
}

export default withRouter(Inspect)
