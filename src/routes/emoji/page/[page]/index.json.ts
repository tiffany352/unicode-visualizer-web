/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import type { Request, Response } from "express";
import { getEmoji } from "server/Unicode";

const pageSize = 250;

export function get(req: Request, res: Response) {
	const { page } = req.params;
	const pageInt = parseInt(page);
	const allEmoji = getEmoji();
	const emoji = allEmoji.slice((pageInt - 1) * pageSize, pageInt * pageSize);
	res.json({
		currentPage: pageInt,
		pageCount: Math.ceil(allEmoji.length / pageSize),
		emoji,
	});
}
