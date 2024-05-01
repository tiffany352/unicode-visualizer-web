/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import type { CharInfo } from "$lib/server/Unicode";
import { error, redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {
	const { id, slug } = params;
	const response: Response = await fetch(`/codepoint/${id}.json`);
	if (response.status == 200) {
		const char: CharInfo = await response.json();
		if (char.slug != `${id}-${slug}`) {
			redirect(301, `/codepoint/${char.slug}`);
		}
		return char;
	} else {
		error(404, `Could not find Unicode codepoint U+${id.toUpperCase()}.`);
	}
};
