/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {
	const { query } = params;
	const response: Response = await fetch(
		`/search/${encodeURIComponent(query)}/results.json`
	);

	if (response.status == 200) {
		const json = await response.json();
		const results = json.results;
		const requestTime = json.requestTime;
		return { results, requestTime, query };
	} else {
		throw error(response.status, response.statusText);
	}
};
