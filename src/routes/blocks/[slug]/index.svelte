<script lang="typescript" context="module">
	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

	export async function preload(this: any, page: any, session: any) {
		const { slug } = page.params;
		const response: Response = await this.fetch(`blocks/${slug}/data.json`);
		if (response.status == 200) {
			const block: BlockInfo & CodepointListing = await response.json();
			return { block };
		} else {
			this.error(404, `Could not find any Unicode block named ${slug}.`);
		}
	}
</script>

<script lang="typescript">
	import type { BlockInfo, CodepointListing } from "server/Unicode";
	import { getDisplayText } from "strings";
	import OpenGraph from "../../../components/OpenGraph.svelte";

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

	a {
		text-decoration: none;
	}

	a:hover,
	a:focus {
		text-decoration: underline;
	}
</style>

<OpenGraph
	title="{block.name} - Blocks - Unicode Visualizer"
	description="View codepoints in the {block.name} Unicode block." />

<h1>{block.name}</h1>

<div class="table">
	{#each block.codepoints as char}
		{#if char.type == 'char'}
			<a href="codepoint/{char.slug}">
				<div class="char"><span>{char.text}</span></div>
				<div><code>U+{char.codepointStr}</code></div>
				<div><span>{char.name}</span></div>
			</a>
		{:else}
			<a href="codepoint/{char.slug}">
				<div>N/A</div>
				<div><code>0x{char.codepointStr}</code></div>
				<div>{getDisplayText(char.reason)}</div>
			</a>
		{/if}
	{/each}
</div>
