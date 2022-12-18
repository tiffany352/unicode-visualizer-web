<script lang="ts">
	import type { CharInfo, SingleCharRef } from "$lib/server/Unicode";
	import { getDisplayText } from "$lib/strings";
	import { Encoding } from "$lib/model/StringBlob";
	import OpenGraph from "$lib/components/OpenGraph.svelte";
	import CopyButton from "$lib/components/CopyButton.svelte";
	import Repr from "../_repr.svelte";
	import CharRef from "../_charRef.svelte";
	import { escapeHtml } from "$lib/model/Util";
	import type { PageData } from "./$types";

	export let data: PageData;
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
					return `<a href="/codepoint/${ref.slug}" title="U+${ref.codepointStr} ${ref.name}">U+${ref.codepointStr}</a>`;
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

{#if data.type == "char"}
	<!-- prettier-ignore -->
	<OpenGraph
			title="U+{data.codepointStr} {data.name} - Unicode Visualizer"
			description="View the properties of U+{data.codepointStr} {data.name}."
			url="/codepoint/{data.slug}" />
{:else}
	<!-- prettier-ignore -->
	<OpenGraph
			title="Invalid codepoint"
			description="U+{data.codepointStr} does not refer to a valid Unicode codepoint. {getDisplayText(data.reason)}"
			url="/codepoint/{data.slug}" />
{/if}

{#if data.type == "char"}
	<h1><span class="mono">U+{data.codepointStr}</span> {data.name}</h1>

	<div class="preview" bind:this={preview}>{data.text}</div>

	<CopyButton text={data.text} />

	<h2>Properties</h2>

	<div class="table">
		<div>Appeared</div>
		<div><a href="/versions/{data.age}/page/1">Unicode {data.age}</a></div>

		<div>Aliases</div>
		<div>
			{#if data.type == "char" && data.aliases && data.aliases.length > 0}
				<ul>
					{#each data.aliases as alias}
						<li>{alias.text} ({alias.type})</li>
					{/each}
				</ul>
			{:else}None{/if}
		</div>

		<div>Block</div>
		<div><a href="/blocks/{data.block.slug}">{data.block.name}</a></div>

		<div>Category</div>
		<div>
			{getDisplayText(`generalCategory.${data.category}`)} ({data.category})
		</div>

		<div>Script</div>
		<div>{data.script.name}</div>

		<div>East-Asian Width</div>
		<div>{getDisplayText(`eastAsianWidth.${data.eastAsianWidth}`)}</div>

		<div>Numeric Value</div>
		<div>
			{#if data.type == "char" && data.numeric}
				{data.numeric.value}
			{:else}Not numeric.{/if}
		</div>

		{#if data.type == "char" && data.lowercaseForm}
			<div>Lowercase</div>
			<div>
				<CharRef ref={data.lowercaseForm} />
			</div>
		{/if}

		{#if data.type == "char" && data.uppercaseForm}
			<div>Uppercase</div>
			<div>
				<CharRef ref={data.uppercaseForm} />
			</div>
		{/if}

		{#if data.type == "char" && data.titlecaseForm}
			<div>Titlecase</div>
			<div>
				<CharRef ref={data.titlecaseForm} />
			</div>
		{/if}

		<div>Tags</div>
		<div class="flow">
			{#each data.tags as tag}
				<div class="tag">{tag}</div>
			{:else}None{/each}
		</div>

		<div>UTF-8</div>
		<div class="flow">
			<Repr codepoint={data.codepoint} encoding={Encoding.Utf8} />
		</div>

		<div>UTF-16</div>
		<div class="flow">
			<Repr codepoint={data.codepoint} encoding={Encoding.Utf16} />
		</div>
	</div>

	{#if data.type == "char" && data.unihan != null}
		<h2>Unihan Data</h2>

		<div class="table">
			<div>Definition</div>
			<div>
				{@html linkifyDefinition(
					data.unihan.definition,
					data.unihan.definitionRefs
				)}
			</div>

			<div>Stroke Count</div>
			<div>{data.unihan.totalStrokes || "Unknown"}</div>

			<div>Cantonese</div>
			<div>{data.unihan.cantonese || "None"}</div>

			<div>Japanese Kun</div>
			<div>{maybeLowerCase(data.unihan.japaneseKun)}</div>

			<div>Japanese On</div>
			<div>{maybeLowerCase(data.unihan.japaneseOn)}</div>

			<div>Korean</div>
			<div>{maybeLowerCase(data.unihan.korean)}</div>

			<div>Mandarin</div>
			<div>{data.unihan.mandarin || "None"}</div>

			<div>Vietnamese</div>
			<div>{data.unihan.vietnamese || "None"}</div>

			<div>Grade Level</div>
			<div>{data.unihan.gradeLevel || "None"}</div>

			<div>Big5 Encoding</div>
			<div>
				{#if data.type == "char" && data.unihan && data.unihan.bigFiveEncoding}
					<div class="repr-box">{data.unihan.bigFiveEncoding.toString(16)}</div>
				{:else}None{/if}
			</div>

			<div>GB-1 Encoding</div>
			<div>
				{#if data.type == "char" && data.unihan && data.unihan.gb1Encoding}
					<div class="repr-box">{data.unihan.gb1Encoding.toString(16)}</div>
				{:else}None{/if}
			</div>

			{#if data.type == "char" && data.unihan && data.unihan.simplifiedChinese}
				<div>Simplified Form</div>
				<div>
					<CharRef ref={data.unihan.simplifiedChinese} />
				</div>
			{/if}

			{#if data.type == "char" && data.unihan && data.unihan.traditionalChinese}
				<div>Traditional Form</div>
				<div>
					<CharRef ref={data.unihan.traditionalChinese} />
				</div>
			{/if}
		</div>

		<h2>External Links</h2>

		<ul>
			<li>
				<a
					href="https://www.mdbg.net/chinese/dictionary?page=worddict&wdrst=0&wdqb={data.text}"
					>MDBG Chinese Dictionary (Simplified Chinese)</a
				>
			</li>
			<li>
				<a
					href="https://www.mdbg.net/chinese/dictionary?page=worddict&wdrst=1&wdqb={data.text}"
					>MDBG Chinese Dictionary (Traditional Chinese)</a
				>
			</li>
			<li>
				<a
					href="http://www.cantonese.sheik.co.uk/dictionary/characters/{data.text}/"
					>CantoDict Project Cantonese Dictionary</a
				>
			</li>
			<li>
				<a
					href="http://en.glyphwiki.org/wiki/u{data.codepointStr.toLowerCase()}"
					>GlyphWiki</a
				>
			</li>
		</ul>
	{/if}
{:else}
	<h1>0x{data.codepointStr} Invalid Unicode</h1>

	<p>{getDisplayText(data.reason)}</p>

	<div class="table">
		<div>UTF-8</div>
		<div class="flow">
			<Repr codepoint={data.codepoint} encoding={Encoding.Utf8} />
		</div>
		<div>UTF-16</div>
		<div class="flow">
			<Repr codepoint={data.codepoint} encoding={Encoding.Utf16} />
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
