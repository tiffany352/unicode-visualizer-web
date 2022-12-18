<script lang="ts" context="module">
	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

	export async function preload(this: any, pageObj: any, session: any) {
		const { page } = pageObj.params;
		const response: Response = await this.fetch(`emoji/page/${page}.json`);
		if (response.status == 200) {
			const json = await response.json();
			const emoji: Char[] = json.emoji;
			const pageCount: number = json.pageCount;
			const currentPage: number = json.currentPage;
			return { emoji, pageCount, currentPage };
		} else {
			this.error(404, "Couldn't load list of emoji");
		}
	}

	function codepoint(value: number): string {
		return "U+" + (value || 0).toString(16).padStart(4, "0").toUpperCase();
	}
</script>

<script lang="ts">
	import OpenGraph from "../../../../components/OpenGraph.svelte";
	import Paginate from "../../../../components/Paginate.svelte";
	import type { Char } from "$lib/server/Unicode";

	export let emoji: Char[];
	export let currentPage: number;
	export let pageCount: number;
</script>

<OpenGraph
	title="Sequences - Unicode Visualizer"
	description="Browse the named sequences in Unicode."
/>

<h1>Browse Emoji</h1>

<Paginate
	pages={pageCount}
	current={currentPage}
	createUrl={(page) => `emoji/page/${page}`}
/>

<div class="table">
	{#each emoji as char}
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
	pages={pageCount}
	current={currentPage}
	createUrl={(page) => `emoji/page/${page}`}
/>

<style>
	.table {
		grid-template-columns: min-content 1fr;
	}
</style>
