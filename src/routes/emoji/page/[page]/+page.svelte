<script lang="ts">
	import OpenGraph from "$lib/components/OpenGraph.svelte";
	import Paginate from "$lib/components/Paginate.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;

	function codepoint(value: number): string {
		return "U+" + (value || 0).toString(16).padStart(4, "0").toUpperCase();
	}
</script>

<OpenGraph
	title="Sequences - Unicode Visualizer"
	description="Browse the named sequences in Unicode."
/>

<h1>Browse Emoji</h1>

<Paginate
	pages={data.pageCount}
	current={data.currentPage}
	createUrl={(page) => `/emoji/page/${page}`}
/>

<div class="table">
	{#each data.emoji as char}
		<a href="/codepoint/{char.slug}">
			<div>{char.text}</div>
			<div>
				<code>U+{char.codepointStr}</code>
				{char.name}
			</div>
		</a>
	{/each}
</div>

<Paginate
	pages={data.pageCount}
	current={data.currentPage}
	createUrl={(page) => `/emoji/page/${page}`}
/>

<style>
	.table {
		grid-template-columns: min-content 1fr;
	}
</style>
