import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
	const response: Response = await fetch("/sequences/list.json");
	if (response.status == 200) {
		return await response.json();
	} else {
		throw error(404, "Couldn't load list of sequences");
	}
};
