/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import type { Request, Response, NextFunction } from "express";
import StringBlob, { Encoding } from "$lib/model/StringBlob";
import {
	lookupChar,
	lookupSequence,
	CharMap,
	lookupSequenceSlug,
} from "$lib/server/Unicode";
import type { SequenceInfo } from "$lib/server/Unicode";

export async function get(req: Request, res: Response, next: NextFunction) {
	const { slug } = req.params;

	const sequence = lookupSequenceSlug(slug);
	if (!sequence) {
		return next();
	}

	const string = StringBlob.stringDecode(Encoding.Utf8, sequence.text);
	const codepoints: CharMap = {};

	for (const codepoint of string.getCodepoints()) {
		if (codepoint.value && !codepoints[codepoint.value]) {
			const char = lookupChar(codepoint.value);
			if (char) {
				codepoints[codepoint.value.toString(16)] = char;
			}
		}
	}

	const sequences: SequenceInfo[] = [];

	for (const grapheme of string.getGraphemes()) {
		const sequence = lookupSequence(grapheme.text);
		if (sequence) {
			sequences.push(sequence);
		}
	}

	res.json({
		sequence,
		codepoints,
		sequences,
	});
}
