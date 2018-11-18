/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

function infoPage (state, action) {
  if (action.type === 'setInfoPage') {
    if (action.page) {
      return {
        page: action.page,
        value: action.value
      }
    }
    else {
      return null
    }
  }
  
  return state || null
}

export default infoPage
