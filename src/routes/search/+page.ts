import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ url }) => {
	let query = url.searchParams.get("q");
	if (query != "") {
		throw redirect(302, `/search/${encodeURI(query)}`);
	}
	return {};
};
