/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from "react";
import "./CodepointPage.css";
import { decimalToHex, codepointString, hexEncode } from "../Util";
import Utf8String from "../Utf8";
import Utf16String from "../Utf16";
import { getDisplayText } from "../Strings";
import { Tag, TagList } from "./Tag";
import { Link } from "react-router-dom";
import StringBlob, { Encoding } from "../StringBlob";
import useAsync, { Status } from "../useAsync";
import { fetchCompressedDatabase } from "../Unicode";

function renderBoxes(data: Iterable<number>, padding: number) {
  const array = Array.from(data);
  return (
    <div className="CodepointPage-boxes">
      {array.map((value, index) => (
        <div key={index} className="CodepointPage-box">
          {decimalToHex(value, padding)}
        </div>
      ))}
    </div>
  );
}

function parseCodepointStr(input: string) {
  return input
    .split(" ")
    .map(codeStr => String.fromCodePoint(parseInt(codeStr, 16)))
    .join("");
}

function urlString(input: string) {
  const first = input.codePointAt(0);
  if (first !== undefined && String.fromCodePoint(first) === input) {
    return `/codepoint/u+${decimalToHex(first, 4)}`;
  } else {
    const blob = StringBlob.stringDecode(Encoding.Utf16, input);
    return `/inspect/${blob.urlEncode()}`;
  }
}

function createUrl(input: string, defaultCase: JSX.Element | string) {
  if (input === undefined || input === "#") return defaultCase;

  const str = parseCodepointStr(input);
  return (
    <Link to={urlString(str)}>
      {str} (U+{input})
    </Link>
  );
}

function cleanupName(input: string, emptyValue = "") {
  if (input === undefined || input === emptyValue) return "";

  return input.replace(/_/g, " ");
}

function normalForm(input: number, form: string) {
  const str = String.fromCodePoint(input);
  const norm = str.normalize(form);
  if (str !== norm) {
    const codepoints = [];
    for (const cp of norm) {
      codepoints.push(cp.codePointAt(0) as number);
    }
    const result = hexEncode(codepoints, 4);
    return (
      <Link to={urlString(norm)}>
        {norm} (U+{result})
      </Link>
    );
  }
  return "";
}

export default function CodepointPage({ codepoint }: { codepoint: number }) {
  const result = useAsync(async () => {
    let error = null;
    if (codepoint < 0) {
      error = "Negative values are not valid Unicode codepoints";
    } else if (codepoint > 0x10ffff) {
      error = "Values above U+10FFFF are not valid Unicode codepoints";
    } else if (codepoint >= 0xe000 && codepoint <= 0xf8ff) {
      error =
        "Codepoint belongs to the Private Use Area (Basic Multilingual Plane)";
    } else if (codepoint >= 0xf0000 && codepoint <= 0xffffd) {
      error = "Codepoint belongs to Supplementary Private Use Area-A";
    } else if (codepoint >= 0x100000 && codepoint <= 0x10fffd) {
      error = "Codepoint belongs to Supplementary Private Use Area-B";
    } else if (
      codepoint % 0x10000 === 0xfffe ||
      codepoint % 0x10000 === 0xffff ||
      (codepoint >= 0xfdd0 && codepoint <= 0xfdef)
    ) {
      error =
        'Codepoint is "permanently reserved for internal use" according to Corrigendum #9';
    } else if (codepoint >= 0xd800 && codepoint <= 0xdbff) {
      error = "UTF-16 high surrogate value, not a valid Unicode codepoint";
    } else if (codepoint >= 0xdc00 && codepoint <= 0xdfff) {
      error = "UTF-16 low surrogate value, not a valid Unicode codepoint";
    }

    if (error) {
      throw new Error(error);
    }

    const database = await fetchCompressedDatabase();
    const data = database.getCodepoint(codepoint);
    if (!data) {
      throw new Error("No data found in Unicode Character Database");
    }
    return data;
  }, [codepoint]);

  if (result.status === Status.Loading) {
    return (
      <div className="CodepointPage-container">
        <h1>U+{decimalToHex(codepoint, 4)}</h1>
        <p className="CodepointPage-display">{codepointString(codepoint)}</p>
        <h1>Loading...</h1>
      </div>
    );
  } else if (result.status === Status.Error) {
    return (
      <div className="CodepointPage-container">
        <h1>U+{decimalToHex(codepoint, 4)}</h1>
        <p className="CodepointPage-display">{codepointString(codepoint)}</p>
        <h1>{result.message}</h1>
      </div>
    );
  }
  const info = result.data;

  const otherNames = info.names.map(
    name => `${name.alias} (${name.aliasType})`
  );
  const props = info.props;

  const category = getDisplayText(`generalCategory.${props.gc}`);
  const script = getDisplayText(`scriptName.${props.sc}`);
  const numericType = getDisplayText(`numericType.${props.nt}`);
  const eastAsianWidth = getDisplayText(`eastAsianWidth.${props.ea}`);
  const hangul = getDisplayText(`hangulSyllable.${props.hst}`);

  const entries: [string, string | JSX.Element][] = [
    ["Name", props.na],
    ["Other Names", `${otherNames.join(", ")}`],
    ["Block", cleanupName(props.blk)],
    ["Appeared", `Unicode ${props.age}`],
    ["General Category", `${category} (${props.gc})`],
    ["Script", script],
    ["Uppercase", createUrl(props.uc, "None")],
    ["Lowercase", createUrl(props.lc, "None")],
    ["Titlecase", createUrl(props.tc, "None")],
    ["Numeric Value", `${numericType}: ${props.nv}`],
    ["Normal Form C", normalForm(codepoint, "NFC")],
    ["Normal Form D", normalForm(codepoint, "NFD")],
    ["Normal Form KC", normalForm(codepoint, "NFKC")],
    ["Normal Form KD", normalForm(codepoint, "NFKD")],
    ["East-Asian Width", eastAsianWidth],
    ["Equivalent Unified Ideograph", createUrl(props.EqUIdeo, "")],
    ["Stroke Count", props.kTotalStrokes],
    ["Mandarin", props.kMandarin],
    ["Cantonese", props.kCantonese],
    ["Korean", props.kKorean],
    ["Japanese (On)", props.kJapaneseOn],
    ["Japanese (Kun)", props.kJapaneseKun],
    ["Hangul Syllable Type", hangul],
    ["Hangul Jamo Short Name", props.JSN],
    ["Indic Syllabic Category", cleanupName(props.InSC, "Other")],
    ["Indic Matra Category", cleanupName(props.InMC, "NA")],
    ["Indic Positional Category", cleanupName(props.InPC, "NA")],
    ["Definition", props.kDefinition],
    ["Comment", props.isc]
  ];

  const data = entries.filter(
    ([, value]) => value && (typeof value !== "string" || value.length > 0)
  );

  const yesValues = [];
  for (const [prop, value] of Object.entries(props)) {
    if (value === "Y") {
      const text = getDisplayText(`property.${prop}`);
      if (text !== "") {
        yesValues.push(<Tag key={prop}>{text}</Tag>);
      }
    }
  }

  const elements = data.map(([name, value]) => (
    <React.Fragment key={name}>
      <dt>{name}</dt>
      <dd>{value}</dd>
    </React.Fragment>
  ));

  return (
    <div className="CodepointPage-container">
      <h1>
        U+{decimalToHex(codepoint, 4)} {props.na}
      </h1>
      <p className="CodepointPage-display">{String.fromCodePoint(codepoint)}</p>
      <h3>Properties</h3>
      <dl>
        {elements}
        <dt>Tags</dt>
        <dd>
          <TagList>{yesValues}</TagList>
        </dd>
        <dt>UTF-8</dt>
        <dd>{renderBoxes(Utf8String.fromCodepoint(codepoint).data, 2)}</dd>
        <dt>UTF-16</dt>
        <dd>{renderBoxes(Utf16String.fromCodepoint(codepoint).data, 4)}</dd>
      </dl>
    </div>
  );
}
