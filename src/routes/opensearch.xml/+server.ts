import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url }) => {
	const prefix = url.origin;
	const body = `<?xml version="1.0" encoding="UTF-8"?>
	<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/"
		xmlns:moz="http://www.mozilla.org/2006/browser/search/">
		<ShortName>${url.hostname}</ShortName>
		<Description>Search for Unicode characters and other information</Description>
		<InputEncoding>UTF-8</InputEncoding>
		<Image width="16" height="16" type="image/x-icon">${prefix}/favicon.png</Image>
		<Url type="text/html" template="${prefix}/search?q={searchTerms}" />
		<moz:SearchForm>${prefix}/search</moz:SearchForm>
	</OpenSearchDescription>`;
	return new Response(body, {
		headers: {
			"Content-Type": "application/opensearchdescription+xml",
		},
	});
};
