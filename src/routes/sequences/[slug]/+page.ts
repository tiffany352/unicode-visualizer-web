import type { CharMap, SequenceInfo } from "$lib/server/Unicode";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {
	const { slug } = params;

	const response: Response = await fetch(`/sequences/${slug}/info.json`, {
		headers: {
			Accept: "application/json",
		},
	});

	if (response.status == 200) {
		const json = await response.json();
		const sequence: SequenceInfo = json.sequence;
		const chars: CharMap = json.codepoints;
		const sequences: SequenceInfo[] = json.sequences;
		const extra = { chars, sequences };
		return { sequence, extra };
	} else {
		throw error(response.status, response.statusText);
	}
};