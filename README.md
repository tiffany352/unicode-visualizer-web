# Unicode Visualizer

A web app for inspecting unicode strings.

**https://unicode.link/**

## Features

- Paste in arbitrary strings and view their code units, code points, and grapheme clusters.
- Click on a codepoint to show information from the Unicode Character Database.

## Development

Run `npm install` and `npm run dev` and you should be good to go!

To update to the latest Unicode Character Database version, download the
.zip from [here][1] and unpack it into the `data/` directory. Then
download emoji-sequences.txt and emoji-zwj-sequences.txt from [here][2]
and put them in `data/emoji/`.

[1]: https://www.unicode.org/Public/UCD/latest/ucd/UCD.zip
[2]: https://www.unicode.org/Public/emoji/

Make sure any new files you add have the license boilerplate:

```js
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
```

## License

Licensed under the [Mozilla Public License, version 2](./LICENSE.txt).

The files in `data/` are under the Unicode License and is copyright to
the Unicode Consortium. The full license can be found here:
<http://www.unicode.org/copyright.html>.

## Deploying

- Run `npm run build build` to place the built JS into `build/`.
- Make a directory called `deps`, cd into it, copy the `package.json`
  and `package.lock` there. Run `npm install --production` to get
  `node_modules` without any dev dependencies.
- Copy `build/`, `node_modules/` (the one in `deps/`), `static/` and
  `data/` to your webserver.
- Run `node build/` to start the server. It respects these environment
  variables:
  ```ini
  PORT=3000 # The port to run on
  NODE_ENV=production # You want this to be production
  ```
- You'll probably want to create a systemd unit file to keep the server
  running. You can use something like this:

  ```ini
  [Unit]
  Description=Unicode Visualizer

  [Service]
  User=unicode # The user you want to run as.
  Group=unicode
  Environment=PORT=3000 # You'll probably want to pick a new one.
  Environment=NODE_ENV=production
  ExecStart=/usr/bin/node /srv/unicode/build # Location of the files.
  WorkingDirectory=/srv/unicode/
  Restart=on-failure
  RestartSec = 5

  [Install]
  WantedBy=multi-user.target
  ```

- If you're running behind nginx, your config will look something like
  this.
  ```nginx
  location / {
    root /srv/unicode/static;
    proxy_pass http://127.0.0.1:3000;
  }
  location /client {
    root /srv/unicode/build/client;
    proxy_pass http://127.0.0.1:3000;
  }
  ```
