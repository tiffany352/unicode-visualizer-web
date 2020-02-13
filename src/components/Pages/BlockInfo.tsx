import React from "react";
import { fetchCompressedDatabase, ExtBlockData } from "../../Unicode";
import { displayUnicode, decimalToHex, codepointString } from "../../Util";
import { Link, RouteComponentProps } from "react-router-dom";
import "./BlockInfo.css";

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

        const codepoints = block.codepoints.map(data => (
          <Link
            to={`/codepoint/u+${decimalToHex(data.codepoint, 4)}`}
            className="BlockInfo-row"
          >
            <div className="BlockInfo-cell BlockInfo-code">
              {displayUnicode(data.codepoint)}
            </div>
            <div className="BlockInfo-cell BlockInfo-char">
              {codepointString(data.codepoint)}
            </div>
            <div className="BlockInfo-cell">{data.props.na}</div>
          </Link>
        ));
        let list;
        if (codepoints.length > 0) {
          list = (
            <div className="BlockInfo-table">
              <div className="BlockInfo-row BlockInfo-header">
                <div className="BlockInfo-cell">Codepoint</div>
                <div className="BlockInfo-cell">Char</div>
                <div className="BlockInfo-cell">Name</div>
              </div>
              {codepoints}
            </div>
          );
        } else {
          list = <h3>No codepoints found in this block.</h3>;
        }
        content = (
          <>
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
        <div className="App-contentContainer">
          <h2>{this.props.blockName}</h2>
          {content}
        </div>
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
