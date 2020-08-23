<script lang="typescript" context="module">
	export async function preload(this: any, pageObj: any, session: any) {
		const { version, page } = pageObj.params;
		const response: Response = await this.fetch(
			`versions/${version}/page/${page}/data.json`
		);
		if (response.status == 200) {
			const json = await response.json();
			const chars: CharInfo[] = json.chars;
			const pages: number = json.pages;
			const pageInt: number = parseInt(page);
			return { version, chars, page: pageInt, pages };
		} else {
			this.error(404, `Could not find any Unicode version named ${version}.`);
		}
	}
</script>

<script lang="typescript">
	import type { CharInfo } from "server/Unicode";
	import { getDisplayText } from "strings";
	import OpenGraph from "../../../../../components/OpenGraph.svelte";
	import Paginate from "../../../../../components/Paginate.svelte";

	export let version: string;
	export let chars: CharInfo[];
	export let page: number;
	export let pages: number;
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

<svelte:head>
	<OpenGraph
		title="Unicode {version} - Unicode Visualizer"
		description="View codepoints that were added in Unicode {version}." />
</svelte:head>

<h1>Unicode {version}</h1>

<Paginate
	current={page}
	{pages}
	createUrl={(page) => `versions/${version}/page/${page}`} />

<div class="table">
	{#each chars as char}
		{#if char.type == 'char'}
			<a href="codepoint/{char.slug}">
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
	current={page}
	{pages}
	createUrl={(page) => `versions/${version}/page/${page}`} />
