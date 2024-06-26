/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { decimalToHex, hexEncode, hexDecode } from "./Util";
import type { EncodedString, CodepointInfo } from "./StringBlob";

enum Type {
	Continuation = 0,
	Ascii = 1,
	TwoByteStarter = 2,
	ThreeByteStarter = 3,
	FourByteStarter = 4,
	Invalid = -1,
}

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

function readCodepoint(bytes: Uint8Array, offset = 0): CodepointInfo {
	const first = bytes[offset];
	const [firstTy, firstValue] = readByte(first);
	let codepoint = firstValue;

	if (firstTy === 1) {
		return {
			value: codepoint,
			first: offset,
			last: offset,
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
					last: offset + i,
				};
			}
			codepoint = result;
		}

		return {
			value: codepoint,
			first: offset,
			last: offset + firstTy - 1,
		};
	}

	return {
		value: null,
		first: offset,
		last: offset,
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

export function codepointDecode(input: number[]) {
	const bytes: number[] = [];
	for (const codepoint of input) {
		writeCodepoint(codepoint, bytes);
	}
	return new Utf8String(bytes);
}

export function urlDecode(str: string) {
	return new Utf8String(hexDecode(str, 2));
}

export function reinterpret(data: ArrayBuffer) {
	return new Utf8String(data);
}

export default class Utf8String implements EncodedString {
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

	codepointEncode() {
		let result = [];
		for (let i = 0; i < this.data.length; ) {
			const { value, last } = readCodepoint(this.data, i);
			result.push(value || 0xfffd);
			i = last + 1;
		}
		return result;
	}

	getCodepoints() {
		const codepoints = [];

		for (let i = 0; i < this.data.length; ) {
			const result = readCodepoint(this.data, i);
			codepoints.push(result);
			i = result.last + 1;
		}

		return codepoints;
	}

	getCodeunits() {
		const codeunits = [];

		for (let i = 0; i < this.data.length; i++) {
			const byte = this.data[i];
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
				class: tooltip,
			});
		}

		return codeunits;
	}
}
