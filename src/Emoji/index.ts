import sequences from "./emoji-sequences.txt";
import variationSequences from "./emoji-variation-sequences.txt";
import zwjSequences from "./emoji-zwj-sequences.txt";

export type Specifier =
  | {
      type: "sequence";
      codepoints: number[];
    }
  | {
      type: "range";
      first: number;
      last: number;
    };

export type Record = {
  specifier: Specifier;
  fields: string[];
};

function parse(input: string): Record[] {
  const lines = input.split("\n");
  const records: Record[] = [];
  for (const line of lines) {
    const [content] = line.split("#");
    if (content.trim() === "") continue;
    const [firstField, ...rest] = content.split(";");
    const fields = rest.map(str => str.trim());
    const [rangeStart, rangeEnd] = firstField.split("..");
    let specifier: Specifier;
    if (rangeEnd && rangeEnd.trim()) {
      specifier = {
        type: "range",
        first: parseInt(rangeStart.trim(), 16),
        last: parseInt(rangeEnd.trim(), 16)
      };
    } else {
      specifier = {
        type: "sequence",
        codepoints: rangeStart
          .trim()
          .split(" ")
          .map(str => parseInt(str, 16))
      };
    }
    records.push({
      specifier,
      fields
    });
  }
  return records;
}

export type EmojiData = {
  sequences: Record[];
  variations: Record[];
  zwjSequences: Record[];
};

async function downloadFile(url: string) {
  const response = await fetch(url);
  const text = await response.text();
  return parse(text);
}

let data: EmojiData | null = null;
export default async function fetchEmojiData() {
  if (data) {
    return data;
  }

  const [sequenceData, variationData, zwjData] = await Promise.all([
    downloadFile(sequences),
    downloadFile(variationSequences),
    downloadFile(zwjSequences)
  ]);

  data = {
    sequences: sequenceData,
    variations: variationData,
    zwjSequences: zwjData
  };

  return data;
}
