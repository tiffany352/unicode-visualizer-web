<script lang="ts">
	import OpenGraph from "../../components/OpenGraph.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<OpenGraph
	title="Versions - Unicode Visualizer"
	description="Browse the list of Unicode releases."
/>

<h1>Unicode Versions</h1>

<ul>
	{#each data.versions as version}
		<li>
			<a href="/versions/{version}">{version}</a>
		</li>
	{/each}
</ul>
