/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { combineReducers } from 'redux'
import textReducer from './text'
import infoPageReducer from './infoPage'
import encodingReducer from './encoding'

const reducer = combineReducers({
  text: textReducer,
  infoPage: infoPageReducer,
  encoding: encodingReducer
})

export default reducer
