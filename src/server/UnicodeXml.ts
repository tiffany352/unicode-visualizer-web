import fs from "fs";
import {
	UnicodeParser,
	Block,
	NamedSequence,
	CharSet,
	NameAlias,
} from "./UnicodeParser";

const file = fs.readFileSync("data/ucd.all.grouped.xml");

export interface Char {
	type: "char";
	codepoint: number;
	age: string;
	name: string;
	aliases: NameAlias[];
	block: string;
	category: string;
}

const result = UnicodeParser.parse(file);

export function getBlocks(): Block[] {
	return result.blocks;
}

export function getSequences(): NamedSequence[] {
	return result.sequences;
}

export function getDescription(): string {
	return result.description;
}

function parseEntry(entry: CharSet, codepoint: number): Char {
	const attrs = { ...entry.group, ...entry.attrs };
	const age = attrs["age"] || "undefined";
	const name = (attrs["na1"] || attrs["na"] || "").replace(
		"#",
		codepoint.toString(16).padStart(4, "0")
	);
	const aliases = entry.aliases || [];
	const category = attrs["gc"] || "None";

	let block = attrs["blk"] || "None";
	for (const blockEntry of result.blocks) {
		if (codepoint >= blockEntry.first && codepoint <= blockEntry.last) {
			block = blockEntry.name;
			break;
		}
	}

	return { type: "char", codepoint, age, name, aliases, block, category };
}

export type InvalidReason =
	| "negative"
	| "too-large"
	| "private-use"
	| "private-use-sup-a"
	| "private-use-sup-b"
	| "reserved"
	| "surrogate-high"
	| "surrogate-low";

export interface InvalidChar {
	type: "invalid";
	reason: InvalidReason;
}

export function lookupChar(codepoint: number): Char | InvalidChar | null {
	let reason: InvalidReason | null = null;
	if (codepoint < 0) {
		reason = "negative";
	} else if (codepoint > 0x10ffff) {
		reason = "too-large";
	} else if (codepoint >= 0xe000 && codepoint <= 0xf8ff) {
		reason = "private-use";
	} else if (codepoint >= 0xf0000 && codepoint <= 0xffffd) {
		reason = "private-use-sup-a";
	} else if (codepoint >= 0x100000 && codepoint <= 0x10fffd) {
		reason = "private-use-sup-b";
	} else if (
		codepoint % 0x10000 === 0xfffe ||
		codepoint % 0x10000 === 0xffff ||
		(codepoint >= 0xfdd0 && codepoint <= 0xfdef)
	) {
		reason = "reserved";
	} else if (codepoint >= 0xd800 && codepoint <= 0xdbff) {
		reason = "surrogate-high";
	} else if (codepoint >= 0xdc00 && codepoint <= 0xdfff) {
		reason = "surrogate-low";
	}

	if (reason) {
		return {
			type: "invalid",
			reason,
		};
	}

	for (const entry of result.chars) {
		if (codepoint >= entry.first && codepoint <= entry.last) {
			return parseEntry(entry, codepoint);
		}
	}

	return null;
}
