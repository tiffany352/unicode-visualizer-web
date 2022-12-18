<script lang="ts">
	import OpenGraph from "../../../components/OpenGraph.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<OpenGraph
	title="Unicode {data.version} - Unicode Visualizer"
	description="Codepoints added in this version categorized by block."
/>

<h1>Unicode {data.version}</h1>

<p>
	{data.summary.totalCount} new {#if data.summary.totalCount == 1}
		character was
	{:else}
		characters were
	{/if} added in Unicode {data.version}. This page categorizes them by block.
</p>

<p>
	For a list of every character added in this version, <a
		href="/versions/{data.version}/page/1"
	>
		go here</a
	>.
</p>

<div class="table">
	<div class="header">Block</div>
	<div class="header right">Count</div>

	{#each data.summary.blocks as entry}
		<a href="/versions/{data.version}/{entry.slug}">
			<div>
				{entry.name}
				{#if entry.wasAddedThisVersion}<sup>new</sup>{/if}
			</div>
			<div class="right">{entry.count}</div>
		</a>
	{/each}
</div>

<style>
	.table {
		grid-template-columns: 1fr min-content;
	}

	.right {
		text-align: right;
	}

	.table a {
		text-decoration: none;
	}

	.table a:hover,
	.table a:focus {
		text-decoration: underline;
	}
</style>
