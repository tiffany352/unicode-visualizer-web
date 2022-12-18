/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import type { Page } from "$lib/server/Search";
import { error, redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {
	const { query } = params;
	const response: Response = await fetch(
		`/search/${encodeURIComponent(query)}/results.json`
	);

	if (response.status == 200) {
		const json = await response.json();
		const results: Page[] = json.results;
		const requestTime: number = json.requestTime;
		for (const page of results) {
			if (page.title == query) {
				// If there's a perfect match, then redirect straight there. The
				// page titles are never something you'd type by accident.
				throw redirect(302, page.url);
			}
		}
		return { results, requestTime, query };
	} else {
		throw error(response.status, response.statusText);
	}
};
