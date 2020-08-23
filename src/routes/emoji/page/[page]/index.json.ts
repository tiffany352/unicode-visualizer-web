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
