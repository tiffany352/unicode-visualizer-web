import GraphemeSplitter from "grapheme-splitter";
import * as Utf8 from "./Utf8";
import * as Utf16 from "./Utf16";
import * as Windows1252 from "./Windows1252";

export const Encoding = Object.freeze({
  UTF8: Symbol("utf8"),
  UTF16: Symbol("utf16"),
  WINDOWS1252: Symbol("windows1252")
});

export function encodingFromTag(tag) {
  switch (tag) {
    case "utf8":
      return Encoding.UTF8;
    case "utf16":
      return Encoding.UTF16;
    case "windows1252":
      return Encoding.WINDOWS1252;
    default:
      throw new Error("Invalid encoding tag");
  }
}

export function encodingToTag(encoding) {
  switch (encoding) {
    case Encoding.UTF8:
      return "utf8";
    case Encoding.UTF16:
      return "utf16";
    case Encoding.WINDOWS1252:
      return "windows1252";
    default:
      throw new Error("Invalid encoding");
  }
}

function getEncoder(encoding) {
  switch (encoding) {
    case Encoding.UTF8:
      return Utf8;
    case Encoding.UTF16:
      return Utf16;
    case Encoding.WINDOWS1252:
      return Windows1252;
    default:
      throw new Error("Invalid encoding");
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
  reinterpret(input: ArrayBuffer): Data
}
*/

export default class StringBlob {
  constructor(encoding, encoder, data) {
    this.encoding = encoding;
    this.encoder = encoder;
    this.data = data;
  }

  convert(encoding) {
    return StringBlob.stringDecode(encoding, this.stringEncode());
  }

  reinterpret(encoding) {
    const encoder = getEncoder(encoding);
    return new StringBlob(
      encoding,
      encoder,
      encoder.reinterpret(this.data.buffer)
    );
  }

  normalize(mode) {
    const oldStr = this.stringEncode();
    const newStr = oldStr.normalize(mode);
    return StringBlob.stringDecode(this.encoding, newStr);
  }

  static stringDecode(encoding, string) {
    const encoder = getEncoder(encoding);

    return new StringBlob(encoding, encoder, encoder.stringDecode(string));
  }

  stringEncode() {
    return this.encoder.stringEncode(this.data);
  }

  urlEncode() {
    const proto = encodingToTag(this.encoding);
    const payload = this.encoder.urlEncode(this.data);

    return `${proto}:${payload}`;
  }

  static urlDecode(string) {
    const [proto, payload] = string.split(":");

    const encoding = encodingFromTag(proto);
    const encoder = getEncoder(encoding);
    const data = encoder.urlDecode(payload);

    return new StringBlob(encoding, encoder, data);
  }

  getCodeunits() {
    return this.encoder.getCodeunits(this.data);
  }

  getCodepoints() {
    return this.encoder.getCodepoints(this.data);
  }

  getGraphemes() {
    const splitter = new GraphemeSplitter();
    const codepoints = this.getCodepoints();

    const strFirstToIndex = new Map();
    const strLastToIndex = new Map();
    let string = "";
    for (let i = 0; i < codepoints.length; i++) {
      const info = codepoints[i];
      strFirstToIndex.set(string.length, info.first);
      string += String.fromCodePoint(info.value);
      strLastToIndex.set(string.length - 1, info.last);
    }

    const graphemes = splitter.splitGraphemes(string);
    const result = [];

    let strOffset = 0;
    for (let i = 0; i < graphemes.length; i++) {
      result.push({
        first: strFirstToIndex.get(strOffset),
        last: strLastToIndex.get(strOffset + graphemes[i].length - 1),
        text: graphemes[i]
      });
      strOffset += graphemes[i].length;
    }

    return result;
  }

  possiblyMojibake() {
    const original = this.stringEncode();
    const encoded = this.convert(Encoding.WINDOWS1252);
    const compare = encoded.convert(this.encoding).stringEncode();
    if (original === compare) {
      for (const byte of encoded.data) {
        if (byte > 0x7f) return true;
      }
    }

    return false;
  }
}
