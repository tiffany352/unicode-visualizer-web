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
	Simple_Uppercase_Mapping: input[12],
	Simple_Lowercase_Mapping: input[13],
	Simple_Titlecase_Mapping: input[14],
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

export const sequences = parse(read("NamedSequences"), (input) => ({
	Name: input[0],
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

console.log("Done.");
