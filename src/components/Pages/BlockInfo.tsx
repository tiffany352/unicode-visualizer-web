import React from "react";
import { fetchCompressedDatabase, ExtBlockData } from "../../Unicode";
import { displayUnicode, decimalToHex, codepointString } from "../../Util";
import { Link, RouteComponentProps } from "react-router-dom";
import Table from "../Table";

enum Status {
  Loading,
  Loaded,
  Error
}

type State =
  | {
      status: Status.Loading;
    }
  | {
      status: Status.Loaded;
      block: ExtBlockData;
    }
  | {
      status: Status.Error;
      error: string;
    };

type Props = {
  blockName: string;
};

class BlockInfo extends React.Component<Props> {
  state: State = {
    status: Status.Loading
  };

  render() {
    let content;
    switch (this.state.status) {
      case Status.Loading:
        content = <h3>Loading...</h3>;
        break;
      case Status.Error:
        content = <h3>Error: {this.state.error}</h3>;
        break;
      case Status.Loaded: {
        const block = this.state.block;

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
            <Table
              columns="8em 5em 1fr"
              headings={headings}
              rows={codepoints}
            />
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

  async fetch() {
    try {
      const database = await fetchCompressedDatabase();
      const block = database.getBlockInfo(this.props.blockName);
      if (block) {
        console.log("codepoint data", block);
        this.setState({
          status: Status.Loaded,
          block
        });
      } else {
        this.setState({
          status: Status.Error,
          error: `No block named "${this.props.blockName}" found`
        });
      }
    } catch (e) {
      console.log(e);
      this.setState({
        status: Status.Error,
        error: e.toString()
      });
    }
  }

  componentDidMount() {
    this.fetch();
  }
}

export default function BlockInfoPage(
  props: RouteComponentProps<{ blockName: string }>
) {
  const { match } = props;

  return <BlockInfo blockName={match.params.blockName} />;
}
