import { Request, Response, NextFunction } from "express";
import { getDescription } from "../server/UnicodeXml";

export function get(req: Request, res: Response, next: NextFunction) {
	res.json({
		version: getDescription(),
	});
}
