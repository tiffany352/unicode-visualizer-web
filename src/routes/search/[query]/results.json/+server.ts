/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { search } from "$lib/server/Search";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET = (async ({ url, params }) => {
	const { query } = params;
	const start = new Date().getTime();
	const results = await search(query);
	const stop = new Date().getTime();
	const requestTime = stop - start;
	return json({ results, requestTime });
}) satisfies RequestHandler;
