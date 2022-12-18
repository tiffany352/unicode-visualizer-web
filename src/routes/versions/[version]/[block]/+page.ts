/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import type { BlockInfo, CharInfo } from "$lib/server/Unicode";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

interface VersionPageData {
	block: BlockInfo;
	codepoints: CharInfo[];
	beforeThisVersion: number;
	afterThisVersion: number;
	previousVersion: string;
	nextVersion: string;
}

export const load: PageLoad = async ({ params, fetch }) => {
	const { version, block } = params;
	const response: Response = await fetch(
		`/versions/${version}/${block}/data.json`
	);
	if (response.status == 200) {
		const data: VersionPageData = await response.json();
		return { ...data, version };
	} else {
		throw error(response.status, "Couldn't load data");
	}
};
