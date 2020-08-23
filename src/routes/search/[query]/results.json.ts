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
