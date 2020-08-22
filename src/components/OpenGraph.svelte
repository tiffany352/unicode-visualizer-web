<script lang="typescript">
	import { stores } from "@sapper/app";
	export let title: string;
	export let type: string = "website";
	export let image: string = "/logo-512.png";
	export let description: string = "";
	export let url: string | null = null;

	const { page } = stores();

	function getUrl(page: any, path: string | null = null) {
		const url = page.host + (path || page.path);

		return `https://${url}`;
	}
</script>

<title>{title}</title>
<meta property="og:title" content={title} />
<meta property="og:type" content={type} />
<meta property="og:url" content={getUrl($page, url)} />
<meta property="og:image" content="https://{$page.host}{image}" />
<meta property="og:description" content={description} />
<meta property="og:site_name" content="Unicode Visualizer" />
