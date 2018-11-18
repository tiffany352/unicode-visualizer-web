import React from 'react'
import './CodepointPage.css'

function decimalToHex (d, padding) {
  var hex = Number(d).toString(16)

  while (hex.length < padding) {
      hex = "0" + hex
  }

  return hex
}

function CodepointPage (props) {
  return (
    <div className="CodepointPage-container">
      <h1>
        U+{decimalToHex(props.codepoint, 4)}
      </h1>
    </div>
  )
}

export default CodepointPage
