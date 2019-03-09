import React from 'react'
import { Link } from 'react-router-dom'
import StringBlob, { Encoding } from '../../StringBlob'

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
]

export default function Index(props) {
  return (
    <div className="App-content">
      <div className='App-contentContainer'>
        <p>
          This a web tool for inspecting Unicode strings. A naughty string causing a bug in your code? Paste it here and it might help you find out why.
        </p>
        <p>
          This tool has a textbox at the top for easy entry, but it sometimes mangles certain types of input. For example, any newlines are cut out by the browser, and any invalid Unicode is unlikely to survive. If you need to do so, it's possible to directly pass Base16 encoded text like so: <code>/inspect/utf16:006100620063</code>.
        </p>
        <h3>
          Example queries
        </h3>
        <ul>
          {examples.map(({string, description}) => {
            const urlEncoded = StringBlob.stringDecode(Encoding.UTF16, string).urlEncode()
            return (
              <li>
                {description}: <Link to={`/inspect/${urlEncoded}`}>{string}</Link>
              </li>
            )
          })}
          <li>Have more? Submit them as issues on <a href="https://github.com/tiffany352/unicode-visualizer-web">GitHub</a>!</li>
        </ul>
      </div>
    </div>
  )
}
