/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {
	getBlockFromSlug,
	getCodepointsInRange,
	versionCompare,
} from "$lib/server/Unicode";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params }) => {
	const { version, block: blockSlug } = params;

	const block = getBlockFromSlug(blockSlug);
	if (!block) {
		error(404);
	}

	const codepoints = getCodepointsInRange(block.range.first, block.range.last);
	const result = [];
	let beforeThisVersion = 0;
	let afterThisVersion = 0;
	let previousVersion = null;
	let nextVersion = null;
	for (const codepoint of codepoints.codepoints) {
		if (codepoint.type == "char") {
			const diff = versionCompare(codepoint.age, version);
			if (diff == 0) {
				result.push(codepoint);
			} else if (diff < 0) {
				if (
					!previousVersion ||
					versionCompare(previousVersion, codepoint.age) < 0
				) {
					previousVersion = codepoint.age;
				}
				beforeThisVersion++;
			} else if (diff > 0) {
				if (!nextVersion || versionCompare(nextVersion, codepoint.age) > 0) {
					nextVersion = codepoint.age;
				}
				afterThisVersion++;
			}
		}
	}

	return json({
		block,
		codepoints: result,
		beforeThisVersion,
		afterThisVersion,
		previousVersion,
		nextVersion,
	});
};
