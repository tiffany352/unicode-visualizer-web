import { decimalToHex, hexEncode, hexDecode } from "./Util";
import charTable from "./Windows1252CharTable";
import type { EncodedString } from "./StringBlob";

export function stringDecode(str: string) {
	const result = [];
	for (const char of str) {
		const codepoint = char.codePointAt(0);
		const index = charTable.findIndex((entry) => entry.unicode === codepoint);
		if (index !== -1) {
			result.push(index);
		} else {
			result.push(0x3f); // use question mark as replacement char
		}
	}
	return new Windows1252String(result);
}

export function urlDecode(str: string) {
	return new Windows1252String(hexDecode(str, 2));
}

export function reinterpret(data: ArrayBuffer) {
	return new Windows1252String(data);
}

export default class Windows1252String implements EncodedString {
	data: Uint8Array;

	constructor(data: ArrayBuffer | number[]) {
		this.data = new Uint8Array(data);
	}

	getArrayBuffer() {
		return this.data.buffer;
	}

	urlEncode(useSep: boolean) {
		return hexEncode(this.data, 2, useSep);
	}

	stringEncode() {
		const result = [];
		for (const byte of this.data) {
			result.push(String.fromCodePoint(charTable[byte].unicode));
		}
		return result.join("");
	}

	getCodeunits() {
		return Array.from(this.data).map((byte) => ({
			value: charTable[byte].unicode,
			text: decimalToHex(byte, 2),
			class: charTable[byte].name,
		}));
	}

	getCodepoints() {
		return Array.from(this.data).map((byte, index) => ({
			value: charTable[byte].unicode,
			first: index,
			last: index,
		}));
	}
}
