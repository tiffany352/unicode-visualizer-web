<script lang="ts" context="module">
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

<script lang="ts">
	import type { CharInfo, SingleCharRef } from "$lib/server/Unicode";
	import { getDisplayText } from "strings";
	import { Encoding } from "$lib/model/StringBlob";
	import OpenGraph from "../../components/OpenGraph.svelte";
	import CopyButton from "../../components/CopyButton.svelte";
	import Repr from "./_repr.svelte";
	import CharRef from "./_charRef.svelte";
	import { escapeHtml } from "$lib/model/Util";

	export let char: CharInfo;
	let preview: HTMLElement;

	function linkifyDefinition(
		input: string | null,
		refs: SingleCharRef[]
	): string {
		if (!input) {
			return "None";
		}
		input = escapeHtml(input);
		return input.replace(/U\+([A-Za-z0-9]{4,6})/g, (match, value) => {
			const code = parseInt(value, 16);
			for (const ref of refs) {
				if (ref.codepoint == code) {
					return `<a href="codepoint/${ref.slug}" title="U+${ref.codepointStr} ${ref.name}">U+${ref.codepointStr}</a>`;
				}
			}
			return match;
		});
	}

	function maybeLowerCase(input: string | null): string {
		if (!input) {
			return "None";
		}
		return input.toLowerCase();
	}
</script>

{#if char.type == "char"}
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

{#if char.type == "char"}
	<h1><span class="mono">U+{char.codepointStr}</span> {char.name}</h1>

	<div class="preview" bind:this={preview}>{char.text}</div>

	<CopyButton text={char.text} />

	<h2>Properties</h2>

	<div class="table">
		<div>Appeared</div>
		<div><a href="versions/{char.age}/page/1">Unicode {char.age}</a></div>

		<div>Aliases</div>
		<div>
			{#if char.type == "char" && char.aliases && char.aliases.length > 0}
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
			{#if char.type == "char" && char.numeric}
				{char.numeric.value}
			{:else}Not numeric.{/if}
		</div>

		{#if char.type == "char" && char.lowercaseForm}
			<div>Lowercase</div>
			<div>
				<CharRef ref={char.lowercaseForm} />
			</div>
		{/if}

		{#if char.type == "char" && char.uppercaseForm}
			<div>Uppercase</div>
			<div>
				<CharRef ref={char.uppercaseForm} />
			</div>
		{/if}

		{#if char.type == "char" && char.titlecaseForm}
			<div>Titlecase</div>
			<div>
				<CharRef ref={char.titlecaseForm} />
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

	{#if char.type == "char" && char.unihan != null}
		<h2>Unihan Data</h2>

		<div class="table">
			<div>Definition</div>
			<div>
				{@html linkifyDefinition(
					char.unihan.definition,
					char.unihan.definitionRefs
				)}
			</div>

			<div>Stroke Count</div>
			<div>{char.unihan.totalStrokes || "Unknown"}</div>

			<div>Cantonese</div>
			<div>{char.unihan.cantonese || "None"}</div>

			<div>Japanese Kun</div>
			<div>{maybeLowerCase(char.unihan.japaneseKun)}</div>

			<div>Japanese On</div>
			<div>{maybeLowerCase(char.unihan.japaneseOn)}</div>

			<div>Korean</div>
			<div>{maybeLowerCase(char.unihan.korean)}</div>

			<div>Mandarin</div>
			<div>{char.unihan.mandarin || "None"}</div>

			<div>Vietnamese</div>
			<div>{char.unihan.vietnamese || "None"}</div>

			<div>Grade Level</div>
			<div>{char.unihan.gradeLevel || "None"}</div>

			<div>Big5 Encoding</div>
			<div>
				{#if char.type == "char" && char.unihan && char.unihan.bigFiveEncoding}
					<div class="repr-box">{char.unihan.bigFiveEncoding.toString(16)}</div>
				{:else}None{/if}
			</div>

			<div>GB-1 Encoding</div>
			<div>
				{#if char.type == "char" && char.unihan && char.unihan.gb1Encoding}
					<div class="repr-box">{char.unihan.gb1Encoding.toString(16)}</div>
				{:else}None{/if}
			</div>

			{#if char.type == "char" && char.unihan && char.unihan.simplifiedChinese}
				<div>Simplified Form</div>
				<div>
					<CharRef ref={char.unihan.simplifiedChinese} />
				</div>
			{/if}

			{#if char.type == "char" && char.unihan && char.unihan.traditionalChinese}
				<div>Traditional Form</div>
				<div>
					<CharRef ref={char.unihan.traditionalChinese} />
				</div>
			{/if}
		</div>

		<h2>External Links</h2>

		<ul>
			<li>
				<a
					href="https://www.mdbg.net/chinese/dictionary?page=worddict&wdrst=0&wdqb={char.text}"
					>MDBG Chinese Dictionary (Simplified Chinese)</a
				>
			</li>
			<li>
				<a
					href="https://www.mdbg.net/chinese/dictionary?page=worddict&wdrst=1&wdqb={char.text}"
					>MDBG Chinese Dictionary (Traditional Chinese)</a
				>
			</li>
			<li>
				<a
					href="http://www.cantonese.sheik.co.uk/dictionary/characters/{char.text}/"
					>CantoDict Project Cantonese Dictionary</a
				>
			</li>
			<li>
				<a
					href="http://en.glyphwiki.org/wiki/u{char.codepointStr.toLowerCase()}"
					>GlyphWiki</a
				>
			</li>
		</ul>
	{/if}
{:else}
	<h1>0x{char.codepointStr} Invalid Unicode</h1>

	<p>{getDisplayText(char.reason)}</p>

	<div class="table">
		<div>UTF-8</div>
		<div class="flow">
			<Repr codepoint={char.codepoint} encoding={Encoding.Utf8} />
		</div>
		<div>UTF-16</div>
		<div class="flow">
			<Repr codepoint={char.codepoint} encoding={Encoding.Utf16} />
		</div>
	</div>
{/if}

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
		grid-template-columns: 8em 1fr;
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
