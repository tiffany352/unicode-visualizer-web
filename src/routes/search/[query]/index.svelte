<script lang="typescript" context="module">
	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

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
	import { escapeHtml } from "model/Util";

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
		color: var(--breadcrumb-text);
	}

	a {
		text-decoration: none;
		color: var(--link-text);
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
		color: var(--link-visited);
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

<OpenGraph
	title="{query} - Search - Unicode Visualizer"
	description="Search results for {query}." />

<h1>Search Results</h1>

<Searchbar bind:query />

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
			Did you mean to <a href="inspect/{createInspectLink(query)}">inspect a
				string</a> instead?
		</p>
	{/each}
</div>
