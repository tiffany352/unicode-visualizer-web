<script lang="typescript" context="module">
	import type { BlockInfo } from "../../server/UnicodeXml";

	export async function preload(this: any, page: any, session: any) {
		const response: Response = await this.fetch("browse/blocks.json");
		const blocks: BlockInfo[] = await response.json();
		return { blocks };
	}

	function codepoint(value: number): string {
		return (value || 0).toString(16).padStart(4, "0").toUpperCase();
	}
</script>

<script lang="typescript">
	export let blocks: Block[];
</script>

<h1>Browse Unicode Blocks</h1>

<ul>
	{#each blocks as block}
		<li>
			<a href="browse/block/{block.slug}">
				{block.name} ({codepoint(block.first)}..{codepoint(block.last)})
			</a>
		</li>
	{/each}
</ul>
