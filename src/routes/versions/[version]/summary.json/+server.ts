/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {
	getBlockFromSlug,
	getCodepointsInRange,
	getCodepointsInVersion,
	versionCompare,
} from "$lib/server/Unicode";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params }) => {
	const { version } = params;
	const codepoints = getCodepointsInVersion(version);

	if (codepoints.length == 0) {
		error(404, `No such version ${version}`);
	}

	const blocks = new Map<string, number>();
	for (const codepoint of codepoints) {
		if (codepoint.type == "char") {
			const block = codepoint.block.slug;
			blocks.set(block, (blocks.get(block) || 0) + 1);
		}
	}

	const table = [];
	for (const [slug, count] of blocks) {
		const block = getBlockFromSlug(slug);
		if (block) {
			const codepoints = getCodepointsInRange(
				block.range.first,
				block.range.last
			);
			let wasAddedThisVersion = true;
			for (const codepoint of codepoints.codepoints) {
				if (
					codepoint.type == "char" &&
					versionCompare(codepoint.age, version) < 0
				) {
					wasAddedThisVersion = false;
					break;
				}
			}
			table.push({
				...block,
				count,
				wasAddedThisVersion,
			});
		}
	}

	table.sort((a, b) => (a.count < b.count ? 1 : a.count > b.count ? -1 : 0));

	return json({
		blocks: table,
		totalCount: codepoints.length,
	});
};
