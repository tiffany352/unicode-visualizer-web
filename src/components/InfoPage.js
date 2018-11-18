/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

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
