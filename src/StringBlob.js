import GraphemeSplitter from 'grapheme-splitter'
import * as Utf8 from './Utf8'
import * as Utf16 from './Utf16'

export const Encoding = Object.freeze({
  UTF8: Symbol('utf8'),
  UTF16: Symbol('utf16'),
})

function getEncoder(encoding) {
  switch (encoding) {
    case Encoding.UTF8:
      return Utf8
    case Encoding.UTF16:
      return Utf16
    default:
      throw new Error("Invalid encoding")
  }
}

/*
type CodeunitInfo = {
  value: number,
  text: string,
  class: string
}

type CodepointInfo = {
  value: number|null,
  text: string,
  // code unit offset
  first: number,
  last: number,
}

interface Encoder {
  type Data

  urlEncode(encoded: Data): string
  urlDecode(data: string): Data
  stringEncode(data: Data): string
  stringDecode(input: string): Data
  getCodeunits(data: Data): CodeunitInfo[]
  getCodepoints(data: Data): CodepointInfo[]
}
*/

export default class StringBlob {
  constructor(encoding, encoder, data) {
    this.encoding = encoding
    this.encoder = encoder
    this.data = data
  }

  convert(encoding) {
    return StringBlob.stringDecode(encoding, this.stringEncode())
  }

  normalize(mode) {
    const oldStr = this.stringEncode()
    const newStr = oldStr.normalize(mode)
    return StringBlob.stringDecode(this.encoding, newStr)
  }

  static stringDecode(encoding, string) {
    const encoder = getEncoder(encoding)

    return new StringBlob(encoding, encoder, encoder.stringDecode(string))
  }

  stringEncode() {
    return this.encoder.stringEncode(this.data)
  }

  urlEncode() {
    const encodingNames = {
      [Encoding.UTF8]: 'utf8',
      [Encoding.UTF16]: 'utf16',
    }

    const proto = encodingNames[this.encoding]
    const payload = this.encoder.urlEncode(this.data)

    return `${proto}:${payload}`
  }

  static urlDecode(string) {
    const encodings = {
      'utf8': Encoding.UTF8,
      'utf16': Encoding.UTF16,
    }

    const [ proto, payload ] = string.split(':')

    const encoding = encodings[proto]
    const encoder = getEncoder(encoding)
    const data = encoder.urlDecode(payload)

    return new StringBlob(encoding, encoder, data)
  }

  getCodeunits () {
    return this.encoder.getCodeunits(this.data)
  }

  getCodepoints () {
    return this.encoder.getCodepoints(this.data)
  }

  getGraphemes () {
    const splitter = new GraphemeSplitter()
    const codepoints = this.getCodepoints()

    const strFirstToIndex = new Map()
    const strLastToIndex = new Map()
    let string = ''
    for (let i = 0; i < codepoints.length; i++) {
      const info = codepoints[i]
      strFirstToIndex.set(string.length, info.first)
      string += String.fromCodePoint(info.value)
      strLastToIndex.set(string.length - 1, info.last)
    }

    const graphemes = splitter.splitGraphemes(string)
    const result = []
  
    let strOffset = 0
    for (let i = 0; i < graphemes.length; i++) {
      result.push({
        first: strFirstToIndex.get(strOffset),
        last: strLastToIndex.get(strOffset + graphemes[i].length - 1),
        text: graphemes[i]
      })
      strOffset += graphemes[i].length
    }
  
    return result
  }
}
