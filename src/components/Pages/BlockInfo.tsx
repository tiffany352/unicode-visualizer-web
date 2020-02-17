import React from "react";
import { displayUnicode, decimalToHex, codepointString } from "../../Util";
import { RouteComponentProps } from "react-router-dom";
import Table from "../Table";
import useUnicodeData, { Status } from "../../useUnicodeData";

type Props = {
  blockName: string;
};

function BlockInfo(props: Props) {
  const result = useUnicodeData(database => {
    const block = database.getBlockInfo(props.blockName);

    if (!block) {
      throw new Error(`No block named "${props.blockName}" found`);
    }

    return block;
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
      const block = result.data;

      const codepoints = block.codepoints.map(data => ({
        link: `/codepoint/u+${decimalToHex(data.codepoint, 4)}`,
        contents: [
          <code>{displayUnicode(data.codepoint)}</code>,
          <code> {codepointString(data.codepoint)}</code>,
          data.props.na
        ]
      }));
      let list;
      if (codepoints.length > 0) {
        const headings = ["Codepoint", "Char", "Name"];
        list = (
          <Table columns="8em 5em 1fr" headings={headings} rows={codepoints} />
        );
      } else {
        list = <h3>No codepoints found in this block.</h3>;
      }
      content = (
        <>
          <h2>{block.name}</h2>
          <p>
            This block contains characters from{" "}
            <code>{displayUnicode(block.first)}</code> to{" "}
            <code>{displayUnicode(block.last)}</code>. (
            {block.last - block.first + 1} scalars, {codepoints.length}{" "}
            assigned)
          </p>
          {list}
        </>
      );
      break;
    }
  }

  return (
    <div className="App-content">
      <div className="App-contentContainer">{content}</div>
    </div>
  );
}

export default function BlockInfoPage(
  props: RouteComponentProps<{ blockName: string }>
) {
  const { match } = props;

  return <BlockInfo blockName={match.params.blockName} />;
}
