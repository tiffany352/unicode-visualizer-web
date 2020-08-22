import type { Request, Response, NextFunction } from "express";
import { lookupChar } from "../../../server/UnicodeXml";

export function get(req: Request, res: Response, next: NextFunction) {
	const { id, slug } = req.params;
	const char = lookupChar(parseInt(id, 16));
	if (!char) {
		return next();
	}
	res.json(char);
}
