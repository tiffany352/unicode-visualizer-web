/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as t from "./Types";

// Parser for the variant of CSV used by the Unicode database.
export function parse<T>(file: string, visitor: (row: string[]) => T): T[] {
	return file
		.split(/\r?\n/)
		.map((line) => {
			const result = line.match(/^([^#]*)#.*$/);
			if (result) {
				line = result[1];
			}
			return line.trim();
		})
		.filter((line) => line != "")
		.map((line) => {
			const fields = line.split(";").map((field) => field.trim());
			return visitor(fields);
		});
}

export interface UnihanEntry {
	codepoint: number;
	type: string;
	category: string;
	value: string;
}

// Parser for the TSV variant used by Unihan data.
export function parseTabs(
	files: { [key: string]: string },
	visitor: (entry: UnihanEntry) => void
) {
	for (const [category, file] of Object.entries(files)) {
		const lines = file
			.split(/\r?\n/)
			.map((line) => {
				const result = line.match(/^([^#]*)#.*$/);
				if (result) {
					line = result[1];
				}
				return line.trim();
			})
			.filter((line) => line != "");
		for (const line of lines) {
			const fields = line.split("\t").map((field) => field.trim());
			const codepoint = t.codepoint(fields[0]);
			const type = fields[1];
			const value = fields[2];
			const entry = {
				codepoint,
				type,
				value,
				category,
			};
			visitor(entry);
		}
	}
}
