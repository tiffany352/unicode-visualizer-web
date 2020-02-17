/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// A class for dealing with the unicode character database, encoded as a single huge xml file.

import { inflate } from "pako";
import { urlSlugNormalize, decimalToHex } from "./Util";
import dataFileUrl from "./ucd.all.grouped.xml.gz";

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

export type Sequence = {
  name: string;
  codepoints: number[];
  text: string;
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

    if (props.na === "" && names.length > 0) {
      // Some characters don't have this set for some reason.
      const prefer = names.find(name => name.aliasType !== "abbreviation");
      if (prefer) {
        props.na = prefer.alias;
      } else {
        props.na = names[0].alias;
      }
    }

    const cpStr = node.getAttribute("cp");
    const codepoint = cpStr && parseInt(cpStr, 16);

    if (!codepoint) {
      throw new Error("Failed to parse codepoint");
    }

    if (props.na === "CJK UNIFIED IDEOGRAPH-#") {
      props.na = `CJK UNIFIED IDEOGRAPH-${decimalToHex(codepoint, 4)}`;
    }
    if (props.na === "CJK COMPATIBILITY IDEOGRAPH-#") {
      props.na = `CJK COMPATIBILITY IDEOGRAPH-${decimalToHex(codepoint, 4)}`;
    }

    return {
      names,
      props,
      codepoint
    };
  }

  getBlockList(): BlockData[] {
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
      if (block && urlSlugNormalize(block.name) === name) {
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
    // <block first-cp="0000" last-cp="007F" name="Basic Latin"/>
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

  getSequenceInfo(): Sequence[] {
    const sequences = [];
    for (const node of this.xml.getElementsByTagName("named-sequence")) {
      const sequence = this.parseSequenceNode(node);
      if (sequence) {
        sequences.push(sequence);
      }
    }
    return sequences;
  }

  parseSequenceNode(node: Element): Sequence | null {
    const name = node.getAttribute("name");
    const cps = node.getAttribute("cps");
    const cpList = cps && cps.split(" ");
    if (name && cpList) {
      const codepoints = cpList.map(str => parseInt(str, 16));
      return {
        name,
        codepoints,
        text: String.fromCodePoint(...codepoints)
      };
    }
    return null;
  }
}

let database: Unicode | null = null;
export async function fetchCompressedDatabase() {
  if (database) {
    return database;
  }

  const response = await fetch(dataFileUrl);
  const bodyArray = await response.arrayBuffer();
  const xmlBinary = inflate(new Uint8Array(bodyArray));
  const xmlText = new TextDecoder("utf-8").decode(xmlBinary);
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "application/xml");

  database = new Unicode(doc);
  return database;
}

export default Unicode;
