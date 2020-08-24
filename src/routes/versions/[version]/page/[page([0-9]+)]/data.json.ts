/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import type { Request, Response, NextFunction } from "express";
import { getCodepointsInVersion } from "server/Unicode";

const pageSize = 250;

export function get(req: Request, res: Response, next: NextFunction) {
	const { version, page } = req.params;
	const pageInt = parseInt(page);
	const allChars = getCodepointsInVersion(version);
	if (!allChars) {
		return next();
	}
	const pages = Math.max(1, Math.ceil(allChars.length / pageSize));
	const chars = allChars.slice((pageInt - 1) * pageSize, pageInt * pageSize);
	res.json({
		page: pageInt,
		pages,
		pageSize,
		chars,
	});
}
