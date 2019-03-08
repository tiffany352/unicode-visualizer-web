import { hexEncode, hexDecode } from './Util'
import Utf8, { wtf8Encode } from './Utf8'
import Utf16 from './Utf16'

export const Encoding = Object.freeze({
  UTF8: Symbol('utf8'),
  UTF16: Symbol('utf16'),
})

const encodingBytesPerUnit = {
  [Encoding.UTF8]: 1,
  [Encoding.UTF16]: 2,
}

export default class StringBlob {
  constructor(encoding, data) {
    this.encoding = encoding
    this.data = data
  }

  static fromString(string) {
    const buf = new ArrayBuffer(string.length * 2)
    const array = new Uint16Array(buf)

    for (let i = 0; i < string.length; i++) {
      array[i] = string.charCodeAt(i)
    }

    return new StringBlob(Encoding.UTF16, array)
  }

  static encodeUtf8(string) {
    return new StringBlob(Encoding.UTF8, wtf8Encode(string))
  }

  stringOf() {
    const array = Array.from(this.data)

    return array.map((code) => String.fromCharCode(code)).join('')
  }

  urlEncode() {
    const encodingNames = {
      [Encoding.UTF8]: 'utf8',
      [Encoding.UTF16]: 'utf16',
    }

    const proto = encodingNames[this.encoding]
    const payload = hexEncode(this.data, encodingBytesPerUnit[this.encoding])

    return `${proto}:${payload}`
  }

  static urlDecode(string) {
    const encodings = {
      'utf8': Encoding.UTF8,
      'utf16': Encoding.UTF16,
    }

    const [ proto, payload ] = string.split(':')

    const encoding = encodings[proto]
    const data = hexDecode(payload, encodingBytesPerUnit[encoding])

    switch (encoding) {
      case Encoding.UTF8:
        return new StringBlob(encoding, new Uint8Array(data))
      case Encoding.UTF16:
        return new StringBlob(encoding, new Uint16Array(data))
      default:
        throw new Error("Invalid encoding")
    }
  }

  getEncoder() {
    switch (this.encoding) {
      case Encoding.UTF8:
        return new Utf8(this.data)
      case Encoding.UTF16:
        return new Utf16(this.data)
      default:
        throw new Error("Invalid encoding")
    }
  }
}
