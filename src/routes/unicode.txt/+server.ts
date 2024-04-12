/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { getDescription, getBlocks, lookupChar, codepointToString, type BlockInfo, type Char, type InvalidChar } from "$lib/server/Unicode";
import type { RequestHandler } from "@sveltejs/kit";

function isPrivateUse(char: InvalidChar): boolean {
	return char.reason == "invalidCodepoint.private-use" || char.reason == "invalidCodepoint.private-use-sup-a" || char.reason == "invalidCodepoint.private-use-sup-b";
}

function skipBlock(block: BlockInfo): boolean {
	let f = block.range.first;
	return f == 0xD800 || f == 0xDB80 || f == 0xDC00;
}

const preamble = `

This is a list of every character in Unicode ${getDescription()},
presented as a convenient plain-text file.

It's meant for display in a context where monospaced display is forced,
such as a text editor or terminal emulator.

Certain characters are not printable, and so they are not displayed
literally. This includes control characters and formatting marks. They
are replaced by their abbreviated names where possible. Space characters
are wrapped in single quotes for clarity. When there is no clear way to
display a character, it's replaced by an [X].

Combining characters, such as diacritics, are always displayed attached
to a ◌ character so that they will render consistently.

Unassigned codepoints are displayed with ╌╌.

Effort has been put into making sure the tables stay aligned, but this
is not always possible, because Unicode does not guarantee how many
cells wide any given character will be in a monospace context.
`;

export const prerender = true;

export const GET = (async ({ }) => {
	let lines = [];
	let encoder = new TextEncoder();
	let pushLine = (line: string) => lines.push(encoder.encode(line + '\n'));
	let boxBottom = "└" + "─".repeat(7) + "┴" + "─".repeat(68) + "┘";
	let spacer = `│       ┊ ${' '.repeat(66)} │`;

	pushLine(preamble.trim());
	pushLine('');
	for (const block of getBlocks()) {
		let firstCp = codepointToString(block.range.first);
		let lastCp = codepointToString(block.range.last);
		let title = ` [ ${firstCp}-${lastCp}  ${block.name} ] `;
		if (skipBlock(block)) {
			title = title.padEnd(78 - 19, '┄');
			title = title.padStart(78, '┄');
			pushLine(title);
			pushLine('');
			continue;
		}
		title = title.padEnd(68 - 10, '─');
		title = title.padStart(68, '─');
		title = "┌" + "─".repeat(7) + "┬" + title + "┐";
		pushLine(title);
		pushLine(`│       ┊    0   1   2   3   4   5   6   7   8   9   A   B   C   D   E   F   │`);
		pushLine(spacer);
		let firstRow = block.range.first >> 4;
		let lastRow = (block.range.last + 15) >> 4;
		for (let row = firstRow; row < lastRow; row++) {
			let chars = [];
			for (let i = 0; i < 16; i++) {
				let scalar = (row << 4) + i;
				let char: Char | InvalidChar | null = null;

				let widthAdjust = 0;
				let repr = '[X]';
				if (scalar >= block.range.first && scalar <= block.range.last) {
					char = lookupChar(scalar);
					if (char !== null && char.type == "char") {
						if (char.eastAsianWidth == "W" || char.eastAsianWidth == "F") {
							widthAdjust = 1;
						}
						if (char.combiningClass != "NR" || char.category == "Mn" || char.category == "Mc" || char.category == "Me") {
							repr = "◌" + char.text;
							if (char.category != "Mc")
								widthAdjust = -1;
						} else if (char.category == "Cc" || char.category == 'Cf') {
							let alias = char.aliases.find((alias) => alias.type == "abbreviation");
							if (alias) {
								repr = alias.text;
							} else if (char.aliases.length > 0) {
								let shortest = char.aliases.reduce((prev, cur) => cur.text.length < prev.text.length ? cur : prev);
								repr = shortest.text.slice(0, 4);
							}
						} else if (char.category == "Ws" || char.category == "Zs") {
							repr = `'${char.text}'`;
						} else {
							repr = char.text;
						}
					} else if (char !== null && char.type == "invalid" && isPrivateUse(char)) {
						repr = String.fromCodePoint(scalar);
					} else {
						repr = '╌╌';
					}
				} else {
					repr = '░░░░';
				}

				repr = repr.padStart(4 - widthAdjust);
				chars.push(repr);
			}
			let prefix = row.toString(16).toUpperCase().padStart(3, '0').padStart(5);
			pushLine(`│${prefix}x ┊ ${chars.join('')}   │`);
		}
		pushLine(spacer);
		pushLine(boxBottom);
		pushLine('');
	}
	let size = 0;
	for (const line of lines) {
		size += line.length;
	}
	let contents = new Uint8Array(size);
	let i = 0;
	for (const line of lines) {
		contents.set(line, i);
		i += line.length;
	}
	return new Response(contents, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
		}
	});
}) satisfies RequestHandler;
