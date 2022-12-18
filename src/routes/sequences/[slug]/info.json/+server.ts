/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import StringBlob, { Encoding } from "$lib/model/StringBlob";
import {
	lookupChar,
	lookupSequence,
	type CharMap,
	lookupSequenceSlug,
} from "$lib/server/Unicode";
import type { SequenceInfo } from "$lib/server/Unicode";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params }) => {
	const { slug } = params;

	const sequence = lookupSequenceSlug(slug);
	if (!sequence) {
		throw error(404);
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

	return json({
		sequence,
		codepoints,
		sequences,
	});
};
