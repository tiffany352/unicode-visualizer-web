/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { getCodepointsInVersion } from "$lib/server/Unicode";
import { error, json, type RequestHandler } from "@sveltejs/kit";

const pageSize = 250;

export const GET: RequestHandler = async ({ params }) => {
	const { version, page } = params;
	const pageInt = parseInt(page);
	const allChars = getCodepointsInVersion(version);
	if (!allChars) {
		throw error(404);
	}
	const pages = Math.max(1, Math.ceil(allChars.length / pageSize));
	const chars = allChars.slice((pageInt - 1) * pageSize, pageInt * pageSize);
	return json({
		page: pageInt,
		pages,
		pageSize,
		chars,
	});
};
