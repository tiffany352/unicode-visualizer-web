/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as Data from "./Data";
import IntervalTree from "util/IntervalTree";
import Range from "util/Range";
import { IntervalMap } from "util/IntervalMap";

// Types

export interface NameAlias {
	text: string;
	type: "correction" | "control" | "alternate" | "figment" | "abbreviation";
}

export interface ScriptInfo {
	name: string;
}

// Refers to a codepoint
export interface CaseMappingSimple {
	type: "simple";
	text: string;
	name: string;
	codepointStr: string;
	slug: string;
}

// Refers to a sequence
export interface CaseMappingFull {
	type: "full";
	text: string;
}

export type CaseMapping = CaseMappingSimple | CaseMappingFull | null;

export type EastAsianWidth = "A" | "F" | "H" | "Na" | "W" | "N";

export type NumericType = "Decimal" | "Digit" | "Numeric";

export interface Numeric {
	type: NumericType;
	value: string;
}

export interface Char {
	type: "char";
	codepoint: number;
	codepointStr: string;
	text: string;
	age: string;
	name: string;
	slug: string;
	aliases: NameAlias[];
	block: BlockInfo;
	tags: string[];
	lowercaseForm: CaseMapping;
	uppercaseForm: CaseMapping;
	titlecaseForm: CaseMapping;
	eastAsianWidth: EastAsianWidth;
	numeric: Numeric | null;
	category: string;
	script: ScriptInfo;
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

export interface BlockInfo {
	range: Range;
	name: string;
	slug: string;
}

export interface SequenceInfo {
	name: string;
	text: string;
	codepoints: number[];
	slug: string;
}

// Data processing

console.log("Processing UCD.");

function toTitleCase(input: string): string {
	return input.replace(
		/([A-Z])([A-Z]+)/g,
		(group, first, rest) => first + rest.toLowerCase()
	);
}

function toSlug(input: string): string {
	return input.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

const blocks: BlockInfo[] = Data.blocks.map((block) => ({
	range: block.Range,
	name: toTitleCase(block.Block),
	slug: toSlug(block.Block),
}));
const blockTree = new IntervalTree(blocks.map((block) => [block.range, block]));

const sequenceList: SequenceInfo[] = Data.sequences.map((seq) => ({
	codepoints: seq.Codepoints,
	text: String.fromCodePoint(...seq.Codepoints),
	name: toTitleCase(seq.Name),
	slug: toSlug(seq.Name),
}));

const sequenceMap = new Map(sequenceList.map((value) => [value.text, value]));

type CharEntrySingle = typeof Data.unicodeData[0];
type CharEntryRange = Omit<CharEntrySingle, "Codepoint"> & {
	Codepoint: null;
	range: Range;
};
type CharEntry = CharEntrySingle | CharEntryRange;

const charList: CharEntry[] = [];
for (let i = 0; i < Data.unicodeData.length; i++) {
	const row = Data.unicodeData[i];
	if (row.Name.type == "label" && row.Name.range == "First") {
		const next = Data.unicodeData[i + 1];
		charList.push({
			...row,
			Codepoint: null,
			range: new Range(row.Codepoint, next.Codepoint),
		});
	} else if (row.Name.type == "label" && row.Name.range == "Last") {
	} else {
		charList.push(row);
	}
}

const charMap = new IntervalMap<CharEntry>();
for (const entry of charList) {
	const range =
		entry.Codepoint != null ? new Range(entry.Codepoint) : entry.range;
	charMap.add(range, entry);
}

const scriptMap = new IntervalMap(
	Data.scripts.map((row) => [row.Range, row.Script])
);

const ageTree = new IntervalTree(
	Data.derivedAge.map((row) => [row.Range, row.Version])
);

const nameTree = new IntervalTree(
	Data.derivedName.map((row) => [row.Range, row.Name])
);

for (const row of Data.derivedAge) {
	for (let i = row.Range.first; i <= row.Range.last; i++) {
		const result = ageTree.get(i);
		if (result != row.Version) {
			throw new Error(
				"IntervalTree returned invalid result: " +
					JSON.stringify({ result, row, i }, undefined, 2)
			);
		}
	}
}

interface NameAliasExt extends NameAlias {
	codepoint: number;
}

const aliasList: NameAliasExt[] = Data.nameAliases.map((row) => ({
	codepoint: row.Codepoint,
	text: row.Alias,
	type: row.Type,
}));
const aliasMap = new Map<number, NameAlias[]>();
for (const row of aliasList) {
	const list = aliasMap.get(row.codepoint) || [];
	aliasMap.set(row.codepoint, list);

	list.push(row);
}

const emojiProps = new Map<string, IntervalTree<true>>();
for (const row of Data.emojiData) {
	const props = emojiProps.get(row.Type) || new IntervalTree();
	emojiProps.set(row.Type, props);

	props.add(row.Range, true);
}

const caseMaps = new Map<number, number[]>(
	Data.caseFolding
		.filter((row) => row.Status == "C" || row.Status == "F")
		.map((row) => [row.Codepoint, row.Mapping])
);

const props = new Map<string, IntervalMap<true>>();
for (const row of Data.propList) {
	const entry = props.get(row.Prop) || new IntervalMap();
	props.set(row.Prop, entry);

	entry.add(row.Range, true);
}

const otherUppercase = props.get("Other_Uppercase") || new IntervalMap();
const otherLowercase = props.get("Other_Lowercase") || new IntervalMap();

const eastAsianWidthMap = new IntervalMap<EastAsianWidth>(
	Data.eastAsianWidth.map((row) => [row.Range, row.Type])
);

const numericTypeMap = new IntervalMap(
	Data.derivedNumericType.map((row) => [row.Range, row.Type])
);
const numericValueMap = new IntervalMap(
	Data.derivedNumericValue.map((row) => [row.Range, row.Fraction])
);

console.log("Done.");

// Getters

export function getProperty(prop: string, codepoint: number): boolean {
	const entry = props.get(prop);
	if (entry) {
		return entry.get(codepoint) || false;
	}
	return false;
}

export function getBlocks(): BlockInfo[] {
	return blocks;
}

export function getBlockFromSlug(slug: string): BlockInfo | null {
	return blocks.find((block) => block.slug === slug) || null;
}

export interface CodepointListing {
	codepoints: CharInfo[];
}

export function getCodepointsInRange(
	first: number,
	last: number
): CodepointListing {
	const codepoints = [];
	for (let i = first; i <= last; i++) {
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
	return sequenceMap.get(text) || null;
}

export function lookupSequenceSlug(slug: string): SequenceInfo | null {
	return sequenceList.find((seq) => seq.slug == slug) || null;
}

export function getDescription(): string {
	return Data.version;
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
	for (const row of Data.derivedAge) {
		set.add(row.Version);
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

	let chars: CharInfo[] = [];
	for (const row of Data.derivedAge) {
		if (row.Version == version) {
			const range = row.Range;
			const result = getCodepointsInRange(range.first, range.last);
			chars = chars.concat(result.codepoints);
		}
	}

	cachedVersions.set(version, chars);

	return chars;
}

function codepointToString(codepoint: number): string {
	return codepoint.toString(16).toUpperCase().padStart(4, "0");
}

function findName(
	entry: CharEntry,
	aliases: NameAlias[],
	codepoint: number
): string {
	if (entry.Name.type == "name") {
		return toTitleCase(entry.Name.text);
	}
	let result = nameTree.get(codepoint);
	if (result) {
		result = result.replace("*", codepointToString(codepoint));
		if (result.startsWith("HANGUL SYLLABLE")) {
			result = result.replace("HANGUL SYLLABLE", "Hangul Syllable");
		} else {
			result = toTitleCase(result);
		}
		result = result.replace("Cjk", "CJK");
		return result;
	}

	if (!aliases || aliases.length < 1) {
		return "";
	}
	const first = aliases.find((alias) => alias.type != "abbreviation");
	if (first) {
		return toTitleCase(first.text);
	}
	return toTitleCase(aliases[0].text);
}

function parseCaseMap(codepoints: number[] | null): CaseMapping {
	if (!codepoints) {
		return null;
	}

	if (codepoints.length > 1) {
		return {
			type: "full",
			text: String.fromCodePoint(...codepoints),
		};
	} else {
		const codepoint = codepoints[0];
		const entry = charMap.get(codepoint);
		if (entry) {
			const aliases = aliasMap.get(codepoint) || [];
			const name = findName(entry, aliases, codepoint);
			const codepointStr = codepointToString(codepoint);
			const slugName = toSlug(name);
			const slug = `${codepointStr}-${slugName || "unicode"}`;
			const text = String.fromCodePoint(codepoint);
			return {
				type: "simple",
				codepointStr,
				name,
				text,
				slug,
			};
		}
	}
	return null;
}

function parseEntry(entry: CharEntry, codepoint: number): Char {
	const age = ageTree.get(codepoint) || "undefined";
	const aliases = aliasMap.get(codepoint) || [];
	const name = findName(entry, aliases, codepoint);
	const codepointStr = codepointToString(codepoint);

	const slugName = toSlug(name);
	const slug = `${codepointStr}-${slugName || "unicode"}`;
	const text = String.fromCodePoint(codepoint);

	const block = blockTree.get(codepoint) || {
		name: "None",
		slug: "",
		range: new Range(0, 0),
	};
	const category = entry.General_Category || "None";

	const script = {
		name: scriptMap.get(codepoint) || "Unknown",
	};

	//const caseMapping = caseMaps.get(codepoint) || null;
	let uppercaseForm = parseCaseMap(entry.Simple_Uppercase_Mapping);
	let lowercaseForm = parseCaseMap(entry.Simple_Lowercase_Mapping);
	let titlecaseForm = parseCaseMap(entry.Simple_Titlecase_Mapping);

	const tags: string[] = [];
	for (const [type, tree] of emojiProps.entries()) {
		if (tree.get(codepoint)) {
			tags.push(type);
		}
	}

	const lowercase = category == "Ll" || otherLowercase.get(codepoint) || false;
	const uppercase = category == "Lu" || otherUppercase.get(codepoint) || false;
	const titlecase = category == "Lt";
	if (lowercase) {
		tags.push("Lowercase");
	} else if (uppercase) {
		tags.push("Uppercase");
	} else if (titlecase) {
		tags.push("Titlecase");
	}

	const eastAsianWidth = eastAsianWidthMap.get(codepoint) || "N";

	const numericType = numericTypeMap.get(codepoint);
	let numeric = null;
	if (numericType) {
		const value = numericValueMap.get(codepoint);
		if (value) {
			numeric = {
				type: numericType,
				value,
			};
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
		script,
		tags,
		lowercaseForm,
		uppercaseForm,
		titlecaseForm,
		codepointStr,
		eastAsianWidth,
		numeric,
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

	const result = charMap.get(codepoint);
	if (result) {
		return parseEntry(result, codepoint);
	}

	return null;
}

export function getAllNotableChars(): Char[] {
	const list = [];
	for (const entry of charList) {
		if (entry.Codepoint != null && entry.Name.text) {
			list.push(parseEntry(entry, entry.Codepoint));
		}
	}
	return list;
}

let cachedEmoji: Char[] | null = null;
export function getEmoji(): Char[] {
	if (cachedEmoji) {
		return cachedEmoji;
	}

	const list = [];
	for (const entry of charList) {
		if (entry.Codepoint != null) {
			const char = parseEntry(entry, entry.Codepoint);
			if (char.tags.indexOf("Emoji_Presentation") != -1) {
				list.push(char);
			}
		} else {
			for (let i = entry.range.first; i <= entry.range.last; i++) {
				const char = parseEntry(entry, i);
				if (char.tags.indexOf("Emoji_Presentation") != -1) {
					list.push(char);
				}
			}
		}
	}

	cachedEmoji = list;
	return list;
}
