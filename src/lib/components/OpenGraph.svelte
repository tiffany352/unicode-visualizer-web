<!-- This Source Code Form is subject to the terms of the Mozilla Public
 !-- License, v. 2.0. If a copy of the MPL was not distributed with this
 !-- file, You can obtain one at http://mozilla.org/MPL/2.0/. -->
<script lang="ts">
	import { page } from "$app/stores";

	export let title: string;
	export let type: string = "website";
	export let image: string = "/logo-512.png";
	export let description: string = "";
	export let url: string | null = null;

	function getUrl(page: any, path: string | null = null) {
		const url = page.host + (path || page.path);

		return `https://${url}`;
	}
</script>

<svelte:head>
	<title>{title}</title>
	<meta property="og:title" content={title} />
	<meta property="og:type" content={type} />
	<meta property="og:url" content={getUrl($page, url)} />
	<meta property="og:image" content="https://{$page.url.host}{image}" />
	<meta property="og:description" content={description} />
	<meta property="og:site_name" content="Unicode Visualizer" />
	<meta name="twitter:card" content="summary" />
</svelte:head>
