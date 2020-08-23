/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { hexEncode, hexDecode, alignMemory } from "./Util";
import type { EncodedString } from "./StringBlob";

export function stringDecode(str: string) {
	const codepoints = [];
	for (const codepoint of str) {
		codepoints.push(codepoint.codePointAt(0) as number);
	}
	return new Utf32String(codepoints);
}

export function urlDecode(str: string) {
	return new Utf32String(hexDecode(str, 8));
}

export function reinterpret(data: ArrayBuffer) {
	data = alignMemory(data, 4);
	return new Utf32String(data);
}

export default class Utf32String implements EncodedString {
	data: Uint32Array;

	constructor(data: ArrayBuffer | number[]) {
		this.data = new Uint32Array(data);
	}

	static fromCodepoint(code: number) {
		return new Utf32String([code]);
	}

	getArrayBuffer() {
		return this.data.buffer;
	}

	urlEncode() {
		return hexEncode(this.data, 8);
	}

	stringEncode() {
		const array = Array.from(this.data);
		return String.fromCodePoint(...array);
	}

	getCodepoints() {
		const codepoints = [];

		for (let i = 0; i < this.data.length; i++) {
			codepoints.push({
				value: this.data[i],
				first: i,
				last: i,
			});
		}

		return codepoints;
	}

	getCodeunits() {
		const codeunits = [];

		for (let i = 0; i < this.data.length; i++) {
			codeunits.push({
				value: this.data[i],
				text: "",
				class: "",
			});
		}

		return codeunits;
	}
}
