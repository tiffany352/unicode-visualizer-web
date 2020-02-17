import React from "react";
import { Link } from "react-router-dom";
import StringBlob, { Encoding } from "../../StringBlob";
import DataEntry from "../DataEntry";
import CodepointEntry from "../CodepointEntry";

const examples = [
  {
    string: "你好！怎么样？",
    description: "Chinese text, as a basic demo of UTF16/UTF8 encoding"
  },
  {
    string: "참 쉽죠?",
    description: "Korean jamo, a demo of NFC/NFD"
  },
  {
    string: "👩🏾‍🎤",
    description: "Multi-codepoint emoji sequences"
  },
  {
    string: "h̶̶̵͘͞e̵̢ļ̷́p̴̷̡ ̶̡͘͝m̛̛e̸͟͞",
    description: "Zalgo, showing combining diacritics"
  },
  {
    string: "مرحبا بالعالم",
    description: "Arabic, with its cursive script and RTL"
  },
  {
    string: "café vs café",
    description: "Precomposed vs decomposed forms"
  },
  {
    string: "𝕿𝖍𝖊 𝖖𝖚𝖎𝖈𝖐 𝖇𝖗𝖔𝖜𝖓 𝖋𝖔𝖝",
    description: "Compatibility formatting characters"
  },
  {
    string: "జ్ఞ‌ా",
    description: "A string which used to crash iMessage users"
  }
];

export default function Index(_props: {}) {
  return (
    <div className="App-content">
      <div className="App-contentContainer">
        <p>
          This a web tool for inspecting Unicode strings. A naughty string
          causing a bug in your code? Paste it here and it might help you find
          out why.
        </p>

        <h3>Browse</h3>
        <ul>
          <li>
            <Link to="/browse/blocks">Codepoints by block</Link>
          </li>
          <li>
            <Link to="/browse/sequences">Named sequences</Link>
          </li>
        </ul>

        <h3>Example queries</h3>
        <ul>
          {examples.map(({ string, description }) => {
            const urlEncoded = StringBlob.stringDecode(
              Encoding.Utf16,
              string
            ).urlEncode();
            return (
              <li>
                {description}:{" "}
                <Link to={`/inspect/${urlEncoded}`}>{string}</Link>
              </li>
            );
          })}
          <li>
            Have more? Submit them as issues on{" "}
            <a href="https://github.com/tiffany352/unicode-visualizer-web">
              GitHub
            </a>
            !
          </li>
        </ul>

        <h3>Data Entry</h3>
        <p>
          The search bar at the top allows you to conveniently paste in text,
          but it has some limitations. Typically, invalid Unicode gets replaced
          with <code>U+FFFD</code>, newlines are stripped out, and the text is
          converted to UTF-16. These widgets let you enter data directly,
          avoiding any conversion losses.
        </p>
        <h4>Base-16 Entry</h4>
        <p>
          Insert base-16 encoded text in the relevant format. All non-hex
          characters are ignored.
        </p>
        <DataEntry />
        <h4>Codepoint List Entry</h4>
        <p>
          Insert a list of codepoints. Non-hex characters are used as
          delimiters.
        </p>
        <CodepointEntry />
      </div>
    </div>
  );
}
