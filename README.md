# Unicode Visualizer Web

A static web app for inspecting Unicode strings.

**https://tiffnix.com/unicode/**

## Features

- Paste in arbitrary strings and view their code units, code points, and grapheme clusters.
- Click on a codepoint to show information from the Unicode Character Database.
- Completely statically hosted web app.

## Installing

Edit the homepage value in package.json to where you intend to host it, then run `npm install` and `npm build`. It will be in the `build` directory which you can then upload to your webserver.

## Development

Run `npm install` and `npm start` and you should be good to go!

To update this tool to the latest version of Unicode, go here: <http://unicode.org/ucd/>, scroll down to the latest version of the XML database, and download `ucd.all.grouped.xml.zip`. Unzip that, then gzip it, and place it into `public`. The current version of the database is `5.2.0` which reflects Unicode `11.0.0`.

Make sure any new JS/CSS files you add have the license boilerplate:

```js
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
```

## License

Licensed under the Mozilla Public License, version 2.

The file `public/ucd.all.grouped.xml.gz` is under the Unicode License and is copyright to the Unicode Consortium. The full license can be found here: <http://www.unicode.org/copyright.html>.
