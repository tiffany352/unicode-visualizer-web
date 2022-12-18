/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { error } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ fetch }) => {
	const response: Response = await fetch(`/version.json`);
	if (response.status == 200) {
		const json = await response.json();
		const version = json.version;
		return { version };
	} else {
		throw error(500, "Unable to fetch version string");
	}
};
