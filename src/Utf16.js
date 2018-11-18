import GraphemeSplitter from 'grapheme-splitter'

function decimalToHex (d, padding) {
  let hex = Number(d).toString(16)

  while (hex.length < padding) {
      hex = "0" + hex
  }

  return hex
}

class Utf16 {
  constructor (str) {
    this.str = str
  }

  makePair (high, low) {
    const highBits = high - 0xD800
    const lowBits = low - 0xDC00
    return (highBits << 10) + lowBits + 0x10000
  }

  codeunits () {
    const codeunits = []

    for (let i = 0; i < this.str.length; i++) {
      const code = this.str.charCodeAt(i)
      codeunits.push({
        value: code,
        text: decimalToHex(code, 4),
      })
    }

    return codeunits
  }

  codepoints () {
    const codepoints = []

    let highSurrogate = null
    let lowSurrogate = null
    for (let i = 0; i < this.str.length; i++) {
      const code = this.str.charCodeAt(i)
      const isHigh = code >= 0xD800 && code <= 0xDBFF
      const isLow = code >= 0xDC00 && code <= 0xDFFF

      if (isHigh) {
        if (lowSurrogate) {
          codepoints.push({
            first: i - 1,
            last: i,
            value: this.makePair(code, lowSurrogate)
          })
          lowSurrogate = null
        }
        else if (highSurrogate) {
          codepoints.push({
            first: i - 1,
            last: i - 1,
            value: null
          })
          highSurrogate = code
        }
        else {
          highSurrogate = code
        }
      }
      else if (isLow) {
        if (highSurrogate) {
          codepoints.push({
            first: i - 1,
            last: i,
            value: this.makePair(highSurrogate, code)
          })
          highSurrogate = null
        }
        else if (lowSurrogate) {
          codepoints.push({
            first: i - 1,
            last: i - 1,
            value: null
          })
          lowSurrogate = code
        }
        else {
          lowSurrogate = code
        }
      }
      else { // normal
        if (lowSurrogate || highSurrogate) {
          codepoints.push({
            first: i - 1,
            last: i - 1,
            value: null
          })
          lowSurrogate = null
          highSurrogate = null
        }
        codepoints.push({
          first: i,
          last: i,
          value: code
        })
      }
    }

    return codepoints
  }

  graphemes () {
    const splitter = new GraphemeSplitter()
    const strings = splitter.splitGraphemes(this.str)
    const graphemes = []

    let offset = 0
    for (let i = 0; i < strings.length; i++) {
      graphemes.push({
        first: offset,
        last: offset + strings[i].length - 1,
        text: strings[i]
      })
      offset += strings[i].length
    }

    return graphemes
  }
}

export default Utf16
