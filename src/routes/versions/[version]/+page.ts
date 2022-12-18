import type { BlockInfo } from "$lib/server/Unicode";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

type BlockEntry = BlockInfo & {
	count: number;
	wasAddedThisVersion: boolean;
};

interface Summary {
	blocks: BlockEntry[];
	totalCount: number;
}

export const load: PageLoad = async ({ params, fetch }) => {
	const { version } = params;
	const response: Response = await fetch(`/versions/${version}/summary.json`);
	if (response.status == 200) {
		const summary: Summary = await response.json();
		return { summary, version };
	} else {
		throw error(response.status, "Couldn't load version data");
	}
};
