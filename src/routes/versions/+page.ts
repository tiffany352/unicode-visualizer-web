import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
	const response: Response = await fetch("/versions/list.json");
	if (response.status == 200) {
		const versions: string[] = await response.json();
		return { versions };
	} else {
		throw error(404, "Couldn't load list of versions");
	}
};
