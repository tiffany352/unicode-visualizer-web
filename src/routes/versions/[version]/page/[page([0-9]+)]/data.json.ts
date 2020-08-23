import type { Request, Response, NextFunction } from "express";
import { getCodepointsInVersion } from "server/UnicodeXml";

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
