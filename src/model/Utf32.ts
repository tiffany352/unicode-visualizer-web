/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { hexEncode, hexDecode, alignMemory } from "./Util";
import type { EncodedString } from "./StringBlob";

export function codepointDecode(input: number[]) {
	return new Utf32String(input);
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

	getArrayBuffer() {
		return this.data.buffer;
	}

	urlEncode(useSep: boolean) {
		return hexEncode(this.data, 8, useSep);
	}

	codepointEncode() {
		return Array.from(this.data);
	}

	getCodepoints() {
		const codepoints = [];

		for (let i = 0; i < this.data.length; i++) {
			const value = this.data[i];
			if (value > 0x10ffff) {
				codepoints.push({
					value: null,
					text: "Outside of any Unicode plane (0..0x10FFFF)",
					first: i,
					last: i,
				});
			} else {
				codepoints.push({
					value,
					first: i,
					last: i,
				});
			}
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
