/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import type { Char } from "$lib/server/Unicode";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {
	const { page } = params;
	const response: Response = await fetch(`/emoji/page/${page}.json`);
	if (response.status == 200) {
		const json = await response.json();
		const emoji: Char[] = json.emoji;
		const pageCount: number = json.pageCount;
		const currentPage: number = json.currentPage;
		return { emoji, pageCount, currentPage };
	} else {
		throw error(404, "Couldn't load list of emoji");
	}
};
