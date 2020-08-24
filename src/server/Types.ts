/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import Range from "util/Range";

export type Parser<T> = (input: string) => T;

export class ValidationError extends Error {
	expected: string;
	got: string;

	constructor(expected: string, got: string) {
		super(`Expected ${expected}, got "${got}"`);
		this.expected = expected;
		this.got = got;
	}
}

export interface NameFull {
	type: "name";
	text: string;
}

export interface Label {
	type: "label";
	range?: "First" | "Last";
	text: string;
}

export type Name = NameFull | Label;

export function name(input: string): Name {
	const result = input.match(/^<(.*)>$/);
	if (result) {
		const text = result[1];
		const result2 = text.match(/^(.*), (First|Last)$/);
		if (result2) {
			return {
				type: "label",
				range: result2[2] == "First" ? "First" : "Last",
				text: result2[1],
			};
		}
		return {
			type: "label",
			text: result[1],
		};
	}
	return {
		type: "name",
		text: input,
	};
}

export function optional<T>(input: string, parser: Parser<T>): T | null {
	if (input == "") {
		return null;
	} else {
		return parser(input);
	}
}

export function binary(input: string): boolean {
	switch (input) {
		case "Y":
			return true;
		case "N":
			return false;
		default:
			throw new ValidationError("Y | N", input);
	}
}

export function codepoint(input: string): number {
	if (/[a-zA-Z0-9]+/.test(input)) {
		return parseInt(input, 16);
	} else {
		throw new ValidationError("codepoint", input);
	}
}

export function codepointRange(input: string): Range {
	const [first, last] = input.split("..");
	if (first && last) {
		return new Range(codepoint(first), codepoint(last));
	}
	throw new ValidationError("codepoint range", input);
}

export function codepointOrRange(input: string): Range {
	const [first, last] = input.split("..");
	if (first && last) {
		return new Range(codepoint(first), codepoint(last));
	} else if (first) {
		return new Range(codepoint(first));
	} else {
		throw new ValidationError("codepoint range | codepoint", input);
	}
}

export function codepointList(input: string): number[] {
	return input.split(" ").map((str) => codepoint(str));
}

export function enumeration<T extends string>(values: T[]): Parser<T> {
	return (input) => {
		for (const value of values) {
			if (input == value) {
				return value;
			}
		}
		throw new ValidationError(values.join(" | "), input);
	};
}
