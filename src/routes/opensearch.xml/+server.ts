import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url }) => {
	const prefix = url.origin;
	const body = `<?xml version="1.0" encoding="UTF-8"?>
	<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/"
		xmlns:moz="http://www.mozilla.org/2006/browser/search/"
		xmlns:suggestions="http://www.opensearch.org/specifications/opensearch/extensions/suggestions/1.1">
		<ShortName>${url.hostname}</ShortName>
		<Description>Search for Unicode characters and other information</Description>
		<InputEncoding>UTF-8</InputEncoding>
		<Image width="16" height="16" type="image/x-icon">${prefix}/favicon.png</Image>
		<Url type="text/html" template="${prefix}/search?q={searchTerms}" />
		<Url type="application/x-suggestions+json" template="${prefix}/search/suggestions?q={searchTerms}"/>
		<moz:SearchForm>${prefix}/search</moz:SearchForm>
	</OpenSearchDescription>`;
	return new Response(body, {
		headers: {
			"Content-Type": "application/opensearchdescription+xml",
		},
	});
};
