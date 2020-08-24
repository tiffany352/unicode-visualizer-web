/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import type { Request, Response } from "express";
import { getBlocks } from "server/Unicode";

export function get(req: Request, res: Response) {
	const blocks = getBlocks();
	res.json(blocks);
}
