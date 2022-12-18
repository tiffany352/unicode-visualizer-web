/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { getSequences } from "$lib/server/Unicode";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
	const sequences = getSequences();
	return json({ sequences });
};
