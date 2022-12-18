import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
	const response: Response = await fetch("/blocks/list.json");
	if (response.status == 200) {
		const blocks = await response.json();
		return blocks;
	} else {
		throw error(404, "Couldn't load list of blocks");
	}
};
