/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import GraphemeSplitter from "grapheme-splitter";
import * as Utf8 from "./Utf8";
import * as Utf16 from "./Utf16";
import * as Utf32 from "./Utf32";
import Windows1252String, * as Windows1252 from "./Windows1252";
import {
	base64Decode,
	base64Encode,
	decodeSurrogate,
	stringFromCodePoint,
} from "./Util";

export enum Encoding {
	Utf8,
	Utf16,
	Utf32,
	Windows1252,
}

export enum DataType {
	Plain = "plain",
	Base16 = "base16",
	Base64 = "base64",
	Codepoints = "codepoints",
}

export function getEncodings(): Encoding[] {
	return [Encoding.Utf8, Encoding.Utf16, Encoding.Utf32, Encoding.Windows1252];
}

export function getDataTypes(): DataType[] {
	return [
		DataType.Plain,
		DataType.Base16,
		DataType.Base64,
		DataType.Codepoints,
	];
}

export function encodingFromTag(tag: string): Encoding {
	switch (tag) {
		case "utf8":
			return Encoding.Utf8;
		case "utf16":
			return Encoding.Utf16;
		case "utf32":
			return Encoding.Utf32;
		case "windows1252":
			return Encoding.Windows1252;
		default:
			throw new Error("Invalid encoding tag");
	}
}

export function encodingToTag(encoding: Encoding): string {
	switch (encoding) {
		case Encoding.Utf8:
			return "utf8";
		case Encoding.Utf16:
			return "utf16";
		case Encoding.Utf32:
			return "utf32";
		case Encoding.Windows1252:
			return "windows1252";
		default:
			throw new Error("Invalid encoding");
	}
}

function getEncoder(encoding: Encoding): Encoder {
	switch (encoding) {
		case Encoding.Utf8:
			return Utf8;
		case Encoding.Utf16:
			return Utf16;
		case Encoding.Utf32:
			return Utf32;
		case Encoding.Windows1252:
			return Windows1252;
		default:
			throw new Error("Invalid encoding");
	}
}

export type CodeunitInfo = {
	value: number;
	text: string;
	class: string;
};

export type CodepointInfo = {
	value: number | null;
	text?: string;
	// code unit offset
	first: number;
	last: number;
};

export interface GraphemeInfo {
	text: string;
	first: number;
	last: number;
}

export interface EncodedString {
	urlEncode(useSep: boolean): string;
	codepointEncode(): number[];
	getCodeunits(): CodeunitInfo[];
	getCodepoints(): CodepointInfo[];
	getArrayBuffer(): ArrayBuffer;
}

interface Encoder {
	urlDecode(data: string): EncodedString;
	codepointDecode(input: number[]): EncodedString;
	reinterpret(data: ArrayBuffer): EncodedString;
}

export default class StringBlob {
	encoding: Encoding;
	encoder: Encoder;
	data: EncodedString;

	constructor(encoding: Encoding, encoder: Encoder, data: EncodedString) {
		this.encoding = encoding;
		this.encoder = encoder;
		this.data = data;
	}

	convert(encoding: Encoding) {
		if (this.encoding == encoding) {
			const array = this.data.getArrayBuffer();
			return new StringBlob(
				this.encoding,
				this.encoder,
				this.encoder.reinterpret(array)
			);
		}
		const encoder = getEncoder(encoding);
		const string = encoder.codepointDecode(this.data.codepointEncode());
		return new StringBlob(encoding, encoder, string);
	}

	reinterpret(encoding: Encoding) {
		const encoder = getEncoder(encoding);
		return new StringBlob(
			encoding,
			encoder,
			encoder.reinterpret(this.data.getArrayBuffer())
		);
	}

	normalize(mode: string) {
		const oldStr = this.stringEncode();
		const newStr = oldStr.normalize(mode);
		return StringBlob.stringDecode(this.encoding, newStr);
	}

	equal(other: StringBlob) {
		const thisStr = this.stringEncode();
		const otherStr = other.stringEncode();
		return thisStr == otherStr;
	}

	static stringDecode(encoding: Encoding, string: string) {
		const encoder = getEncoder(encoding);

		let highSurrogate: number | null = null;
		let lowSurrogate: number | null = null;

		const codepoints = [];

		const writePair = (lowSurrogate: number, highSurrogate: number) => {
			codepoints.push(decodeSurrogate(lowSurrogate, highSurrogate));
		};

		for (let i = 0; i < string.length; i++) {
			const code = string.charCodeAt(i);
			const isHigh = code >= 0xd800 && code <= 0xdbff;
			const isLow = code >= 0xdc00 && code <= 0xdfff;

			if (isHigh) {
				if (highSurrogate) {
					codepoints.push(code);
					highSurrogate = null;
				} else if (lowSurrogate) {
					writePair(lowSurrogate, code);
					lowSurrogate = null;
				} else {
					highSurrogate = code;
				}
			} else if (isLow) {
				if (lowSurrogate) {
					codepoints.push(lowSurrogate);
					lowSurrogate = null;
				} else if (highSurrogate) {
					writePair(code, highSurrogate);
					highSurrogate = null;
				} else {
					lowSurrogate = code;
				}
			} else {
				// normal
				if (highSurrogate) {
					codepoints.push(highSurrogate);
					highSurrogate = null;
				} else if (lowSurrogate) {
					codepoints.push(lowSurrogate);
					lowSurrogate = null;
				}
				codepoints.push(code);
			}
		}

		return new StringBlob(
			encoding,
			encoder,
			encoder.codepointDecode(codepoints)
		);
	}

	static dataDecode(
		dataType: DataType,
		encoding: Encoding,
		data: string
	): StringBlob {
		switch (dataType) {
			case DataType.Plain:
				return StringBlob.stringDecode(encoding, data);
			case DataType.Base16:
				return StringBlob.rawDecode(encoding, data);
			case DataType.Base64:
				return StringBlob.base64Decode(encoding, data);
			case DataType.Codepoints:
				return StringBlob.codepointsDecode(encoding, data);
		}
	}

	static base64Decode(encoding: Encoding, data: string) {
		const array = base64Decode(data);
		const encoder = getEncoder(encoding);
		const string = encoder.reinterpret(array);
		return new StringBlob(encoding, encoder, string);
	}

	static fromArray(encoding: Encoding, buffer: ArrayBuffer) {
		const string = Utf32.reinterpret(buffer);
		return new StringBlob(Encoding.Utf32, Utf32, string).convert(encoding);
	}

	static fromCodepoint(encoding: Encoding, codepoint: number) {
		const encoder = getEncoder(encoding);
		const string = encoder.codepointDecode([codepoint]);
		return new StringBlob(encoding, encoder, string);
	}

	static codepointsDecode(encoding: Encoding, data: string) {
		const codepoints = [];
		for (const word of data.match(/[a-fA-F0-9]+/g) || []) {
			const value = parseInt(word, 16);
			codepoints.push(value);
		}
		const array = new Uint32Array(codepoints);
		return StringBlob.fromArray(encoding, array);
	}

	stringEncode() {
		const codepoints = this.data.codepointEncode();
		return Array.from(codepoints)
			.map((code) => stringFromCodePoint(code))
			.join("");
	}

	dataEncode(dataType: DataType, useSep: boolean = true): string {
		switch (dataType) {
			case DataType.Plain:
				return this.stringEncode();
			case DataType.Base16:
				return this.data.urlEncode(useSep);
			case DataType.Base64:
				return this.base64Encode(useSep);
			case DataType.Codepoints:
				return this.codepointsEncode(useSep);
		}
	}

	base64Encode(useSep: boolean = true) {
		const array = this.data.getArrayBuffer();
		const base64 = base64Encode(array);
		if (useSep) {
			return base64.replace(/(.{6})/g, "$&.").replace(/\.$/, "");
		}
		return base64;
	}

	codepointsEncode(useSep: boolean = true) {
		return this.data
			.codepointEncode()
			.map((codepoint) => codepoint.toString(16).padStart(4, "0"))
			.join(useSep ? ", " : " ");
	}

	urlEncode() {
		const proto = encodingToTag(this.encoding);
		const payload = this.data.urlEncode(true);

		return `${proto}:${payload}`;
	}

	static rawDecode(encoding: Encoding, payload: string) {
		const encoder = getEncoder(encoding);
		const data = encoder.urlDecode(payload);
		return new StringBlob(encoding, encoder, data);
	}

	static urlDecode(string: string) {
		const [proto, payload] = string.split(":");

		const encoding = encodingFromTag(proto);
		const encoder = getEncoder(encoding);
		const data = encoder.urlDecode(payload);

		return new StringBlob(encoding, encoder, data);
	}

	getCodeunits(): CodeunitInfo[] {
		return this.data.getCodeunits();
	}

	getCodepoints(): CodepointInfo[] {
		return this.data.getCodepoints();
	}

	getGraphemes(): GraphemeInfo[] {
		const splitter = new GraphemeSplitter();
		const codepoints = this.getCodepoints();

		const strFirstToIndex = new Map();
		const strLastToIndex = new Map();
		let string = "";
		for (let i = 0; i < codepoints.length; i++) {
			const info = codepoints[i];
			strFirstToIndex.set(string.length, info.first);
			string += stringFromCodePoint(info.value || 0xfffd);
			strLastToIndex.set(string.length - 1, info.last);
		}

		const graphemes = splitter.splitGraphemes(string);
		const result = [];

		let strOffset = 0;
		for (let i = 0; i < graphemes.length; i++) {
			result.push({
				first: strFirstToIndex.get(strOffset),
				last: strLastToIndex.get(strOffset + graphemes[i].length - 1),
				text: graphemes[i],
			});
			strOffset += graphemes[i].length;
		}

		return result;
	}

	possiblyMojibake() {
		const original = this.stringEncode();
		const encoded = this.convert(Encoding.Windows1252);
		const compare = encoded.convert(this.encoding).stringEncode();
		if (original === compare) {
			for (const byte of (encoded.data as Windows1252String).data) {
				if (byte > 0x7f) return true;
			}
		}

		return false;
	}
}
