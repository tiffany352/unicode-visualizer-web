import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {
	const { slug } = params;
	const response: Response = await fetch(`/blocks/${slug}/data.json`);
	if (response.status == 200) {
		const block = await response.json();
		return { block };
	} else {
		throw error(404, `Could not find any Unicode block named ${slug}.`);
	}
};
