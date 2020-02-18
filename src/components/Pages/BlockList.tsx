import React from "react";
import { displayUnicode, urlSlugNormalize } from "../../Util";
import Table from "../Table";
import useAsync, { Status } from "../../useAsync";
import { fetchCompressedDatabase } from "../../Unicode";

export default function BlockList(props: {}) {
  const result = useAsync(async () => {
    const database = await fetchCompressedDatabase();
    return database.getBlockList();
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
      const blocks = result.data.map(block => ({
        link: `/block/${urlSlugNormalize(block.name)}`,
        contents: [
          block.name,
          <code>{displayUnicode(block.first)}</code>,
          <code>{displayUnicode(block.last)}</code>
        ]
      }));
      const headings = ["Name", "Start", "End"];
      content = (
        <Table columns="1fr 8em 8em" headings={headings} rows={blocks} />
      );
      break;
    }
  }

  return (
    <div className="App-content">
      <div className="App-contentContainer">
        <h2>Browse Unicode Blocks</h2>
        {content}
      </div>
    </div>
  );
}
