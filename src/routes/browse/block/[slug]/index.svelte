<script lang="typescript" context="module">
	import type {
		BlockInfo,
		CodepointListing,
	} from "../../../../server/UnicodeXml";

	export async function preload(this: any, page: any, session: any) {
		const { slug } = page.params;
		const response: Response = await this.fetch(
			`browse/block/${slug}/data.json`
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

<h1>{block.name}</h1>

<ul>
	{#each block.codepoints as char}
		<li>
			{#if char.type == 'char'}
				<a href="browse/codepoint/{char.slug}">
					{char.text} U+{char.codepointStr} {char.name}
				</a>
			{:else}Invalid: {char.reason}{/if}
		</li>
	{/each}
</ul>
