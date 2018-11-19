/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// A class for dealing with the unicode character database, encoded as a single huge xml file.

import { inflate } from 'pako'

class Unicode {
  constructor (xml) {
    this.xml = xml
  }

  getCodepoint (codepoint) {
    for (const node of this.xml.getElementsByTagName('char')) {
      const cp = node.getAttribute('cp')
      if (cp) {
        const cpInt = parseInt(cp, 16)
        if (cpInt === codepoint) {
          return this.parseCharNode(node)
        }
      }
    }

    console.log("codepoint not found in ucd", codepoint)

    return null
  }

  parseCharNode(node) {
    const parent = node.parentElement
    const props = {}
    if (parent.nodeName === 'group') {
      const attrs = parent.attributes
      for (let i = 0; i < attrs.length; i++) {
        props[attrs[i].name] = attrs[i].value
      }
    }

    const attrs = node.attributes
    for (let i = 0; i < attrs.length; i++) {
      props[attrs[i].name] = attrs[i].value
    }

    const names = []
    const children = node.children
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      if (child.nodeName === 'name-alias') {
        names.push({
          alias: child.getAttribute('alias'),
          aliasType: child.getAttribute('type'),
        })
      }
    }
    props.names = names

    return props
  }
}

const url = './ucd.all.grouped.xml.gz'
var database = null
export async function fetchCompressedDatabase () {
  if (database) {
    return database
  }

  const response = await fetch(url);
  const bodyArray = await response.arrayBuffer()
  const xmlBinary = inflate(bodyArray)
  const xmlText = new TextDecoder('utf-8').decode(xmlBinary)
  const parser = new DOMParser()
  const doc = parser.parseFromString(xmlText, 'application/xml')

  database = new Unicode(doc)
  return database
}

export default Unicode
