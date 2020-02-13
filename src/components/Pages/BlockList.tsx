import React from "react";
import { BlockData, fetchCompressedDatabase } from "../../Unicode";
import { displayUnicode, urlSlugNormalize } from "../../Util";
import { Link } from "react-router-dom";
import "./BlockList.css";

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
      blocks: BlockData[];
    }
  | {
      status: Status.Error;
      error: string;
    };

export default class BlockList extends React.Component {
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
        const blocks = this.state.blocks.map(block => (
          <Link
            to={`/block/${urlSlugNormalize(block.name)}`}
            className="Blocks-row"
          >
            <div className="Blocks-cell">{block.name}</div>
            <div className="Blocks-cell Blocks-code">
              {displayUnicode(block.first)}
            </div>
            <div className="Blocks-cell Blocks-code">
              {displayUnicode(block.last)}
            </div>
          </Link>
        ));
        content = (
          <div className="Blocks-table">
            <div className="Blocks-row Blocks-header">
              <div className="Blocks-cell">Name</div>
              <div className="Blocks-cell">Start</div>
              <div className="Blocks-cell">End</div>
            </div>
            {blocks}
          </div>
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

  async fetch() {
    try {
      const database = await fetchCompressedDatabase();
      const blocks = database.getBlockList();
      this.setState({
        status: Status.Loaded,
        blocks
      });
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
