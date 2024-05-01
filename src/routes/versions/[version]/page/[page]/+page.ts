/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import type { CharInfo } from "$lib/server/Unicode";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {
	const { version, page } = params;
	const response: Response = await fetch(
		`/versions/${version}/page/${page}/data.json`
	);
	if (response.status == 200) {
		const json = await response.json();
		const chars: CharInfo[] = json.chars;
		const pages: number = json.pages;
		const pageInt: number = parseInt(page);
		return { version, chars, page: pageInt, pages };
	} else {
		error(404, `Could not find any Unicode version named ${version}.`);
	}
};
