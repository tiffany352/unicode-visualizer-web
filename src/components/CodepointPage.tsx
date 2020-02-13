/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from "react";
import "./CodepointPage.css";
import { fetchCompressedDatabase, CodepointData } from "../Unicode";
import { decimalToHex, codepointString } from "../Util";

const generalCategory: { [key: string]: string } = {
  Lu: "Letter, uppercase",
  Ll: "Letter, lowercase",
  Lt: "Letter, titlecase",
  Lm: "Letter, modifier",
  Lo: "Letter, other",
  Mn: "Mark, nonspacing",
  Mc: "Mark, spacing combining",
  Me: "Mark, enclosing",
  Nd: "Number, decimal digit",
  Nl: "Number, letter",
  No: "Number, other",
  Pc: "Punctuation, connector",
  Pd: "Punctuation, dash",
  Ps: "Punctuation, open",
  Pe: "Punctuation, close",
  Pi: "Punctuation, initial quote",
  Pf: "Punctuation, final quote",
  Po: "Punctuation, other",
  Sm: "Symbol, math",
  Sc: "Symbol, currency",
  Sk: "Symbol, modifier",
  So: "Symbol, other",
  Zs: "Separtaor, space",
  Zl: "Separtaor, line",
  Zp: "Separator, paragraph",
  Cc: "Other, control",
  Cf: "Other, format",
  Cs: "Other, surrogate",
  Co: "Other, private use",
  Cn: "Other, not assigned"
};

const scriptName: { [key: string]: string } = {
  Adlm: "Adlam",
  Afak: "Afaka",
  Aghb: "Caucasian Albanian",
  Ahom: "Ahom, Tai Ahom",
  Arab: "Arabic",
  Aran: "Arabic (Nastaliq variant)",
  Armi: "Imperial Aramaic",
  Armn: "Armenian",
  Avst: "Avestan",
  Bali: "Balinese",
  Bamu: "Bamum",
  Bass: "Bassa Vah",
  Batk: "Batak",
  Beng: "Bengali (Bangla)",
  Bhks: "Bhaiksuki",
  Blis: "Blissymbols",
  Bopo: "Bopomofo",
  Brah: "Brahmi",
  Brai: "Braille",
  Bugi: "Buginese",
  Buhd: "Buhid",
  Cakm: "Chakma",
  Cans: "Unified Canadian Aboriginal Syllabics",
  Cari: "Carian",
  Cham: "Cham",
  Cher: "Cherokee",
  Cirt: "Cirth",
  Copt: "Coptic",
  Cpmn: "Cypro-Minoan",
  Cprt: "Cypriot syllabary",
  Cyrl: "Cyrillic",
  Cyrs: "Cyrillic (Old Church Slavonic variant)",
  Deva: "Devanagari (Nagari)",
  Dogr: "Dogra",
  Dsrt: "Deseret (Mormon)",
  Dupl: "Duployan shorthand, Duployan stenography",
  Egyd: "Egyptian demotic",
  Egyh: "Egyptian hieratic",
  Egyp: "Egyptian hieroglyphs",
  Elba: "Elbasan",
  Elym: "Elymaic",
  Ethi: "Ethiopic (Geʻez)",
  Geok: "Khutsuri (Asomtavruli and Nuskhuri)",
  Geor: "Georgian (Mkhedruli and Mtavruli)",
  Glag: "Glagolitic",
  Gong: "Gunjala Gondi",
  Gonm: "Masaram Gondi",
  Goth: "Gothic",
  Gran: "Grantha",
  Grek: "Greek",
  Gujr: "Gujarati",
  Guru: "Gurmukhi",
  Hanb: "Han with Bopomofo (alias for Han + Bopomofo)",
  Hang: "Hangul (Hangŭl, Hangeul)",
  Hani: "Han (Hanzi, Kanji, Hanja)",
  Hano: "Hanunoo (Hanunóo)",
  Hans: "Han (Simplified variant)",
  Hant: "Han (Traditional variant)",
  Hatr: "Hatran",
  Hebr: "Hebrew",
  Hira: "Hiragana",
  Hluw: "Anatolian Hieroglyphs (Luwian Hieroglyphs, Hittite Hieroglyphs)",
  Hmng: "Pahawh Hmong",
  Hmnp: "Nyiakeng Puachue Hmong",
  Hrkt: "Japanese syllabaries (alias for Hiragana + Katakana)",
  Hung: "Old Hungarian (Hungarian Runic)",
  Inds: "Indus (Harappan)",
  Ital: "Old Italic (Etruscan, Oscan, etc.)",
  Jamo: "Jamo (alias for Jamo subset of Hangul)",
  Java: "Javanese",
  Jpan: "Japanese (alias for Han + Hiragana + Katakana)",
  Jurc: "Jurchen",
  Kali: "Kayah Li",
  Kana: "Katakana",
  Khar: "Kharoshthi",
  Khmr: "Khmer",
  Khoj: "Khojki",
  Kitl: "Khitan large script",
  Kits: "Khitan small script",
  Knda: "Kannada",
  Kore: "Korean (alias for Hangul + Han)",
  Kpel: "Kpelle",
  Kthi: "Kaithi",
  Lana: "Tai Tham (Lanna)",
  Laoo: "Lao",
  Latf: "Latin (Fraktur variant)",
  Latg: "Latin (Gaelic variant)",
  Latn: "Latin",
  Leke: "Leke",
  Lepc: "Lepcha (Róng)",
  Limb: "Limbu",
  Lina: "Linear A",
  Linb: "Linear B",
  Lisu: "Lisu (Fraser)",
  Loma: "Loma",
  Lyci: "Lycian",
  Lydi: "Lydian",
  Mahj: "Mahajani",
  Maka: "Makasar",
  Mand: "Mandaic, Mandaean",
  Mani: "Manichaean",
  Marc: "Marchen",
  Maya: "Mayan hieroglyphs",
  Medf: "Medefaidrin (Oberi Okaime, Oberi Ɔkaimɛ)",
  Mend: "Mende Kikakui",
  Merc: "Meroitic Cursive",
  Mero: "Meroitic Hieroglyphs",
  Mlym: "Malayalam",
  Modi: "Modi, Moḍī",
  Mong: "Mongolian",
  Moon: "Moon (Moon code, Moon script, Moon type)",
  Mroo: "Mro, Mru",
  Mtei: "Meitei Mayek (Meithei, Meetei)",
  Mult: "Multani",
  Mymr: "Myanmar (Burmese)",
  Nand: "Nandinagari",
  Narb: "Old North Arabian (Ancient North Arabian)",
  Nbat: "Nabataean",
  Newa: "Newa, Newar, Newari, Nepāla lipi",
  Nkdb: "Naxi Dongba (na²¹ɕi³³ to³³ba²¹, Nakhi Tomba)",
  Nkgb: "Naxi Geba (na²¹ɕi³³ gʌ²¹ba²¹, 'Na-'Khi ²Ggŏ-¹baw, Nakhi Geba)",
  Nkoo: "N’Ko",
  Nshu: "Nüshu",
  Ogam: "Ogham",
  Olck: "Ol Chiki (Ol Cemet’, Ol, Santali)",
  Orkh: "Old Turkic, Orkhon Runic",
  Orya: "Oriya (Odia)",
  Osge: "Osage",
  Osma: "Osmanya",
  Palm: "Palmyrene",
  Pauc: "Pau Cin Hau",
  Perm: "Old Permic",
  Phag: "Phags-pa",
  Phli: "Inscriptional Pahlavi",
  Phlp: "Psalter Pahlavi",
  Phlv: "Book Pahlavi",
  Phnx: "Phoenician",
  Plrd: "Miao (Pollard)",
  Piqd: "Klingon (KLI pIqaD)",
  Prti: "Inscriptional Parthian",
  Qaaa: "Reserved for private use (start)",
  Qabx: "Reserved for private use (end)",
  Rjng: "Rejang (Redjang, Kaganga)",
  Rohg: "Hanifi Rohingya",
  Roro: "Rongorongo",
  Runr: "Runic",
  Samr: "Samaritan",
  Sara: "Sarati",
  Sarb: "Old South Arabian",
  Saur: "Saurashtra",
  Sgnw: "SignWriting",
  Shaw: "Shavian (Shaw)",
  Shrd: "Sharada, Śāradā",
  Shui: "Shuishu",
  Sidd: "Siddham, Siddhaṃ, Siddhamātṛkā",
  Sind: "Khudawadi, Sindhi",
  Sinh: "Sinhala",
  Sogd: "Sogdian",
  Sogo: "Old Sogdian",
  Sora: "Sora Sompeng",
  Soyo: "Soyombo",
  Sund: "Sundanese",
  Sylo: "Syloti Nagri",
  Syrc: "Syriac",
  Syre: "Syriac (Estrangelo variant)",
  Syrj: "Syriac (Western variant)",
  Syrn: "Syriac (Eastern variant)",
  Tagb: "Tagbanwa",
  Takr: "Takri, Ṭākrī, Ṭāṅkrī",
  Tale: "Tai Le",
  Talu: "New Tai Lue",
  Taml: "Tamil",
  Tang: "Tangut",
  Tavt: "Tai Viet",
  Telu: "Telugu",
  Teng: "Tengwar",
  Tfng: "Tifinagh (Berber)",
  Tglg: "Tagalog (Baybayin, Alibata)",
  Thaa: "Thaana",
  Thai: "Thai",
  Tibt: "Tibetan",
  Tirh: "Tirhuta",
  Ugar: "Ugaritic",
  Vaii: "Vai",
  Visp: "Visible Speech",
  Wara: "Warang Citi (Varang Kshiti)",
  Wcho: "Wancho",
  Wole: "Woleai",
  Xpeo: "Old Persian",
  Xsux: "Cuneiform, Sumero-Akkadian",
  Yiii: "Yi",
  Zanb:
    "Zanabazar Square (Zanabazarin Dörböljin Useg, Xewtee Dörböljin Bicig, Horizontal Square Script)",
  Zinh: "Inherited script",
  Zmth: "Mathematical notation",
  Zsye: "Symbols (Emoji variant)",
  Zsym: "Symbols",
  Zxxx: "Unwritten documents",
  Zyyy: "Undetermined script",
  Zzzz: "Uncoded script"
};

const numericTypes: { [key: string]: string } = {
  None: "Not numeric",
  De: "Decimal",
  Di: "Digit",
  Nu: "Numeric"
};

const eastAsianWidths: { [key: string]: string } = {
  A: "Ambiguous",
  F: "Fullwidth",
  H: "Halfwidth",
  Na: "Narrow",
  W: "Wide",
  N: "Neutral"
};

type Props = {
  codepoint: number;
};

enum Status {
  Loading,
  Loaded,
  Error
}

type State =
  | {
      status: Status.Loading;
    }
  | {
      status: Status.Loaded;
      data: CodepointData;
    }
  | {
      status: Status.Error;
      error: string;
    };

class CodepointPage extends React.Component<Props, State> {
  state: State = {
    status: Status.Loading
  };

  render() {
    if (this.state.status === Status.Loading) {
      return (
        <div className="CodepointPage-container">
          <h1>U+{decimalToHex(this.props.codepoint, 4)}</h1>
          <p className="CodepointPage-display">
            {codepointString(this.props.codepoint)}
          </p>
          <h1>Loading...</h1>
        </div>
      );
    } else if (this.state.status === Status.Error) {
      return (
        <div className="CodepointPage-container">
          <h1>U+{decimalToHex(this.props.codepoint, 4)}</h1>
          <p className="CodepointPage-display">
            {codepointString(this.props.codepoint)}
          </p>
          <h1>{this.state.error}</h1>
        </div>
      );
    }
    const info = this.state.data;

    const parseCodepointStr = (input: string) =>
      input
        .split(" ")
        .map(codeStr => String.fromCodePoint(parseInt(codeStr, 16)))
        .join("");

    const otherNames = info.names.map(
      name => `${name.alias} (${name.aliasType})`
    );
    const props = info.props;

    const uppercased =
      props.uc === "#"
        ? "Already uppercase"
        : `${parseCodepointStr(props.uc)} (U+${props.uc})`;
    const lowercased =
      props.lc === "#"
        ? ["Already lowercase"]
        : `${parseCodepointStr(props.lc)} (U+${props.lc})`;

    const data = [
      ["Name", props.na],
      ["Other Names", `${otherNames.join(", ")}`],
      ["Block", props.blk.replace(/_/g, " ")],
      ["Appeared", `Unicode ${props.age}`],
      ["General Category", `${generalCategory[props.gc]} (${props.gc})`],
      ["Script", scriptName[props.sc]],
      ["Uppercase", `${uppercased}`],
      ["Lowercase", `${lowercased}`],
      ["Numeric Value", `${numericTypes[props.nt]}: ${props.nv}`],
      ["East-Asian Width", `${eastAsianWidths[props.ea]}`],
      ["Stroke Count", props.kTotalStrokes],
      ["Mandarin", props.kMandarin],
      ["Cantonese", props.kCantonese],
      ["Korean", props.kKorean],
      ["Japanese (On)", props.kJapaneseOn],
      ["Japanese (Kun)", props.kJapaneseKun],
      ["Definition", props.kDefinition],
      ["Comment", props.isc]
    ].filter(([, value]) => value && value.length > 0);
    const yesValues = [];
    for (const [prop, value] of Object.entries(props)) {
      if (value === "Y") {
        yesValues.push(prop);
      }
    }
    data.push(["Has Properties", yesValues.join(", ")]);

    const elements = data.map(([name, value]) => (
      <React.Fragment key={name}>
        <dt>{name}</dt>
        <dd>{value}</dd>
      </React.Fragment>
    ));

    return (
      <div className="CodepointPage-container">
        <h1>
          U+{decimalToHex(this.props.codepoint, 4)} {props.na}
        </h1>
        <p className="CodepointPage-display">
          {String.fromCodePoint(this.props.codepoint)}
        </p>
        <h3>Properties</h3>
        <dl>{elements}</dl>
      </div>
    );
  }

  async download() {
    const codepoint = this.props.codepoint;

    let error = null;

    if (codepoint < 0) {
      error = "Negative values are not valid Unicode codepoints";
    } else if (codepoint > 0x10ffff) {
      error = "Values above U+10FFFF are not valid Unicode codepoints";
    } else if (codepoint >= 0xe000 && codepoint <= 0xf8ff) {
      error =
        "Codepoint belongs to the Private Use Area (Basic Multilingual Plane)";
    } else if (codepoint >= 0xf0000 && codepoint <= 0xffffd) {
      error = "Codepoint belongs to Supplementary Private Use Area-A";
    } else if (codepoint >= 0x100000 && codepoint <= 0x10fffd) {
      error = "Codepoint belongs to Supplementary Private Use Area-B";
    } else if (
      codepoint % 0x10000 === 0xfffe ||
      codepoint % 0x10000 === 0xffff ||
      (codepoint >= 0xfdd0 && codepoint <= 0xfdef)
    ) {
      error =
        'Codepoint is "permanently reserved for internal use" according to Corrigendum #9';
    } else if (codepoint >= 0xd800 && codepoint <= 0xdbff) {
      error = "UTF-16 high surrogate value, not a valid Unicode codepoint";
    } else if (codepoint >= 0xdc00 && codepoint <= 0xdfff) {
      error = "UTF-16 low surrogate value, not a valid Unicode codepoint";
    }

    if (error) {
      this.setState({
        status: Status.Error,
        error
      });
      return;
    }

    try {
      const unicode = await fetchCompressedDatabase();
      const data = unicode.getCodepoint(codepoint);
      if (data) {
        this.setState({
          data,
          status: Status.Loaded
        });
      } else {
        this.setState({
          status: Status.Error,
          error: "No data found in Unicode Character Database"
        });
      }
    } catch (e) {
      this.setState({
        status: Status.Error,
        error: e.toString()
      });
      console.log(e);
    }
  }

  componentDidMount() {
    this.download();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.codepoint !== this.props.codepoint && this.props.codepoint) {
      this.download();
    }
  }
}

export default CodepointPage;
