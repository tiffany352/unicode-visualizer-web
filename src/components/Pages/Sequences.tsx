import React from "react";
import { decimalToHex } from "../../Util";
import Table from "../Table";
import StringBlob, { Encoding } from "../../StringBlob";
import useAsync, { Status } from "../../useAsync";
import { fetchCompressedDatabase } from "../../Unicode";

function createUrl(text: string) {
  const blob = StringBlob.stringDecode(Encoding.Utf16, text).urlEncode();
  return `/inspect/${blob}`;
}

export default function Sequences(props: {}) {
  const result = useAsync(async () => {
    const database = await fetchCompressedDatabase();
    return database.getSequenceInfo();
  });

  let content;
  switch (result.status) {
    case Status.Loading:
      content = <h3>Loading...</h3>;
      break;
    case Status.Error:
      content = <h3>Error: {result.message}</h3>;
      break;
    case Status.Loaded: {
      const sequences = result.data.map(sequence => ({
        link: createUrl(sequence.text),
        contents: [
          sequence.text,
          sequence.name,
          <code>
            {sequence.codepoints.map(code => decimalToHex(code, 4)).join(" ")}
          </code>
        ]
      }));
      const headings = ["Text", "Name", "Codepoints"];
      content = (
        <Table columns="6em 3fr 1fr" headings={headings} rows={sequences} />
      );
      break;
    }
  }

  return (
    <div className="App-content">
      <div className="App-contentContainer">
        <h2>Browse Unicode Named Sequences</h2>
        {content}
      </div>
    </div>
  );
}
