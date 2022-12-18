/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import type { CharMap, SequenceInfo } from "$lib/server/Unicode";
import type { PageLoad } from "./$types";

export const load = (async ({ fetch, params }) => {
	let { input } = params;

	const response: Response = await fetch(`/inspect/${input}/info.json`, {
		headers: {
			Accept: "application/json",
		},
	});

	if (response.status == 200) {
		const json = await response.json();
		const chars: CharMap = json.codepoints;
		const sequences: SequenceInfo[] = json.sequences;
		const extra = { chars, sequences };
		return { input, extra };
	}

	return { input };
}) satisfies PageLoad;
