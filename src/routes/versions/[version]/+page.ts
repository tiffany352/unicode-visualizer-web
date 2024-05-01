/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import type { BlockInfo } from "$lib/server/Unicode";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

type BlockEntry = BlockInfo & {
	count: number;
	wasAddedThisVersion: boolean;
};

interface Summary {
	blocks: BlockEntry[];
	totalCount: number;
}

export const load: PageLoad = async ({ params, fetch }) => {
	const { version } = params;
	const response: Response = await fetch(`/versions/${version}/summary.json`);
	if (response.status == 200) {
		const summary: Summary = await response.json();
		return { summary, version };
	} else {
		error(response.status, "Couldn't load version data");
	}
};
