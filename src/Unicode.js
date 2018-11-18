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

    console.log(props)

    return props
  }
}

const url = '/ucd.all.grouped.xml.gz'
var database = null
export async function fetchCompressedDatabase () {
  if (database) {
    return database
  }

  const response = await fetch(url);
  const bodyArray = await response.arrayBuffer()
  console.log("compressed xml", new Uint8Array(bodyArray))
  const xmlBinary = inflate(bodyArray)
  console.log("decompressed xml", xmlBinary)
  const xmlText = new TextDecoder('utf-8').decode(xmlBinary)
  const parser = new DOMParser()
  const doc = parser.parseFromString(xmlText, 'application/xml')
  console.log("parsed xml", doc)

  database = new Unicode(doc)
  return database
}

export default Unicode
