/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export function decimalToHex (d, padding) {
  let hex = Number(d).toString(16)
  
  while (hex.length < padding) {
    hex = "0" + hex
  }
  
  return hex
}
