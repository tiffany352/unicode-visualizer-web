<script lang="typescript" context="module">
	import type { BlockInfo } from "../../server/UnicodeXml";

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
	export let blocks: BlockInfo[];
</script>

<style>
	.table {
		grid-template-columns: 1fr min-content min-content;
	}
</style>

<h1>Browse Unicode Blocks</h1>

<div class="table">
	{#each blocks as block}
		<a href="blocks/{block.slug}">
			<div>{block.name}</div>
			<div>
				<code>{codepoint(block.first)}</code>
			</div>
			<div>
				<code>{codepoint(block.last)}</code>
			</div>
		</a>
	{/each}
</div>
