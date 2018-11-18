import React from 'react'
import { connect } from 'react-redux'
import CodepointPage from "./CodepointPage";

function InfoPage (props) {
  switch (props.current && props.current.page) {
    case "codepoint":
      return <CodepointPage codepoint={props.current.value} />
    default:
      return null
  }
}

const mapStateToProps = (state) => {
  return {
    current: state.infoPage
  }
}

const ConnectedInfoPage = connect(mapStateToProps)(InfoPage)

export default ConnectedInfoPage
