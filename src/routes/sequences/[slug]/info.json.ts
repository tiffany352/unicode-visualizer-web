import type { Request, Response, NextFunction } from "express";
import StringBlob, { Encoding } from "model/StringBlob";
import {
	lookupChar,
	lookupSequence,
	CharMap,
	lookupSequenceSlug,
} from "server/UnicodeXml";
import type { NamedSequence } from "server/UnicodeParser";

export async function get(req: Request, res: Response, next: NextFunction) {
	const { slug } = req.params;

	const sequence = lookupSequenceSlug(slug);
	if (!sequence) {
		return next();
	}

	const string = StringBlob.stringDecode(Encoding.Utf8, sequence.sequence);
	const codepoints: CharMap = {};

	for (const codepoint of string.getCodepoints()) {
		if (codepoint.value && !codepoints[codepoint.value]) {
			const char = lookupChar(codepoint.value);
			if (char) {
				codepoints[codepoint.value.toString(16)] = char;
			}
		}
	}

	const sequences: NamedSequence[] = [];

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
