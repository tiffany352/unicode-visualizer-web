import type { Char } from "$lib/server/Unicode";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {
	const { page } = params;
	const response: Response = await fetch(`/emoji/page/${page}.json`);
	if (response.status == 200) {
		const json = await response.json();
		const emoji: Char[] = json.emoji;
		const pageCount: number = json.pageCount;
		const currentPage: number = json.currentPage;
		return { emoji, pageCount, currentPage };
	} else {
		throw error(404, "Couldn't load list of emoji");
	}
};
