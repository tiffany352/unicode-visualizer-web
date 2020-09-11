<script lang="typescript" context="module">
	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

	export async function preload(this: any, page: any, session: any) {
		const { id, slug } = page.params;
		const response: Response = await this.fetch(`codepoint/${id}.json`);
		if (response.status == 200) {
			const char: CharInfo = await response.json();
			if (char.slug != `${id}-${slug}`) {
				this.redirect(301, `codepoint/${char.slug}`);
			}
			return { char };
		} else {
			this.error(
				404,
				`Could not find Unicode codepoint U+${id.toUpperCase()}.`
			);
		}
	}
</script>

<script lang="typescript">
	import type { CharInfo } from "server/Unicode";
	import { getDisplayText } from "strings";
	import { Encoding } from "model/StringBlob";
	import OpenGraph from "../../components/OpenGraph.svelte";
	import Repr from "./_repr.svelte";
	import CaseMap from "./_caseMap.svelte";

	export let char: CharInfo;
</script>

<style>
	.preview {
		font-size: 3em;
		padding: 10px;
		background-color: rgb(240, 240, 240);
		border: 1px solid rgb(100, 100, 100);
		border-radius: 5px;
		color: rgb(60, 60, 60);
		width: min-content;
		height: min-content;
		min-width: 1em;
		min-height: 1em;
		text-align: center;
	}

	.table {
		grid-template-columns: 6em 1fr;
	}

	.tag {
		border: 1px solid rgb(150, 150, 150);
		border-radius: 5px;
		padding: 0 4px;
		margin: 2px 4px;
	}

	.flow {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}
</style>

{#if char.type == 'char'}
	<!-- prettier-ignore -->
	<OpenGraph
			title="U+{char.codepointStr} {char.name} - Unicode Visualizer"
			description="View the properties of U+{char.codepointStr} {char.name}."
			url="/codepoint/{char.slug}" />
{:else}
	<!-- prettier-ignore -->
	<OpenGraph
			title="Invalid codepoint"
			description="U+{char.codepointStr} does not refer to a valid Unicode codepoint. {getDisplayText(char.reason)}"
			url="/codepoint/{char.slug}" />
{/if}

{#if char.type == 'char'}
	<h1><span class="mono">U+{char.codepointStr}</span> {char.name}</h1>

	<div class="preview">{char.text}</div>

	<h2>Properties</h2>

	<div class="table">
		<div>Appeared</div>
		<div><a href="versions/{char.age}/page/1">Unicode {char.age}</a></div>
		<div>Aliases</div>
		<div>
			{#if char.type == 'char' && char.aliases && char.aliases.length > 0}
				<ul>
					{#each char.aliases as alias}
						<li>{alias.text} ({alias.type})</li>
					{/each}
				</ul>
			{:else}None{/if}
		</div>
		<div>Block</div>
		<div><a href="blocks/{char.block.slug}">{char.block.name}</a></div>
		<div>Category</div>
		<div>
			{getDisplayText(`generalCategory.${char.category}`)} ({char.category})
		</div>
		<div>Script</div>
		<div>{char.script.name}</div>
		<div>East-Asian Width</div>
		<div>{getDisplayText(`eastAsianWidth.${char.eastAsianWidth}`)}</div>
		<div>Numeric Value</div>
		<div>
			{#if char.type == 'char' && char.numeric}
				{char.numeric.value}
			{:else}Not numeric.{/if}
		</div>
		{#if char.type == 'char' && char.lowercaseForm}
			<div>Lowercase</div>
			<div>
				<CaseMap mapping={char.lowercaseForm} />
			</div>
		{/if}
		{#if char.type == 'char' && char.uppercaseForm}
			<div>Uppercase</div>
			<div>
				<CaseMap mapping={char.uppercaseForm} />
			</div>
		{/if}
		{#if char.type == 'char' && char.titlecaseForm}
			<div>Titlecase</div>
			<div>
				<CaseMap mapping={char.titlecaseForm} />
			</div>
		{/if}
		<div>Tags</div>
		<div class="flow">
			{#each char.tags as tag}
				<div class="tag">{tag}</div>
			{:else}None{/each}
		</div>
		<div>UTF-8</div>
		<div class="flow">
			<Repr codepoint={char.codepoint} encoding={Encoding.Utf8} />
		</div>
		<div>UTF-16</div>
		<div class="flow">
			<Repr codepoint={char.codepoint} encoding={Encoding.Utf16} />
		</div>
	</div>
{:else}
	<h1>0x{char.codepointStr} Invalid Unicode</h1>

	<p>{getDisplayText(char.reason)}</p>
{/if}
