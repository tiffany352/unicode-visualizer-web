import type { Request, Response } from "express";
import { getVersions } from "server/Unicode";

export function get(req: Request, res: Response) {
	const versions = getVersions();
	res.json(versions);
}
