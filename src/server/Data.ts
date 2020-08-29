/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import fs from "fs";
import { parse } from "./SemicolonValues";
import * as t from "./Types";

function read(name: string) {
	return fs.readFileSync(`data/${name}.txt`, { encoding: "utf-8" });
}

console.log("Parsing UCD.");

export const unicodeData = parse(read("UnicodeData"), (input) => ({
	Codepoint: t.codepoint(input[0]),
	Name: t.name(input[1]),
	General_Category: input[2],
	Canonical_Combining_Class: input[3],
	Bidi_Class: input[4],
	Decomposition_Type: input[5],
	Decomposition_Mapping: input[6],
	Numeric_Type: input[7],
	Numeric_Value: input[8],
	Bidi_Mirrored: t.binary(input[9]),
	Unicode_1_Name: input[10], // Always empty
	ISO_Comment: input[11], // Always empty
	Simple_Uppercase_Mapping: t.optional(input[12], t.codepointList),
	Simple_Lowercase_Mapping: t.optional(input[13], t.codepointList),
	Simple_Titlecase_Mapping: t.optional(input[14], t.codepointList),
}));

export const blocks = parse(read("Blocks"), (input) => ({
	Range: t.codepointRange(input[0]),
	Block: input[1],
}));

export const nameAliasType = t.enumeration([
	"correction",
	"control",
	"alternate",
	"figment",
	"abbreviation",
]);

export const nameAliases = parse(read("NameAliases"), (input) => ({
	Codepoint: t.codepoint(input[0]),
	Alias: input[1],
	Type: nameAliasType(input[2]),
}));
export type NameAlias = typeof nameAliases[0];

type NamedSequence = "Named_Sequence";

export const sequences = parse(read("NamedSequences"), (input) => ({
	Name: input[0],
	Type: "Named_Sequence" as NamedSequence,
	Codepoints: t.codepointList(input[1]),
}));

const versionRegex = /Version ([\d\.]+)/;

const result = read("ReadMe").match(versionRegex);
if (!result) {
	throw new Error("ReadMe.txt didn't contain version number");
}
export const version = result[1];

export const derivedAge = parse(read("DerivedAge"), (input) => ({
	Range: t.codepointOrRange(input[0]),
	Version: input[1],
}));

export const derivedName = parse(read("extracted/DerivedName"), (input) => ({
	Range: t.codepointOrRange(input[0]),
	Name: input[1],
}));

const emojiType = t.enumeration([
	"Extended_Pictographic",
	"Emoji_Component",
	"Emoji_Modifier_Base",
	"Emoji_Presentation",
	"Emoji_Modifier",
	"Emoji",
]);

export const emojiData = parse(read("emoji/emoji-data"), (input) => ({
	Range: t.codepointOrRange(input[0]),
	Type: emojiType(input[1]),
}));

const emojiSequenceType = t.enumeration([
	"Basic_Emoji",
	"Emoji_Keycap_Sequence",
	"RGI_Emoji_Flag_Sequence",
	"RGI_Emoji_Tag_Sequence",
	"RGI_Emoji_Modifier_Sequence",
]);

export const emojiSequences = parse(read("emoji/emoji-sequences"), (input) => ({
	Codepoints: t.codepointListOrRange(input[0]),
	Type: emojiSequenceType(input[1]),
	Name: t.escapedString(input[2]),
}));

const emojiZwjSequenceType = t.enumeration(["RGI_Emoji_ZWJ_Sequence"]);

export const emojiZwjSequences = parse(
	read("emoji/emoji-zwj-sequences"),
	(input) => ({
		Codepoints: t.codepointList(input[0]),
		Type: emojiZwjSequenceType(input[1]),
		Name: t.escapedString(input[2]),
	})
);

export const scripts = parse(read("Scripts"), (input) => ({
	Range: t.codepointOrRange(input[0]),
	Script: input[1],
}));

export const statusType = t.enumeration([
	"C", // Common
	"F", // Full
	"S", // Simple
	"T", // Turkish
]);

export const caseFolding = parse(read("CaseFolding"), (input) => ({
	Codepoint: t.codepoint(input[0]),
	Status: statusType(input[1]),
	Mapping: t.codepointList(input[2]),
}));

export const propList = parse(read("PropList"), (input) => ({
	Range: t.codepointOrRange(input[0]),
	Prop: input[1],
}));

export const eastAsianWidthType = t.enumeration([
	"A",
	"F",
	"H",
	"Na",
	"W",
	"N",
]);

export const eastAsianWidth = parse(read("EastAsianWidth"), (input) => ({
	Range: t.codepointOrRange(input[0]),
	Type: eastAsianWidthType(input[1]),
}));

export const numericType = t.enumeration(["Decimal", "Digit", "Numeric"]);

export const derivedNumericType = parse(
	read("extracted/DerivedNumericType"),
	(input) => ({
		Range: t.codepointOrRange(input[0]),
		Type: numericType(input[1]),
	})
);

export const derivedNumericValue = parse(
	read("extracted/DerivedNumericValues"),
	(input) => ({
		Range: t.codepointOrRange(input[0]),
		Numeric_Value: input[1],
		Fraction: input[3],
	})
);

console.log("Done.");
