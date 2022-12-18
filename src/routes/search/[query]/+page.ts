import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {
	const { query } = params;
	const response: Response = await fetch(
		`/search/${encodeURIComponent(query)}/results.json`
	);

	if (response.status == 200) {
		const json = await response.json();
		const results = json.results;
		const requestTime = json.requestTime;
		return { results, requestTime, query };
	} else {
		throw error(response.status, response.statusText);
	}
};
