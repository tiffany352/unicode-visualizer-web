import React from "react";
import { decimalToHex } from "../../Util";
import Table from "../Table";
import StringBlob, { Encoding } from "../../StringBlob";
import fetchEmojiData from "../../Emoji";
import useAsync, { Status } from "../../useAsync";

function createUrl(text: string) {
  const blob = StringBlob.stringDecode(Encoding.Utf16, text).urlEncode();
  return `/inspect/${blob}`;
}

export default function Emoji(props: {}) {
  const result = useAsync(fetchEmojiData);

  if (result.status === Status.Loading) {
    return (
      <div className="App-content">
        <div className="App-contentContainer">
          <h2>Browse Emoji Sequences</h2>
          <h3>Loading...</h3>
        </div>
      </div>
    );
  }

  if (result.status === Status.Error) {
    return (
      <div className="App-content">
        <div className="App-contentContainer">
          <h2>Browse Emoji Sequences</h2>
          <h3>{result.message}</h3>
        </div>
      </div>
    );
  }

  const sequences = [];
  for (const sequence of result.data.sequences) {
    if (
      sequence.specifier.type === "sequence" &&
      sequence.specifier.codepoints.length > 1
    ) {
      const codepoints = sequence.specifier.codepoints;
      console.log(codepoints);
      const text = String.fromCodePoint(...codepoints);

      sequences.push({
        link: createUrl(text),
        contents: [
          text,
          sequence.fields[1],
          <code>
            {codepoints.map(code => decimalToHex(code, 4)).join(" ")}
          </code>,
          sequence.fields[0].replace(/_/g, " ")
        ]
      });
    }
  }

  const headings = ["Text", "Name", "Codepoints", "Type"];
  return (
    <div className="App-content">
      <div className="App-contentContainer">
        <h2>Browse Emoji Sequences</h2>
        <Table columns="6em 3fr 1fr 1fr" headings={headings} rows={sequences} />
      </div>
    </div>
  );
}
