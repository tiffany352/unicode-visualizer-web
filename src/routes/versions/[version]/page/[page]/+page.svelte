<script lang="ts">
	import { getDisplayText } from "$lib/strings";
	import OpenGraph from "$lib/components/OpenGraph.svelte";
	import Paginate from "$lib/components/Paginate.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<OpenGraph
	title="Unicode {data.version} - Unicode Visualizer"
	description="View codepoints that were added in Unicode {data.version}."
/>

<h1>Unicode {data.version}</h1>

<Paginate
	current={data.page}
	pages={data.pages}
	createUrl={(page) => `/versions/${data.version}/page/${page}`}
/>

<div class="table">
	{#each data.chars as char}
		{#if char.type == "char"}
			<a href="/codepoint/{char.slug}">
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
				<code>0x{char.codepointStr}</code>
			</div>
			<div>{getDisplayText(char.reason)}</div>
		{/if}
	{/each}
</div>

<Paginate
	current={data.page}
	pages={data.pages}
	createUrl={(page) => `/versions/${data.version}/page/${page}`}
/>

<style>
	.table {
		grid-template-columns: 3em min-content 1fr;
	}

	.char {
		font-size: 1.2em;
		text-align: center;
	}
</style>
