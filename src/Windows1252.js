import { decimalToHex, hexEncode, hexDecode } from "./Util";
import charTable from "./Windows1252CharTable";

export function reinterpret(array) {
  return new Uint8Array(array);
}

export function stringEncode(bytes) {
  const result = [];
  for (const byte of bytes) {
    result.push(String.fromCodePoint(charTable[byte].unicode));
  }
  return result.join("");
}

export function stringDecode(str) {
  const result = [];
  for (const char of str) {
    const codepoint = char.codePointAt(0);
    const index = charTable.findIndex(entry => entry.unicode === codepoint);
    if (index !== -1) {
      result.push(index);
    } else {
      result.push(0x3f); // use question mark as replacement char
    }
  }
  return new Uint8Array(result);
}

export function getCodeunits(bytes) {
  return Array.from(bytes).map(byte => ({
    value: charTable[byte].unicode,
    text: decimalToHex(byte, 2),
    class: charTable[byte].name
  }));
}

export function getCodepoints(bytes) {
  return Array.from(bytes).map((byte, index) => ({
    value: charTable[byte].unicode,
    first: index,
    last: index
  }));
}

export function urlEncode(bytes) {
  return hexEncode(bytes, 2);
}

export function urlDecode(str) {
  return new Uint8Array(hexDecode(str, 2));
}
