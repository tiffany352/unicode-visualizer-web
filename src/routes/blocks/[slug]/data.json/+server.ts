/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {
	codepointToString,
	getBlockFromSlug,
	getCodepointsInRange,
	versionCompare,
} from "$lib/server/Unicode";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const GET = (async ({ params }) => {
	const { slug } = params;
	const block = getBlockFromSlug(slug);
	if (!block) {
		error(404);
	}
	const codepoints = getCodepointsInRange(block.range.first, block.range.last);
	const assignedCount = codepoints.codepoints.reduce(
		(acc, value) => (value.type == "char" ? acc + 1 : acc),
		0
	);
	const reservedCount = codepoints.codepoints.reduce(
		(acc, value) => (value.type == "invalid" ? acc + 1 : acc),
		0
	);
	const totalCount = block.range.last - block.range.first + 1;
	const firstCodepointStr = codepointToString(block.range.first);
	const lastCodepointStr = codepointToString(block.range.last);

	const newestVersion = codepoints.codepoints.reduce(
		(acc, value) =>
			value.type == "char" && versionCompare(acc, value.age) < 0
				? value.age
				: acc,
		"1.1"
	);

	const first = codepoints.codepoints[0];
	let allAreEquallyInvalid: false | string = false;
	// This logic prevents the private use area blocks from rendering
	// tables with tens of thousands of entries.
	if (first && first.type == "invalid" && reservedCount == totalCount) {
		allAreEquallyInvalid = first.reason;
		for (let i = 1; i < codepoints.codepoints.length; i++) {
			if (
				codepoints.codepoints[0].type != "invalid" ||
				codepoints.codepoints[0].reason != first.reason
			) {
				allAreEquallyInvalid = false;
				break;
			}
		}
	}

	return json({
		...block,
		...codepoints,
		reservedCount,
		assignedCount,
		totalCount,
		firstCodepointStr,
		lastCodepointStr,
		allAreEquallyInvalid,
		newestVersion,
	});
}) satisfies RequestHandler;
