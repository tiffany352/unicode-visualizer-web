<!-- This Source Code Form is subject to the terms of the Mozilla Public
 !-- License, v. 2.0. If a copy of the MPL was not distributed with this
 !-- file, You can obtain one at http://mozilla.org/MPL/2.0/. -->
<script lang="ts">
	import { getDisplayText } from "$lib/strings";
	import OpenGraph from "$lib/components/OpenGraph.svelte";
	import type { PageData } from "./$types";
	import type { Char } from "$lib/server/Unicode";

	export let data: PageData;
</script>

<OpenGraph
	title="{data.category.name} - Categories"
	description="View codepoints in the {data.category.name} Unicode category."
/>

<h1>{data.category.name} ({data.category.abbr})</h1>

<p>This category contains {data.category.count} codepoints.</p>

{#if data.category.codepoints.length < data.category.count}
	<p>Only the first {data.category.codepoints.length} are shown here.</p>
{/if}

<div class="table">
	{#each data.category.codepoints as char}
		{#if char.type == "char"}
			<a href="/codepoint/{char.slug}" rel="nofollow">
				<div class="char"><span>{char.text}</span></div>
				<div><code>U+{char.codepointStr}</code></div>
				<div><span>{char.name}</span></div>
			</a>
		{:else}
			<a href="/codepoint/{char.slug}" rel="nofollow">
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
