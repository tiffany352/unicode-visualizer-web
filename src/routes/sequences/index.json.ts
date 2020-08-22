import type { Request, Response } from "express";
import { getSequences } from "server/UnicodeXml";

export function get(req: Request, res: Response) {
	const sequences = getSequences();
	res.json(sequences);
}
