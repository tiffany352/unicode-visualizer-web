/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
	const response: Response = await fetch("/versions/list.json");
	if (response.status == 200) {
		const versions: string[] = await response.json();
		return { versions };
	} else {
		error(404, "Couldn't load list of versions");
	}
};
