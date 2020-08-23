<script lang="typescript" context="module">
	export async function preload(this: any, page: any, session: any) {
		const response: Response = await this.fetch("versions.json");
		if (response.status == 200) {
			const versions: string[] = await response.json();
			return { versions };
		} else {
			this.error(404, "Couldn't load list of versions");
		}
	}
</script>

<script lang="typescript">
	import OpenGraph from "../../components/OpenGraph.svelte";

	export let versions: string[];
</script>

<svelte:head>
	<OpenGraph
		title="Versions - Unicode Visualizer"
		description="Browse the list of Unicode releases." />
</svelte:head>

<h1>Unicode Versions</h1>

<ul>
	{#each versions as version}
		<li>
			<a href="versions/{version}/page/1">{version}</a>
		</li>
	{/each}
</ul>
