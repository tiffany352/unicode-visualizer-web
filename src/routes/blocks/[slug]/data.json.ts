import type { Request, Response, NextFunction } from "express";
import { getBlockFromSlug, getCodepointsInRange } from "server/Unicode";

export function get(req: Request, res: Response, next: NextFunction) {
	const { slug } = req.params;
	const block = getBlockFromSlug(slug);
	if (!block) {
		return next();
	}
	const codepoints = getCodepointsInRange(block.range.first, block.range.last);
	res.json({
		...block,
		...codepoints,
	});
}
