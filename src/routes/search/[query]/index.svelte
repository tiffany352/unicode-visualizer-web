<script lang="typescript" context="module">
	export async function preload(this: any, page: any, session: any) {
		const { query } = page.params;
		const response: Response = await this.fetch(
			`search/${encodeURIComponent(query)}/results.json`
		);

		if (response.status == 200) {
			const json = await response.json();
			const results = json.results;
			const requestTime = json.requestTime;
			return { results, requestTime, query };
		} else {
			this.error(response.status, response.statusText);
		}
	}
</script>

<script lang="typescript">
	import type { Page } from "server/Search";
	import Searchbar from "../../../components/Searchbar.svelte";
	import OpenGraph from "../../../components/OpenGraph.svelte";
	import StringBlob, { Encoding } from "model/StringBlob";

	export let results: Page[];
	export let requestTime: number;
	export let query: string;

	interface Breadcrumb {
		text: string;
		url: string | null;
	}

	function breadcrumbs(url: string): Breadcrumb[] {
		url = url.replace(/\/page\/[0-9]+/, "");
		const list: Breadcrumb[] = url
			.split("/")
			.map((text) => ({ text, url: null }));
		switch (list[0].text) {
			case "codepoint":
				break;
			default:
				list[0].url = list[0].text;
				break;
		}
		return list;
	}

	function escapeHtml(text: string): string {
		return text
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}

	function highlight(text: string): string {
		text = escapeHtml(text);
		for (const word of query.match(/(\w+)/g) || []) {
			text = text.replace(new RegExp(word, "gi"), "<strong>$&</strong>");
		}
		return text;
	}

	function createInspectLink(query: string): string {
		return StringBlob.stringDecode(Encoding.Utf8, query).urlEncode();
	}
</script>

<style>
	.result {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		margin: 1em 0;
	}

	.breadcrumbs {
		color: rgb(99, 16, 16);
	}

	a {
		text-decoration: none;
		color: rgb(32, 100, 163);
	}

	a:hover,
	a:focus {
		text-decoration: underline;
	}

	.link {
		font-family: var(--header-font);
		font-size: 1.2em;
		text-decoration: none;
	}

	.link:visited {
		color: rgb(51, 7, 77);
	}

	.link :global(strong) {
		font-weight: 600;
	}

	p {
		margin: 0.25em 0;
	}

	.extra-links {
		font-size: 90%;
	}
</style>

<svelte:head>
	<OpenGraph
		title="{query} - Search - Unicode Visualizer"
		description="Search results for {query}." />
</svelte:head>

<h1>Search Results</h1>

<Searchbar {query} />

<p>Found {results.length} results in {requestTime}ms.</p>

<div class="results">
	{#each results as result}
		<div class="result">
			<span class="breadcrumbs">
				{#each breadcrumbs(result.url) as breadcrumb, i}
					{#if i > 0}&nbsp;›{/if}
					{#if breadcrumb.url}
						<a href={breadcrumb.url}>{breadcrumb.text}</a>
					{:else}{breadcrumb.text}{/if}
				{/each}
			</span>
			<a class="link" href={result.url}>
				{@html highlight(result.title)}
			</a>
			<p>
				{@html highlight(result.description)}
			</p>
			{#if result.links && result.links.length > 0}
				<span class="extra-links">
					{#each result.links as { url, text }, i}
						{#if i > 0}&nbsp;•{/if}
						<a href={url}>{text}</a>
					{/each}
				</span>
			{/if}
		</div>
	{:else}
		<p>
			Did you mean to
			<a href="inspect/{createInspectLink(query)}">inspect a string</a>
			instead?
		</p>
	{/each}
</div>
