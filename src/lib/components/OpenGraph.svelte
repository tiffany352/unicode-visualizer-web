<!-- This Source Code Form is subject to the terms of the Mozilla Public
 !-- License, v. 2.0. If a copy of the MPL was not distributed with this
 !-- file, You can obtain one at http://mozilla.org/MPL/2.0/. -->
<script lang="ts">
	import { page } from "$app/stores";
	import type { Page } from "@sveltejs/kit";

	export let title: string;
	export let suffix: string = " - Unicode Visualizer";
	export let type: string = "website";
	export let description: string = "";
	export let url: string | null = null;
	export let previewText: string = "";

	function getUrl(page: Page, path: string | null = null) {
		return page.url.origin + (path || page.url.pathname);
	}

	const imageParams = new URLSearchParams({
		title,
		summary: description,
		previewText,
	});
	$: origin = $page.url.origin;
	$: imageUrl = `${origin}/opengraph-image.png?${imageParams.toString()}`;
</script>

<svelte:head>
	<title>{title}{suffix}</title>
	<meta property="og:title" content="{title}{suffix}" />
	<meta property="twitter:title" content="{title}{suffix}" />
	<meta property="og:type" content={type} />
	<meta property="og:url" content={getUrl($page, url)} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:description" content={description} />
	<meta property="twitter:description" content={description} />
	<meta property="og:site_name" content="Unicode Visualizer" />
	<meta name="twitter:card" content="summary" />
</svelte:head>
