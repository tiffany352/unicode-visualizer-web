/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export function decimalToHex (d, padding) {
  return Number(d).toString(16).padStart(padding, '0')
}

export function hexEncode(array, padding) {
  return Array.from(array)
    .map((byte) => byte.toString(16).padStart(padding, '0'))
    .join('.')
}

export function hexDecode(string, padding) {
  string = string.replace(/[^a-fA-F0-9]/g, '')
  const array = []

  for (let i = 0; i < string.length; i += padding) {
    const slice = string.substring(i, i + padding)
    array.push(parseInt(slice, 16))
  }

  return array
}
