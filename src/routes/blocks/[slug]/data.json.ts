import type { Request, Response, NextFunction } from "express";
import { getBlockFromSlug, getCodepointsInBlock } from "server/UnicodeXml";

export function get(req: Request, res: Response, next: NextFunction) {
	const { slug } = req.params;
	const block = getBlockFromSlug(slug);
	if (!block) {
		return next();
	}
	const codepoints = getCodepointsInBlock(block);
	res.json({
		...block,
		...codepoints,
	});
}
