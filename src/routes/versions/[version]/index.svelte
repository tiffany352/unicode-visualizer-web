<script lang="typescript" context="module">
	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

	type BlockEntry = BlockInfo & {
		count: number;
		wasAddedThisVersion: boolean;
	};

	interface Summary {
		blocks: BlockEntry[];
		totalCount: number;
	}

	export async function preload(this: any, page: any, session: any) {
		const { version } = page.params;
		const response: Response = await this.fetch(
			`versions/${version}/summary.json`
		);
		if (response.status == 200) {
			const summary: Summary = await response.json();
			return { summary, version };
		} else {
			this.error(response.status, "Couldn't load version data");
		}
	}
</script>

<script lang="typescript">
	import type { BlockInfo } from "server/Unicode";
	import OpenGraph from "../../../components/OpenGraph.svelte";

	export let version: string;
	export let summary: Summary;
</script>

<OpenGraph
	title="Unicode {version} - Unicode Visualizer"
	description="Codepoints added in this version categorized by block."
/>

<h1>Unicode {version}</h1>

<p>
	{summary.totalCount} new {#if summary.totalCount == 1}
		character was
	{:else}
		characters were
	{/if} added in Unicode {version}. This page categorizes them by block.
</p>

<p>
	For a list of every character added in this version, <a
		href="/versions/{version}/page/1"
	>
		go here</a
	>.
</p>

<div class="table">
	<div class="header">Block</div>
	<div class="header right">Count</div>

	{#each summary.blocks as entry}
		<a href="/versions/{version}/{entry.slug}">
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
