<!-- This Source Code Form is subject to the terms of the Mozilla Public
 !-- License, v. 2.0. If a copy of the MPL was not distributed with this
 !-- file, You can obtain one at http://mozilla.org/MPL/2.0/. -->
<script lang="ts">
	import OpenGraph from "$lib/components/OpenGraph.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;

	function codepoint(value: number): string {
		return "U+" + (value || 0).toString(16).padStart(4, "0").toUpperCase();
	}
</script>

<OpenGraph title="Blocks" description="Browse the blocks in Unicode." />

<h1>Browse Unicode Blocks</h1>

<div class="table">
	{#each data.blocks as block}
		<a href="/blocks/{block.slug}">
			<div>{block.name}</div>
			<div>
				<code>{codepoint(block.range.first)}</code>
			</div>
			<div>
				<code>{codepoint(block.range.last)}</code>
			</div>
		</a>
	{/each}
</div>

<style>
	.table {
		grid-template-columns: 1fr min-content min-content;
	}
</style>
