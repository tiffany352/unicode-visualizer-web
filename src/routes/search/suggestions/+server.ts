import { search } from "$lib/server/Search";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url }) => {
	const query = url.searchParams.get("q");

	const results = await search(query, 10);

	const suggestions = [];
	const descriptions = [];
	const urls = [];

	for (const page of results) {
		suggestions.push(page.title);
		descriptions.push(page.description);
		urls.push(page.url);
	}

	return json([query, suggestions, descriptions, urls], {
		headers: { "Content-Type": "application/x-suggestions+json" },
	});
};
