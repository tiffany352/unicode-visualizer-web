# Unicode Visualizer

A web app for inspecting unicode strings.

**https://unicode.link/**

## Features

- Paste in arbitrary strings and view their code units, code points, and grapheme clusters.
- Click on a codepoint to show information from the Unicode Character Database.

## Development

Requires Node 19 or newer.

Run `npm install` and `npm run dev` and you should be good to go!

Make sure any new files you add have the license boilerplate:

```js
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
```

### Updating Unicode data

1. Download [UCD.zip][1] and unzip it into `data/ucd/`.
2. Download [Unihan.zip][2] and unzip it into `data/han/`.
3. Download [emoji-sequences.txt & emoji-zwj-sequences.txt][3] and place them in `data/emoji/`.

[1]: https://www.unicode.org/Public/UCD/latest/ucd/UCD.zip
[2]: https://www.unicode.org/Public/UCD/latest/ucd/Unihan.zip
[3]: https://www.unicode.org/Public/emoji/

## License

Licensed under the [Mozilla Public License, version 2](./LICENSE.txt).

The files in `data/` are under the Unicode License and is copyright to
the Unicode Consortium. The full license can be found here:
<http://www.unicode.org/copyright.html>.

## Install / Deployment

[Deployment Guide](https://github.com/tiffany352/unicode-visualizer-web/wiki/Deployment-Guide)
