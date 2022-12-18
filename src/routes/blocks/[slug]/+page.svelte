<script lang="ts">
	import { getDisplayText } from "$lib/strings";
	import OpenGraph from "../../../components/OpenGraph.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<OpenGraph
	title="{data.block.name} - Blocks - Unicode Visualizer"
	description="View codepoints in the {data.block.name} Unicode data.block."
/>

<h1>{data.block.name}</h1>

<p>
	The <strong>{data.block.name}</strong> block spans
	<code>U+{data.block.firstCodepointStr}</code>
	to
	<code>U+{data.block.lastCodepointStr}</code>. Of the {data.block.totalCount} codepoints
	in this block, {data.block.assignedCount}
	have been assigned, and {data.block.reservedCount}
	are reserved.
</p>

<p>
	This block was most recently added to in <a
		href="/versions/{data.block.newestVersion}/{data.block.slug}"
		>Unicode {data.block.newestVersion}</a
	>.
</p>

{#if data.block.allAreEquallyInvalid}
	<div class="table">
		<div>N/A</div>
		<div>All</div>
		<div>{getDisplayText(data.block.allAreEquallyInvalid)}</div>
	</div>
{:else}
	<div class="table">
		{#each data.block.codepoints as char}
			{#if char.type == "char"}
				<a href="/codepoint/{char.slug}">
					<div class="char"><span>{char.text}</span></div>
					<div><code>U+{char.codepointStr}</code></div>
					<div><span>{char.name}</span></div>
				</a>
			{:else}
				<a href="/codepoint/{char.slug}">
					<div>N/A</div>
					<div><code>0x{char.codepointStr}</code></div>
					<div>{getDisplayText(char.reason)}</div>
				</a>
			{/if}
		{/each}
	</div>
{/if}

<style>
	.table {
		grid-template-columns: 3em min-content 1fr;
	}

	.char {
		font-size: 1.2em;
		text-align: center;
	}

	.table a {
		text-decoration: none;
	}

	.table a:hover,
	.table a:focus {
		text-decoration: underline;
	}
</style>
