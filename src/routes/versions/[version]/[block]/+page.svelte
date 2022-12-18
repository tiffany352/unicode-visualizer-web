<script lang="ts" context="module">
	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

	interface PageData {
		block: BlockInfo;
		codepoints: CharInfo[];
	}

	export async function preload(this: any, page: any, session: any) {
		const { version, block } = page.params;
		const response: Response = await this.fetch(
			`versions/${version}/${block}/data.json`
		);
		if (response.status == 200) {
			const data: PageData = await response.json();
			return { ...data, version };
		} else {
			this.error(response.status, "Couldn't load data");
		}
	}
</script>

<script lang="ts">
	import type { BlockInfo, CharInfo } from "$lib/server/Unicode";
	import { getDisplayText } from "$lib/strings";
	import OpenGraph from "../../../../components/OpenGraph.svelte";

	export let beforeThisVersion: number;
	export let afterThisVersion: number;
	export let previousVersion: string;
	export let nextVersion: string;
	export let version: string;
	export let block: BlockInfo;
	export let codepoints: CharInfo[];
</script>

<OpenGraph
	title="Unicode {version} - New Chars in {block.name} - Unicode Visualizer"
	description="Codepoints added in this version categorized by block."
/>

<h1>Unicode {version} - {block.name}</h1>

{#if previousVersion}
	<a href="/versions/{previousVersion}/{block.slug}">
		« Unicode {previousVersion}
	</a>
{:else}
	« (no older)
{/if}

•

{#if nextVersion}
	<a href="/versions/{nextVersion}/{block.slug}"> Unicode {nextVersion} » </a>
{:else}
	(no newer) »
{/if}

<p>
	{codepoints.length} new
	{#if codepoints.length == 1}
		character was
	{:else}
		characters were
	{/if} added to the
	<a href="/blocks/{block.slug}">{block.name}</a>
	block in Unicode {version}.
</p>

<p>
	{#if beforeThisVersion == 0}
		This is the first version this block was present in.
	{:else}
		{beforeThisVersion} codepoints were added before this version.
	{/if}
	{#if afterThisVersion == 0}
		This is the most recent version that added codepoints to this block.
	{:else}
		{afterThisVersion}
		codepoints have been added after this version.
	{/if}
</p>

<div class="table">
	{#each codepoints as char}
		{#if char.type == "char"}
			<a href="/codepoint/{char.slug}">
				<div class="char"><span>{char.text}</span></div>
				<div><code>U+{char.codepointStr}</code></div>
				<div><span>{char.name}</span></div>
			</a>
		{:else}
			<a href="/codepoint/{char.slug}">
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
