/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {
	decimalToHex,
	hexEncode,
	hexDecode,
	alignMemory,
	decodeSurrogate,
} from "./Util";
import type { EncodedString } from "./StringBlob";

export function codepointDecode(input: number[]) {
	const result = [];
	for (const codepoint of input) {
		if (codepoint > 0xffff) {
			const value = codepoint - 0x10000;
			const high = value >> 10;
			const low = value & 0x3ff;
			// Surrogate pair
			result.push(0xd800 + high);
			result.push(0xdc00 + low);
		} else {
			result.push(codepoint);
		}
	}
	return new Utf16String(result);
}

export function urlDecode(str: string) {
	return new Utf16String(hexDecode(str, 4));
}

export function reinterpret(data: ArrayBuffer) {
	data = alignMemory(data, 2);
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

	urlEncode(useSep: boolean) {
		return hexEncode(this.data, 4, useSep);
	}

	stringEncode() {
		return Array.from(this.data)
			.map((code) => String.fromCharCode(code))
			.join("");
	}

	codepointEncode(): number[] {
		// Replacement character.
		// Not the most efficient possible implementation.
		return this.getCodepoints().map((cp) => cp.value || 0xfffd);
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
				class: tooltip,
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
						value: decodeSurrogate(lowSurrogate, code),
					});
					lowSurrogate = null;
				} else if (highSurrogate) {
					codepoints.push({
						first: i - 1,
						last: i - 1,
						value: null,
						text: "Orphan Surrogate High",
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
						value: decodeSurrogate(code, highSurrogate),
					});
					highSurrogate = null;
				} else if (lowSurrogate) {
					codepoints.push({
						first: i - 1,
						last: i - 1,
						value: lowSurrogate,
						text: "Orphan Surrogate Low",
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
						value: highSurrogate || lowSurrogate,
						text: highSurrogate
							? "Orphan Surrogate High"
							: "Orphan Surrogate Low",
					});
					lowSurrogate = null;
					highSurrogate = null;
				}
				codepoints.push({
					first: i,
					last: i,
					value: code,
				});
			}
		}

		if (lowSurrogate || highSurrogate) {
			codepoints.push({
				first: this.data.length - 1,
				last: this.data.length - 1,
				value: lowSurrogate || highSurrogate,
				text: highSurrogate ? "Orphan Surrogate High" : "Orphan Surrogate Low",
			});
		}

		return codepoints;
	}
}
