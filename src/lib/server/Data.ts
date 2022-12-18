/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import fs from "fs";
import { parse, parseTabs } from "./SemicolonValues";
import * as t from "./Types";

function read(name: string) {
	return fs.readFileSync(`data/${name}`, { encoding: "utf-8" });
}

console.log("Parsing UCD.");

export const unicodeData = parse(read("ucd/UnicodeData.txt"), (input) => ({
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

export const blocks = parse(read("ucd/Blocks.txt"), (input) => ({
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

export const nameAliases = parse(read("ucd/NameAliases.txt"), (input) => ({
	Codepoint: t.codepoint(input[0]),
	Alias: input[1],
	Type: nameAliasType(input[2]),
}));
export type NameAlias = typeof nameAliases[0];

type NamedSequence = "Named_Sequence";

export const sequences = parse(read("ucd/NamedSequences.txt"), (input) => ({
	Name: input[0],
	Type: "Named_Sequence" as NamedSequence,
	Codepoints: t.codepointList(input[1]),
}));

const versionRegex = /Version ([\d\.]+)/;

const result = read("ucd/ReadMe.txt").match(versionRegex);
if (!result) {
	throw new Error("ReadMe.txt didn't contain version number");
}
export const version = result[1];

export const derivedAge = parse(read("ucd/DerivedAge.txt"), (input) => ({
	Range: t.codepointOrRange(input[0]),
	Version: input[1],
}));

export const derivedName = parse(
	read("ucd/extracted/DerivedName.txt"),
	(input) => ({
		Range: t.codepointOrRange(input[0]),
		Name: input[1],
	})
);

const emojiType = t.enumeration([
	"Extended_Pictographic",
	"Emoji_Component",
	"Emoji_Modifier_Base",
	"Emoji_Presentation",
	"Emoji_Modifier",
	"Emoji",
]);

export const emojiData = parse(read("ucd/emoji/emoji-data.txt"), (input) => ({
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

export const emojiSequences = parse(
	read("emoji/emoji-sequences.txt"),
	(input) => ({
		Codepoints: t.codepointListOrRange(input[0]),
		Type: emojiSequenceType(input[1]),
		Name: t.escapedString(input[2]),
	})
);

const emojiZwjSequenceType = t.enumeration(["RGI_Emoji_ZWJ_Sequence"]);

export const emojiZwjSequences = parse(
	read("emoji/emoji-zwj-sequences.txt"),
	(input) => ({
		Codepoints: t.codepointList(input[0]),
		Type: emojiZwjSequenceType(input[1]),
		Name: t.escapedString(input[2]),
	})
);

export const scripts = parse(read("ucd/Scripts.txt"), (input) => ({
	Range: t.codepointOrRange(input[0]),
	Script: input[1],
}));

export const statusType = t.enumeration([
	"C", // Common
	"F", // Full
	"S", // Simple
	"T", // Turkish
]);

export const caseFolding = parse(read("ucd/CaseFolding.txt"), (input) => ({
	Codepoint: t.codepoint(input[0]),
	Status: statusType(input[1]),
	Mapping: t.codepointList(input[2]),
}));

export const propList = parse(read("ucd/PropList.txt"), (input) => ({
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

export const eastAsianWidth = parse(
	read("ucd/EastAsianWidth.txt"),
	(input) => ({
		Range: t.codepointOrRange(input[0]),
		Type: eastAsianWidthType(input[1]),
	})
);

export const numericType = t.enumeration(["Decimal", "Digit", "Numeric"]);

export const derivedNumericType = parse(
	read("ucd/extracted/DerivedNumericType.txt"),
	(input) => ({
		Range: t.codepointOrRange(input[0]),
		Type: numericType(input[1]),
	})
);

export const derivedNumericValue = parse(
	read("ucd/extracted/DerivedNumericValues.txt"),
	(input) => ({
		Range: t.codepointOrRange(input[0]),
		Numeric_Value: input[1],
		Fraction: input[3],
	})
);

// Unihan - http://www.unicode.org/reports/tr38/#N10260

export const gradeLevelType = t.intEnum([1, 2, 3, 4, 5, 6]);
export type GradeLevel = ReturnType<typeof gradeLevelType>;

export const kTotalStrokes = new Map<number, number>();
export const kGradeLevel = new Map<number, GradeLevel>();
export const kBigFive = new Map<number, number>();
export const kGB1 = new Map<number, number>();

// Readings
export const kCantonese = new Map<number, string>();
export const kDefinition = new Map<number, string>();
export const kHanyuPinlu = new Map<number, string>();
export const kHanyuPinyin = new Map<number, string>();
export const kJapaneseKun = new Map<number, string>();
export const kJapaneseOn = new Map<number, string>();
export const kKorean = new Map<number, string>();
export const kMandarin = new Map<number, string>();
export const kVietnamese = new Map<number, string>();

// Variants
export const kSimplifiedVariant = new Map<number, number[]>();
export const kTraditionalVariant = new Map<number, number[]>();

parseTabs(
	{
		DictionaryIndices: read("han/Unihan_DictionaryIndices.txt"),
		DictionaryLikeData: read("han/Unihan_DictionaryLikeData.txt"),
		IRGSources: read("han/Unihan_IRGSources.txt"),
		NumericValues: read("han/Unihan_NumericValues.txt"),
		OtherMappings: read("han/Unihan_OtherMappings.txt"),
		RadicalStrokeCounts: read("han/Unihan_RadicalStrokeCounts.txt"),
		Readings: read("han/Unihan_Readings.txt"),
		Variants: read("han/Unihan_Variants.txt"),
	},
	(entry) => {
		switch (entry.type) {
			case "kTotalStrokes":
				kTotalStrokes.set(entry.codepoint, parseInt(entry.value));
				break;
			case "kGradeLevel":
				kGradeLevel.set(entry.codepoint, gradeLevelType(entry.value));
				break;
			case "kBigFive":
				kBigFive.set(entry.codepoint, parseInt(entry.value, 16));
				break;
			case "kGB1":
				kGB1.set(entry.codepoint, parseInt(entry.value, 16));
				break;
			case "kCantonese":
				kCantonese.set(entry.codepoint, entry.value);
				break;
			case "kDefinition":
				kDefinition.set(entry.codepoint, entry.value);
				break;
			case "kHanyuPinlu":
				kHanyuPinlu.set(entry.codepoint, entry.value);
				break;
			case "kHanyuPinyin":
				kHanyuPinyin.set(entry.codepoint, entry.value);
				break;
			case "kJapaneseKun":
				kJapaneseKun.set(entry.codepoint, entry.value);
				break;
			case "kJapaneseOn":
				kJapaneseOn.set(entry.codepoint, entry.value);
				break;
			case "kKorean":
				kKorean.set(entry.codepoint, entry.value);
				break;
			case "kMandarin":
				kMandarin.set(entry.codepoint, entry.value);
				break;
			case "kVietnamese":
				kVietnamese.set(entry.codepoint, entry.value);
				break;
			case "kSimplifiedVariant":
				kSimplifiedVariant.set(entry.codepoint, t.codepointList(entry.value));
				break;
			case "kTraditionalVariant":
				kTraditionalVariant.set(entry.codepoint, t.codepointList(entry.value));
				break;
		}
	}
);

console.log("Done.");
