<script lang="typescript" context="module">
	export async function preload(this: any, page: any, session: any) {
		const response: Response = await this.fetch("blocks.json");
		if (response.status == 200) {
			const blocks: BlockInfo[] = await response.json();
			return { blocks };
		} else {
			this.error(404, "Couldn't load list of blocks");
		}
	}

	function codepoint(value: number): string {
		return "U+" + (value || 0).toString(16).padStart(4, "0").toUpperCase();
	}
</script>

<script lang="typescript">
	import OpenGraph from "../../components/OpenGraph.svelte";
	import type { BlockInfo } from "server/Unicode";

	export let blocks: BlockInfo[];
</script>

<style>
	.table {
		grid-template-columns: 1fr min-content min-content;
	}
</style>

<svelte:head>
	<OpenGraph
		title="Blocks - Unicode Visualizer"
		description="Browse the blocks in Unicode." />
</svelte:head>

<h1>Browse Unicode Blocks</h1>

<div class="table">
	{#each blocks as block}
		<a href="blocks/{block.slug}">
			<div>{block.name}</div>
			<div>
				<code>{codepoint(block.range.first)}</code>
			</div>
			<div>
				<code>{codepoint(block.range.last)}</code>
			</div>
		</a>
	{/each}
</div>
