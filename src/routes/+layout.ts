import { error } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ fetch }) => {
	const response: Response = await fetch(`/version.json`);
	if (response.status == 200) {
		const json = await response.json();
		const version = json.version;
		return { version };
	} else {
		throw error(500, "Unable to fetch version string");
	}
};
