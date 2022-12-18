/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { getEmoji } from "$lib/server/Unicode";
import { json, type RequestHandler } from "@sveltejs/kit";

const pageSize = 250;

export const GET = (async ({ url, params }) => {
	const { page } = params;
	const pageInt = parseInt(page);
	const allEmoji = getEmoji();
	const emoji = allEmoji.slice((pageInt - 1) * pageSize, pageInt * pageSize);

	return json({
		currentPage: pageInt,
		pageCount: Math.ceil(allEmoji.length / pageSize),
		emoji,
	});
}) satisfies RequestHandler;
