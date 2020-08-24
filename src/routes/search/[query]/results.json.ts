/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import type { Request, Response, NextFunction } from "express";
import { search } from "server/Search";

export async function get(req: Request, res: Response, next: NextFunction) {
	const { query } = req.params;
	const start = new Date().getTime();
	const results = await search(query);
	const stop = new Date().getTime();
	const requestTime = stop - start;
	res.json({ results, requestTime });
}
