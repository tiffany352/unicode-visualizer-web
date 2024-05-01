<!-- This Source Code Form is subject to the terms of the Mozilla Public
 !-- License, v. 2.0. If a copy of the MPL was not distributed with this
 !-- file, You can obtain one at http://mozilla.org/MPL/2.0/. -->
<script lang="ts">
	import { getDisplayText } from "$lib/strings";
	import OpenGraph from "$lib/components/OpenGraph.svelte";
	import type { PageData } from "./$types";
	import type { Char } from "$lib/server/Unicode";

	export let data: PageData;

	const categoryScores = {
		Cc: -10, // Control
		Cf: -20, // Format
		Co: -30, // Private Use
		Cs: -40, // Surrrogate
		Ll: 20, // Lowercase Letter
		Lm: 0, // Modifier Letter
		Lo: 20, // Other Letter
		Lt: 30, // Titlecase Letter
		Lu: 30, // Uppercase Letter
		Mc: 0, // Spacing Mark
		Me: 0, // Enclosing Mark
		Mn: 0, // Nonspacing Mark
		Nd: 10, // Decimal Number
		Nl: 10, // Letter Number
		No: 10, // Other Number
		Pc: 0, // Connector Punctuation
		Pd: 0, // Dash Punctuation
		Pe: 0, // Close Punctuation
		Pf: 0, // Final Punctuation
		Pi: 0, // Initial Punctuation
		Po: 10, // Other Punctuation
		Ps: 0, // Open Punctuation
		Sc: 20, // Currency Symbol
		Sk: 0, // Modifier Symbol
		Sm: 20, // Math Symbol
		So: 40, // Other Symbol
		Zl: -10, // Line Separator
		Zp: -10, // Paragraph Separator
	};

	function findBestPreviewChar(): Char {
		let bestMatch: Char;
		let bestScore = -10000;
		for (const char of data.block.codepoints) {
			const score = categoryScores[char.category];
			if (score > bestScore) {
				bestMatch = char;
				bestScore = score;
			}
		}
		return bestMatch;
	}
</script>

<OpenGraph
	title="{data.block.name} - Blocks"
	description="View codepoints in the {data.block.name} Unicode data.block."
	previewText={findBestPreviewChar().text}
/>

<h1>{data.block.name}</h1>

<p>
	The <strong>{data.block.name}</strong> block spans
	<code>U+{data.block.firstCodepointStr}</code>
	to
	<code>U+{data.block.lastCodepointStr}</code>. Of the {data.block.totalCount} codepoints
	in this block, {data.block.assignedCount}
	have been assigned, and {data.block.reservedCount}
	are reserved.
</p>

<p>
	This block was most recently added to in <a
		href="/versions/{data.block.newestVersion}/{data.block.slug}"
		>Unicode {data.block.newestVersion}</a
	>.
</p>

{#if data.block.allAreEquallyInvalid}
	<div class="table">
		<div>N/A</div>
		<div>All</div>
		<div>{getDisplayText(data.block.allAreEquallyInvalid)}</div>
	</div>
{:else}
	<div class="table">
		{#each data.block.codepoints as char}
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
{/if}

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
