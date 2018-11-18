/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

function text (state, action) {
  if (action.type === 'setText') {
    return action.text
  }

  if (action.type === 'normalizeText') {
    return (state || '').normalize(action.form)
  }

  return state || ''
}

export default text
