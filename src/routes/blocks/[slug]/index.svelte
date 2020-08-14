<script lang="typescript" context="module">
	import type {
		BlockInfo,
		CodepointListing,
	} from "../../../server/UnicodeXml";
	import { getDisplayText } from "../../../strings/index.ts";

	export async function preload(this: any, page: any, session: any) {
		const { slug } = page.params;
		const response: Response = await this.fetch(
			`blocks/${slug}/data.json`
		);
		if (response.status == 200) {
			const block: BlockInfo & CodepointListing = await response.json();
			return { block };
		} else {
			this.error(404, `Could not find any Unicode block named ${slug}.`);
		}
	}
</script>

<script lang="typescript">
	export let block: BlockInfo & CodepointListing;
</script>

<style>
	.table {
		grid-template-columns: 3em min-content 1fr;
	}

	.char {
		font-size: 1.2em;
		text-align: center;
	}
</style>

<h1>{block.name}</h1>

<div class="table">
	{#each block.codepoints as char}
		{#if char.type == 'char'}
			<a href="browse/codepoint/{char.slug}">
				<div class="char">
					<span>{char.text}</span>
				</div>
				<div>
					<code>U+{char.codepointStr}</code>
				</div>
				<div>
					<span>{char.name}</span>
				</div>
			</a>
		{:else}
			<div>N/A</div>
			<div>
				<code>0x{char.codepoint}</code>
			</div>
			<div>{getDisplayText(char.reason)}</div>
		{/if}
	{/each}
</div>
