<script lang="ts">
	import OpenGraph from "../../components/OpenGraph.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<OpenGraph
	title="Sequences - Unicode Visualizer"
	description="Browse the named sequences in Unicode."
/>

<h1>Browse Unicode Named Sequences</h1>

<div class="table">
	{#each data.sequences as sequence}
		<a href="/sequences/{sequence.slug}">
			<div>{sequence.name}</div>
			<div>
				<code>{sequence.text}</code>
			</div>
		</a>
	{/each}
</div>

<style>
	.table {
		grid-template-columns: 1fr min-content;
	}
</style>
