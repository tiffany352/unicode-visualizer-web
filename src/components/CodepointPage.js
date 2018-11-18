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

const generalCategory = {
  Lu: 'Letter, uppercase',
  Ll: 'Letter, lowercase',
  Lt: 'Letter, titlecase',
  Lm: 'Letter, modifier',
  Lo: 'Letter, other',
  Mn: 'Mark, nonspacing',
  Mc: 'Mark, spacing combining',
  Me: 'Mark, enclosing',
  Nd: 'Number, decimal digit',
  Nl: 'Number, letter',
  No: 'Number, other',
  Pc: 'Punctuation, connector',
  Pd: 'Punctuation, dash',
  Ps: 'Punctuation, open',
  Pe: 'Punctuation, close',
  Pi: 'Punctuation, initial quote',
  Pf: 'Punctuation, final quote',
  Po: 'Punctuation, other',
  Sm: 'Symbol, math',
  Sc: 'Symbol, currency',
  Sk: 'Symbol, modifier',
  So: 'Symbol, other',
  Zs: 'Separtaor, space',
  Zl: 'Separtaor, line',
  Zp: 'Separator, paragraph',
  Cc: 'Other, control',
  Cf: 'Other, format',
  Cs: 'Other, surrogate',
  Co: 'Other, private use',
  Cn: 'Other, not assigned'
}

const propsTable = {
  blk: 'Block',
  na: 'Name',
  age: (value) => ['Appeared', 'Unicode ' + value],
  gc: (value) => ['General Category', `${generalCategory[value]} (${value})`]
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

    const convertToDisplay = (prop, value) => {
      let displayName = propsTable[prop] || prop
      let displayValue = value
      const entry = propsTable[prop]
      if (entry instanceof Function) {
        [displayName, displayValue] = entry(value)
      }
      return [displayName, displayValue]
    }

    const data = []
    for (const [prop] of Object.entries(propsTable)) {
      data.push(convertToDisplay(prop, props[prop]))
    }
    const yesValues = []
    const noValues = []
    for (const [prop, value] of Object.entries(props)) {
      if (value === 'Y') {
        yesValues.push(convertToDisplay(prop, value)[0])
      }
      else if (value === 'N') {
        noValues.push(convertToDisplay(prop, value)[0])
      }
    }
    data.sort((a, b) => a[0] < b[0])
    data.push(['Has Properties', yesValues.join(', ')])
    data.push(['Missing Properties', noValues.join(', ')])

    const elements = data.map(([name, value]) => (
      <React.Fragment key={name}>
        <dt>{name}</dt>
        <dd>{value}</dd>
      </React.Fragment>
    ))

    return (
      <div className="CodepointPage-container">
        <h1>
          U+{decimalToHex(this.props.codepoint, 4)} {props.na}
        </h1>
        <dl>
          {elements}
        </dl>
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
      this.download()
    }
  }
}

export default CodepointPage
