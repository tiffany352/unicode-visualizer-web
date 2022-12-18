/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { decimalToHex, hexEncode, hexDecode } from "./Util";
import charTable from "./Windows1252CharTable";
import type { EncodedString } from "./StringBlob";

export function codepointDecode(input: number[]) {
	const result = [];
	for (const codepoint of input) {
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

	codepointEncode(): number[] {
		return Array.from(this.data).map((byte) => charTable[byte].unicode);
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
