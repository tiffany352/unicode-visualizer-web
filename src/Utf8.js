/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { decimalToHex } from './Util'

class Utf8 {
  constructor (str) {
    this.str = new TextEncoder('utf-8').encode(str)
  }
  
  codeunits () {
    const codeunits = []

    for (let i = 0; i < this.str.length; i++) {
      const byte = this.str[i]
      let tooltip
      switch (this.classify(byte)[0]) {
        case 0:
        tooltip = 'Continuation'
        break
        case 1:
        tooltip = 'ASCII Char'
        break
        case 2:
        tooltip = '2-byte Starter'
        break
        case 3:
        tooltip = '3-byte Starter'
        break
        case 4:
        tooltip = '4-byte Starter'
        break
        case -1:
        default:
        tooltip = 'Invalid UTF-8'
        break
      }

      codeunits.push({
        value: byte,
        text: decimalToHex(byte, 2),
        class: tooltip
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
    else if (byte <= 0b11101111) {
      return [3, (value << 4) | (byte & 0b00001111)]
    }
    else if (byte <= 0b11110111) {
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
