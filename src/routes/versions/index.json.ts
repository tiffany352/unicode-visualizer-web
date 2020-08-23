import type { Request, Response } from "express";
import { getVersions } from "server/UnicodeXml";

export function get(req: Request, res: Response) {
	const versions = getVersions();
	res.json(versions);
}
