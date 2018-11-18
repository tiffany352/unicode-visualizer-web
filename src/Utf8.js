import { decimalToHex } from './Util'

class Utf8 {
  constructor (str) {
    this.str = new TextEncoder('utf-8').encode(str)
  }
  
  codeunits () {
    const codeunits = []

    for (let i = 0; i < this.str.length; i++) {
      codeunits.push({
        value: this.str[i],
        text: decimalToHex(this.str[i], 2)
      })
    }

    return codeunits
  }

  classify (byte, value) {
    value = value || 0

    if (byte <= 0b01111111) {
      return [1, byte]
    }
    else if (byte <= 0b10111111) {
      // continuation
      return [0, (value << 6) | (byte & 0b00111111)]
    }
    else if (byte <= 0b11011111) {
      return [2, (value << 5) | (byte & 0b00011111)]
    }
    else if (byte < 0b11101111) {
      return [3, (value << 4) | (byte & 0b00001111)]
    }
    else if (byte < 0b11110111) {
      return [4, (value << 3) | (byte & 0b00000111)]
    }
    else {
      // error
      return [-1, null]
    }
  }

  readCodepoint (offset) {
    const first = this.str[offset]
    const [firstTy, firstValue] = this.classify(first)
    let value = firstValue

    if (firstTy === 1) {
      return {
        value: value,
        first: offset,
        last: offset,
      }
    }

    if (firstTy > 1) {
      for (let i = 0; i < firstTy - 1; i++) {
        const byte = this.str[offset + i + 1]
        let [contTy, result] = this.classify(byte, value)
        if (contTy !== 0) {
          return {
            value: null,
            first: offset,
            last: offset + i
          }
        }
        value = result
      }

      return {
        value: value,
        first: offset,
        last: offset + firstTy - 1
      }
    }
    
    return {
      value: null,
      first: offset,
      last: offset
    }
  }
  
  codepoints () {
    const codepoints = []

    for (let i = 0; i < this.str.length;) {
      const result = this.readCodepoint(i);
      codepoints.push(result);
      i = result.last + 1;
    }
    
    return codepoints
  }
  
  graphemes () {
    const graphemes = []
    
    return graphemes
  }
}

export default Utf8
