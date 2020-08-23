import fs from "fs";
import {
	UnicodeParser,
	Block,
	NamedSequence,
	CharSet,
	NameAlias,
} from "./UnicodeParser";

// Types

export interface Char {
	type: "char";
	codepoint: number;
	codepointStr: string;
	text: string;
	age: string;
	name: string;
	slug: string;
	aliases: NameAlias[];
	block: string;
	category: string;
}

export type InvalidReason =
	| "invalidCodepoint.negative"
	| "invalidCodepoint.too-large"
	| "invalidCodepoint.private-use"
	| "invalidCodepoint.private-use-sup-a"
	| "invalidCodepoint.private-use-sup-b"
	| "invalidCodepoint.reserved"
	| "invalidCodepoint.surrogate-high"
	| "invalidCodepoint.surrogate-low";

export interface InvalidChar {
	type: "invalid";
	codepoint: number;
	codepointStr: string;
	reason: InvalidReason;
}

export type CharInfo = Char | InvalidChar;

export type CharMap = {
	[key: string]: CharInfo;
};

export interface BlockInfo extends Block {
	slug: string;
}

export interface SequenceInfo extends NamedSequence {
	slug: string;
}

// Data processing

console.log("Parsing UCD XML");
const file = fs.readFileSync("data/ucd.all.grouped.xml");
const result = UnicodeParser.parse(file);

const blocks = result.blocks.map((block) => ({
	...block,
	slug: block.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
}));

const sequenceList: SequenceInfo[] = result.sequences.map((seq) => ({
	sequence: seq.sequence,
	name: seq.name.replace(
		/([A-Z])([A-Z]+)/g,
		(group, first, rest) => first + rest.toLowerCase()
	),
	slug: seq.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
}));

const sequences = new Map(sequenceList.map((value) => [value.sequence, value]));

console.log("Done.");

// Getters

export function getBlocks(): BlockInfo[] {
	return blocks;
}

export function getBlockFromSlug(slug: string): BlockInfo | null {
	return blocks.find((block) => block.slug === slug) || null;
}

export interface CodepointListing {
	codepoints: CharInfo[];
}

export function getCodepointsInBlock(block: Block): CodepointListing {
	const codepoints = [];
	for (let i = block.first; i <= block.last; i++) {
		const result = lookupChar(i);
		if (result) {
			codepoints.push(result);
		}
	}
	return { codepoints };
}

export function getSequences(): SequenceInfo[] {
	return sequenceList;
}

export function lookupSequence(text: string): SequenceInfo | null {
	return sequences.get(text) || null;
}

export function lookupSequenceSlug(slug: string): SequenceInfo | null {
	return sequenceList.find((seq) => seq.slug == slug) || null;
}

export function getDescription(): string {
	return result.description;
}

function versionCompare(a: string, b: string): number {
	const [leftMaj, leftMin] = a.split(".");
	const [rightMaj, rightMin] = b.split(".");

	const major = parseInt(leftMaj) - parseInt(rightMaj);
	if (major != 0) {
		return major;
	}
	return parseInt(leftMin) - parseInt(rightMin);
}

export function getVersions(): string[] {
	const set: Set<string> = new Set();
	for (const char of result.chars) {
		const age = char.attrs["age"] || (char.group && char.group["age"]);
		if (age) {
			set.add(age);
		}
	}
	const versions = new Array(...set.values());
	versions.sort(versionCompare);
	versions.reverse();
	return versions;
}

const cachedVersions = new Map();
export function getCodepointsInVersion(version: string): CharInfo[] {
	const cached = cachedVersions.get(version);
	if (cached) {
		return cached;
	}

	const chars = [];
	for (const char of result.chars) {
		const age = char.attrs["age"] || (char.group && char.group["age"]);
		if (age == version) {
			const result = parseEntry(char, char.first);
			chars.push(result);
		}
	}

	cachedVersions.set(version, chars);

	return chars;
}

function findBestAlias(aliases: NameAlias[]): string {
	if (!aliases || aliases.length < 1) {
		return "";
	}
	const first = aliases.find((alias) => alias.type != "abbreviation");
	if (first) {
		return first.alias;
	}
	return aliases[0].alias;
}

function parseEntry(entry: CharSet, codepoint: number): Char {
	const attrs = { ...entry.group, ...entry.attrs };
	const age = attrs["age"] || "undefined";
	const aliases = entry.aliases || [];
	const bestAlias = findBestAlias(aliases);
	const initName: string = attrs["na1"] || attrs["na"] || bestAlias || "";
	const name = initName
		.replace("#", codepoint.toString(16).padStart(4, "0"))
		.replace(
			/([A-Z])([A-Z]+)/g,
			(group, first, rest) => first + rest.toLowerCase()
		);
	const category = attrs["gc"] || "None";
	const codepointStr = codepoint.toString(16).toUpperCase().padStart(4, "0");
	const slugName = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
	const slug = `${codepointStr}-${slugName || "unicode"}`;
	const text = String.fromCodePoint(codepoint);

	let block = attrs["blk"] || "None";
	for (const blockEntry of result.blocks) {
		if (codepoint >= blockEntry.first && codepoint <= blockEntry.last) {
			block = blockEntry.name;
			break;
		}
	}

	return {
		type: "char",
		codepoint,
		age,
		name,
		aliases,
		block,
		category,
		codepointStr,
		slug,
		text,
	};
}

export function lookupChar(codepoint: number): Char | InvalidChar | null {
	let reason: InvalidReason | null = null;
	if (codepoint < 0) {
		reason = "invalidCodepoint.negative";
	} else if (codepoint > 0x10ffff) {
		reason = "invalidCodepoint.too-large";
	} else if (codepoint >= 0xe000 && codepoint <= 0xf8ff) {
		reason = "invalidCodepoint.private-use";
	} else if (codepoint >= 0xf0000 && codepoint <= 0xffffd) {
		reason = "invalidCodepoint.private-use-sup-a";
	} else if (codepoint >= 0x100000 && codepoint <= 0x10fffd) {
		reason = "invalidCodepoint.private-use-sup-b";
	} else if (
		codepoint % 0x10000 === 0xfffe ||
		codepoint % 0x10000 === 0xffff ||
		(codepoint >= 0xfdd0 && codepoint <= 0xfdef)
	) {
		reason = "invalidCodepoint.reserved";
	} else if (codepoint >= 0xd800 && codepoint <= 0xdbff) {
		reason = "invalidCodepoint.surrogate-high";
	} else if (codepoint >= 0xdc00 && codepoint <= 0xdfff) {
		reason = "invalidCodepoint.surrogate-low";
	}

	if (reason) {
		const codepointStr = codepoint.toString(16).toUpperCase().padStart(4, "0");
		return {
			type: "invalid",
			codepoint,
			codepointStr,
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
