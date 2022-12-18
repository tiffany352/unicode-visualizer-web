/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { lookupChar } from "$lib/server/Unicode";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const GET = (async ({ url, params }) => {
	const { id } = params;
	const char = lookupChar(parseInt(id, 16));
	if (!char) {
		throw error(404);
	}

	return json(char);
}) satisfies RequestHandler;
