/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {
	const { slug } = params;
	const response: Response = await fetch(`/blocks/${slug}/data.json`);
	if (response.status == 200) {
		const block = await response.json();
		return { block };
	} else {
		throw error(404, `Could not find any Unicode block named ${slug}.`);
	}
};
