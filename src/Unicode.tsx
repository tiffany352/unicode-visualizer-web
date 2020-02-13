/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// A class for dealing with the unicode character database, encoded as a single huge xml file.

import { inflate } from "pako";

export type CodepointData = {
  codepoint: number;
  props: {
    [key: string]: string;
  };
  names: {
    alias: string;
    aliasType: string;
  }[];
};

export type BlockData = {
  first: number;
  last: number;
  name: string;
};

export type ExtBlockData = BlockData & {
  codepoints: CodepointData[];
};

class Unicode {
  xml: Document;

  constructor(xml: Document) {
    this.xml = xml;
  }

  getCodepointsMatching(
    filter: (codepoint: number) => boolean
  ): CodepointData[] {
    const values = [];
    for (const node of this.xml.getElementsByTagName("char")) {
      const cp = node.getAttribute("cp");
      if (cp) {
        const cpInt = parseInt(cp, 16);
        if (filter(cpInt)) {
          values.push(this.parseCharNode(node));
        }
      }
    }

    return values;
  }

  getCodepoint(codepoint: number): CodepointData | null {
    const values = this.getCodepointsMatching(value => value === codepoint);
    if (values.length > 0) {
      return values[0];
    } else {
      return null;
    }
  }

  parseCharNode(node: Element): CodepointData {
    const parent = node.parentElement;
    const props: { [key: string]: string } = {};
    if (parent && parent.nodeName === "group") {
      const attrs = parent.attributes;
      for (let i = 0; i < attrs.length; i++) {
        props[attrs[i].name] = attrs[i].value;
      }
    }

    const attrs = node.attributes;
    for (let i = 0; i < attrs.length; i++) {
      props[attrs[i].name] = attrs[i].value;
    }

    const names = [];
    const children = node.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.nodeName === "name-alias") {
        const alias = child.getAttribute("alias");
        const aliasType = child.getAttribute("type");
        if (alias && aliasType) {
          names.push({
            alias,
            aliasType
          });
        }
      }
    }

    const cpStr = node.getAttribute("cp");
    const codepoint = cpStr && parseInt(cpStr, 16);

    if (!codepoint) {
      throw new Error("Failed to parse codepoint");
    }

    return {
      names,
      props,
      codepoint
    };
  }

  getBlockList(): BlockData[] {
    // <block first-cp="0000" last-cp="007F" name="Basic Latin"/>
    const blocks = [];
    for (const node of this.xml.getElementsByTagName("block")) {
      const block = this.parseBlockNode(node);
      if (block) {
        blocks.push(block);
      }
    }
    return blocks;
  }

  getBlockInfo(name: string): ExtBlockData | null {
    for (const node of this.xml.getElementsByTagName("block")) {
      const block = this.parseBlockNode(node);
      if (block && block.name == name) {
        const codepoints = this.getCodepointsMatching(
          value => value >= block.first && value <= block.last
        );
        codepoints.sort((left, right) => left.codepoint - right.codepoint);
        return {
          ...block,
          codepoints
        };
      }
    }
    return null;
  }

  parseBlockNode(node: Element): BlockData | null {
    const firstStr = node.getAttribute("first-cp");
    const lastStr = node.getAttribute("last-cp");
    const name = node.getAttribute("name");
    const first = firstStr && parseInt(firstStr, 16);
    const last = lastStr && parseInt(lastStr, 16);
    if (first && last && name) {
      return {
        first,
        last,
        name
      };
    }

    return null;
  }
}

const url = process.env.PUBLIC_URL + "/ucd.all.grouped.xml.gz";
let database: Unicode | null = null;
export async function fetchCompressedDatabase() {
  if (database) {
    return database;
  }

  const response = await fetch(url);
  const bodyArray = await response.arrayBuffer();
  const xmlBinary = inflate(new Uint8Array(bodyArray));
  const xmlText = new TextDecoder("utf-8").decode(xmlBinary);
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "application/xml");

  database = new Unicode(doc);
  return database;
}

export default Unicode;
