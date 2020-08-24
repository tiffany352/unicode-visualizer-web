/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Parser for the variant of CSV used by the Unicode database.

export function parse<T>(file: string, visitor: (row: string[]) => T): T[] {
	return file
		.split("\n")
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
