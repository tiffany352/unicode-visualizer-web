/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import en_us from "./en_us.json";

const Strings = {
	en_us,
};
export default Strings;

export function getDisplayText(key: string): string {
	let current = en_us as any;
	for (const part of key.split(".")) {
		current = current && current[part];
	}

	return current !== undefined ? current : key;
}
