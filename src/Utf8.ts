/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { decimalToHex, hexEncode, hexDecode } from "./Util";

enum Type {
  Continuation = 0,
  Ascii = 1,
  TwoByteStarter = 2,
  ThreeByteStarter = 3,
  FourByteStarter = 4,
  Invalid = -1
}

type Codepoint = {
  value: number | null;
  first: number;
  last: number;
  text?: string;
};

function readByte(byte: number, accumulator = 0): [Type, number] {
  if (byte <= 0b01111111) {
    return [1, byte];
  } else if (byte <= 0b10111111) {
    // continuation
    return [0, (accumulator << 6) | (byte & 0b00111111)];
  } else if (byte <= 0b11011111) {
    return [2, (accumulator << 5) | (byte & 0b00011111)];
  } else if (byte <= 0b11101111) {
    return [3, (accumulator << 4) | (byte & 0b00001111)];
  } else if (byte <= 0b11110111) {
    return [4, (accumulator << 3) | (byte & 0b00000111)];
  } else {
    // error
    return [-1, 0];
  }
}

function readCodepoint(bytes: Uint8Array, offset = 0): Codepoint {
  const first = bytes[offset];
  const [firstTy, firstValue] = readByte(first);
  let codepoint = firstValue;

  if (firstTy === 1) {
    return {
      value: codepoint,
      first: offset,
      last: offset
    };
  }

  if (firstTy >= 1) {
    for (let i = 0; i < firstTy - 1; i++) {
      const byte = bytes[offset + i + 1];
      let [contTy, result] = readByte(byte, codepoint);
      if (contTy !== 0) {
        return {
          value: null,
          first: offset,
          last: offset + i
        };
      }
      codepoint = result;
    }

    return {
      value: codepoint,
      first: offset,
      last: offset + firstTy - 1
    };
  }

  return {
    value: null,
    first: offset,
    last: offset
  };
}

function writeCodepoint(codepoint: number, accumulator: number[] = []) {
  if (codepoint <= 0x7f) {
    accumulator.push(codepoint);
  } else if (codepoint <= 0x7ff) {
    accumulator.push(0b11000000 | (codepoint >> 6));
    accumulator.push(0b10000000 | (codepoint & 0b00111111));
  } else if (codepoint <= 0xffff) {
    accumulator.push(0b11100000 | (codepoint >> 12));
    accumulator.push(0b10000000 | ((codepoint >> 6) & 0b00111111));
    accumulator.push(0b10000000 | ((codepoint >> 0) & 0b00111111));
  } else if (codepoint <= 0x10ffff) {
    accumulator.push(0b11110000 | (codepoint >> 18));
    accumulator.push(0b10000000 | ((codepoint >> 12) & 0b00111111));
    accumulator.push(0b10000000 | ((codepoint >> 6) & 0b00111111));
    accumulator.push(0b10000000 | ((codepoint >> 0) & 0b00111111));
  }

  return accumulator;
}

export function reinterpret(array: number[]) {
  return new Uint8Array(array);
}

export function stringEncode(utf8: Uint8Array) {
  let result = [];
  for (let i = 0; i < utf8.length; ) {
    const { value, last } = readCodepoint(utf8, i);
    result.push(String.fromCodePoint(value || 0));
    i = last + 1;
  }
  return result.join("");
}

export function stringDecode(str: string) {
  const values: number[] = [];

  const writeCode = (code: number) => writeCodepoint(code, values);

  let highSurrogate: number | null = null;
  let lowSurrogate: number | null = null;

  const writePair = (lowSurrogate: number, highSurrogate: number) => {
    const high = highSurrogate - 0xd800;
    const low = lowSurrogate - 0xdc00;
    const code = ((high << 10) | low) + 0x10000;
    writeCode(code);
  };

  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    const isHigh = code >= 0xd800 && code <= 0xdbff;
    const isLow = code >= 0xdc00 && code <= 0xdfff;

    if (isHigh && lowSurrogate) {
    }

    if (isHigh) {
      if (highSurrogate) {
        writeCode(highSurrogate);
        highSurrogate = null;
      }
      if (lowSurrogate) {
        writePair(lowSurrogate, code);
        lowSurrogate = null;
      }
    } else if (isLow) {
      if (lowSurrogate) {
        writeCode(lowSurrogate);
        lowSurrogate = null;
      }
      if (highSurrogate) {
        writePair(code, highSurrogate);
        highSurrogate = null;
      }
    } else {
      // normal
      if (highSurrogate) {
        writeCode(highSurrogate);
        highSurrogate = null;
      } else if (lowSurrogate) {
        writeCode(lowSurrogate);
        lowSurrogate = null;
      }
      writeCode(code);
    }
  }

  if (highSurrogate) {
    writeCode(highSurrogate);
  } else if (lowSurrogate) {
    writeCode(lowSurrogate);
  }

  return new Uint8Array(values);
}

export function getCodeunits(utf8: Uint8Array) {
  const codeunits = [];

  for (let i = 0; i < utf8.length; i++) {
    const byte = utf8[i];
    let tooltip;
    switch (readByte(byte)[0]) {
      case 0:
        tooltip = "Continuation";
        break;
      case 1:
        tooltip = "ASCII Char";
        break;
      case 2:
        tooltip = "2-byte Starter";
        break;
      case 3:
        tooltip = "3-byte Starter";
        break;
      case 4:
        tooltip = "4-byte Starter";
        break;
      case -1:
      default:
        tooltip = "Invalid UTF-8";
        break;
    }

    codeunits.push({
      value: byte,
      text: decimalToHex(byte, 2),
      class: tooltip
    });
  }

  return codeunits;
}

export function getCodepoints(utf8: Uint8Array) {
  const codepoints = [];

  for (let i = 0; i < utf8.length; ) {
    const result = readCodepoint(utf8, i);
    const code = result.value;
    if (code) {
      const isHigh = code >= 0xd800 && code <= 0xdbff;
      const isLow = code >= 0xdc00 && code <= 0xdfff;
      if (isHigh) {
        result.value = null;
        result.text = "WTF-8 Orphan Surrogate High";
      } else if (isLow) {
        result.value = null;
        result.text = "WTF-8 Orphan Surrogate Low";
      }
    }

    codepoints.push(result);
    i = result.last + 1;
  }

  return codepoints;
}

export function urlEncode(utf8: Uint8Array) {
  return hexEncode(utf8, 2);
}

export function urlDecode(str: string) {
  return new Uint8Array(hexDecode(str, 2));
}