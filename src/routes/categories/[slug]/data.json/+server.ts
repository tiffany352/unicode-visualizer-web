/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {
	getCategories,
	getCodepointsInCategory,
} from "$lib/server/Unicode";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const GET = (async ({ params }) => {
	const { slug } = params;

	const categories = getCategories();
	const category = categories.find((cat) => cat.slug == slug);
	if (!category) {
		error(404);
	}

	const codepoints = getCodepointsInCategory(category.abbr);

	return json({
		...category,
		codepoints,
	});
}) satisfies RequestHandler;
