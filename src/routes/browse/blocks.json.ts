import { Request, Response } from "express";
import { getBlocks } from "../../server/UnicodeXml";

export function get(req: Request, res: Response) {
	const blocks = getBlocks();
	res.json(blocks);
}
