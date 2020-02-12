/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { decimalToHex, hexEncode, hexDecode } from "./Util";
import { EncodedString } from "./StringBlob";

function makePair(high: number, low: number) {
  const highBits = high - 0xd800;
  const lowBits = low - 0xdc00;
  return (highBits << 10) + lowBits + 0x10000;
}

export function stringDecode(str: string) {
  const result = [];
  for (let i = 0; i < str.length; i++) {
    result.push(str.charCodeAt(i));
  }
  return new Utf16String(result);
}

export function urlDecode(str: string) {
  return new Utf16String(hexDecode(str, 4));
}

export function reinterpret(data: ArrayBuffer) {
  return new Utf16String(data);
}

export default class Utf16String implements EncodedString {
  data: Uint16Array;

  constructor(data: ArrayBuffer | number[]) {
    this.data = new Uint16Array(data);
  }

  getArrayBuffer() {
    return this.data.buffer;
  }

  urlEncode() {
    return hexEncode(this.data, 4);
  }

  stringEncode() {
    return Array.from(this.data)
      .map(code => String.fromCharCode(code))
      .join("");
  }

  getCodeunits() {
    const codeunits = [];

    for (let i = 0; i < this.data.length; i++) {
      const code = this.data[i];
      const isHigh = code >= 0xd800 && code <= 0xdbff;
      const isLow = code >= 0xdc00 && code <= 0xdfff;

      let tooltip = "Codepoint";
      if (isHigh) {
        tooltip = "Surrogate High";
      } else if (isLow) {
        tooltip = "Surrogate Low";
      }

      codeunits.push({
        value: code,
        text: decimalToHex(code, 4),
        class: tooltip
      });
    }

    return codeunits;
  }

  getCodepoints() {
    const codepoints = [];

    let highSurrogate = null;
    let lowSurrogate = null;
    for (let i = 0; i < this.data.length; i++) {
      const code = this.data[i];
      const isHigh = code >= 0xd800 && code <= 0xdbff;
      const isLow = code >= 0xdc00 && code <= 0xdfff;

      if (isHigh) {
        if (lowSurrogate) {
          codepoints.push({
            first: i - 1,
            last: i,
            value: makePair(code, lowSurrogate)
          });
          lowSurrogate = null;
        } else if (highSurrogate) {
          codepoints.push({
            first: i - 1,
            last: i - 1,
            value: null,
            text: "Orphan Surrogate High"
          });
          highSurrogate = code;
        } else {
          highSurrogate = code;
        }
      } else if (isLow) {
        if (highSurrogate) {
          codepoints.push({
            first: i - 1,
            last: i,
            value: makePair(highSurrogate, code)
          });
          highSurrogate = null;
        } else if (lowSurrogate) {
          codepoints.push({
            first: i - 1,
            last: i - 1,
            value: null,
            text: "Orphan Surrogate Low"
          });
          lowSurrogate = code;
        } else {
          lowSurrogate = code;
        }
      } else {
        // normal
        if (lowSurrogate || highSurrogate) {
          codepoints.push({
            first: i - 1,
            last: i - 1,
            value: null,
            text: highSurrogate
              ? "Orphan Surrogate High"
              : "Orphan Surrogate Low"
          });
          lowSurrogate = null;
          highSurrogate = null;
        }
        codepoints.push({
          first: i,
          last: i,
          value: code
        });
      }
    }

    if (lowSurrogate || highSurrogate) {
      codepoints.push({
        first: this.data.length - 1,
        last: this.data.length - 1,
        value: null,
        text: highSurrogate ? "Orphan Surrogate High" : "Orphan Surrogate Low"
      });
    }

    return codepoints;
  }
}
