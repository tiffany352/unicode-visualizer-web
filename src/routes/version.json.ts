import type { Request, Response, NextFunction } from "express";
import { getDescription } from "server/Unicode";

export function get(req: Request, res: Response, next: NextFunction) {
	res.json({
		version: getDescription(),
	});
}
