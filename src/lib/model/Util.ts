/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export function urlSlugNormalize(input: string): string {
	input = input.replace(/\s+/g, "-");
	return input.toLocaleLowerCase();
}

export function displayUnicode(code: number) {
	return `U+${decimalToHex(code, 4)}`;
}

export function decimalToHex(d: number, padding: number) {
	return Number(d).toString(16).padStart(padding, "0");
}

export function hexEncode(
	array: ArrayLike<number> | Iterable<number>,
	padding: number,
	useSep: boolean = true
) {
	return Array.from(array)
		.map((byte) => byte.toString(16).padStart(padding, "0"))
		.join(useSep ? "." : "");
}

export function hexDecode(string: string, padding: number) {
	string = string.replace(/[^a-fA-F0-9]/g, "");
	const array = [];

	for (let i = 0; i < string.length; i += padding) {
		const slice = string.substring(i, i + padding);
		array.push(parseInt(slice, 16));
	}

	return array;
}

export function copyMemory(
	destRaw: ArrayLike<number> | ArrayBuffer,
	sourceRaw: ArrayLike<number> | ArrayBuffer
) {
	const dest = new Uint8Array(destRaw);
	const source = new Uint8Array(sourceRaw);

	for (let i = 0; i < source.length; i++) {
		dest[i] = source[i];
	}
	return destRaw;
}

export function alignMemory(target: ArrayBuffer, align: number): ArrayBuffer {
	if (target.byteLength % align != 0) {
		const dest = new ArrayBuffer(
			target.byteLength + (align - (target.byteLength % align))
		);
		copyMemory(dest, target);
		return dest;
	}
	return target;
}

export function decodeSurrogate(
	lowSurrogate: number,
	highSurrogate: number
): number {
	const high = highSurrogate - 0xd800;
	const low = lowSurrogate - 0xdc00;
	const code = ((high << 10) | low) + 0x10000;
	return code;
}

export function encodeSurrogate(codepoint: number): [number, number] {
	const value = codepoint - 0x10000;
	const high = (value >> 10) + 0xd800;
	const low = (value & 0x3ff) + 0xdc00;
	return [high, low];
}

// Because String.fromCodePoint throws if it doesn't like the input value.
export function stringFromCodePoint(codepoint: number) {
	if (codepoint > 0xffff) {
		return String.fromCharCode(...encodeSurrogate(codepoint));
	} else {
		return String.fromCharCode(codepoint);
	}
}

export function base64Encode(input: ArrayBuffer): string {
	if (process.browser) {
		const array = new Uint8Array(input);
		const byteString = String.fromCharCode(...array);
		const base64 = btoa(byteString);
		return base64;
	} else {
		const buffer = Buffer.from(input);
		const base64 = buffer.toString("base64");
		return base64;
	}
}

export function base64Decode(input: string): ArrayBuffer {
	input = input.replace(/[^+=/\w]/g, "");
	if (process.browser) {
		// This returns a "byte string", a string full of values from
		// 0 to 0xFF.
		input = atob(input);
		const array = new ArrayBuffer(input.length);
		const uint8 = new Uint8Array(array);
		for (let i = 0; i < input.length; i++) {
			uint8[i] = input.charCodeAt(i);
		}
		return array;
	} else {
		const buffer = Buffer.from(input, "base64");
		return buffer.buffer;
	}
}

export function selectText(element: HTMLElement) {
	const range = document.createRange();
	range.selectNode(element);
	window.getSelection()?.addRange(range);
}

export function escapeHtml(text: string): string {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}
