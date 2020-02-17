import React from "react";
import { fetchCompressedDatabase, Sequence } from "../../Unicode";
import { decimalToHex } from "../../Util";
import Table from "../Table";
import StringBlob, { Encoding } from "../../StringBlob";

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
      sequences: Sequence[];
    }
  | {
      status: Status.Error;
      error: string;
    };

function createUrl(text: string) {
  const blob = StringBlob.stringDecode(Encoding.Utf16, text).urlEncode();
  return `/inspect/${blob}`;
}

export default class Sequences extends React.Component {
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
        const sequences = this.state.sequences.map(sequence => ({
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

  async fetch() {
    try {
      const database = await fetchCompressedDatabase();
      const sequences = database.getSequenceInfo();
      this.setState({
        status: Status.Loaded,
        sequences
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
