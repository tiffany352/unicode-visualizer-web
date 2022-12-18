<script lang="ts">
	import { getDisplayText } from "$lib/strings";
	import OpenGraph from "$lib/components/OpenGraph.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<OpenGraph
	title="Unicode {data.version} - New Chars in {data.block
		.name} - Unicode Visualizer"
	description="Codepoints added in this version categorized by block."
/>

<h1>Unicode {data.version} - {data.block.name}</h1>

{#if data.previousVersion}
	<a href="/versions/{data.previousVersion}/{data.block.slug}">
		« Unicode {data.previousVersion}
	</a>
{:else}
	« (no older)
{/if}

•

{#if data.nextVersion}
	<a href="/versions/{data.nextVersion}/{data.block.slug}">
		Unicode {data.nextVersion} »
	</a>
{:else}
	(no newer) »
{/if}

<p>
	{data.codepoints.length} new
	{#if data.codepoints.length == 1}
		character was
	{:else}
		characters were
	{/if} added to the
	<a href="/blocks/{data.block.slug}">{data.block.name}</a>
	block in Unicode {data.version}.
</p>

<p>
	{#if data.beforeThisVersion == 0}
		This is the first version this block was present in.
	{:else}
		{data.beforeThisVersion} codepoints were added before this version.
	{/if}
	{#if data.afterThisVersion == 0}
		This is the most recent version that added codepoints to this block.
	{:else}
		{data.afterThisVersion}
		codepoints have been added after this version.
	{/if}
</p>

<div class="table">
	{#each data.codepoints as char}
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
