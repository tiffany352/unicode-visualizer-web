import type { Request, Response } from "express";
import { getBlocks } from "server/Unicode";

export function get(req: Request, res: Response) {
	const blocks = getBlocks();
	res.json(blocks);
}
