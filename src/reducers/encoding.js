/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

function encoding (state, action) {
  if (action.type === 'setEncoding') {
    return action.encoding
  }

  return state || 'UTF-16'
}

export default encoding
