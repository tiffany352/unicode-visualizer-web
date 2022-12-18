<!-- This Source Code Form is subject to the terms of the Mozilla Public
 !-- License, v. 2.0. If a copy of the MPL was not distributed with this
 !-- file, You can obtain one at http://mozilla.org/MPL/2.0/. -->
<script lang="ts">
	import type {
		CodeunitInfo,
		CodepointInfo,
		GraphemeInfo,
	} from "$lib/model/StringBlob";
	import type { Extra } from "./extra";
	import Codepoint from "./Codepoint.svelte";
	import Grapheme from "./Grapheme.svelte";

	export let extra: Extra | null;
	export let codeunits: CodeunitInfo[];
	export let codepoints: CodepointInfo[];
	export let graphemes: GraphemeInfo[];
</script>

<div class="scroll">
	<div
		class="inspect"
		style="grid-template-columns: repeat({codeunits.length}, fit-content)"
	>
		<div class="offset header">#</div>
		<div class="codeunit header">Unit</div>
		<div class="codepoint header">Codepoint</div>
		<div class="grapheme header">Grapheme</div>
		{#each codeunits as codeunit, offset}
			<div
				class="offset"
				style="grid-row: {offset + 2}"
				title="Offset: 0x{offset.toString(16).padStart(2, '0')}"
			>
				{offset}
			</div>
			<div
				class="codeunit"
				title={codeunit.class}
				style="grid-row: {offset + 2}"
			>
				{codeunit.text}
				<span class="class">{codeunit.class}</span>
			</div>
		{/each}
		{#each codepoints as codepoint}
			<div
				class="codepoint"
				data-invalid={codepoint.value == null}
				style="grid-row-start: {codepoint.first +
					2}; grid-row-end: {codepoint.last + 3}"
			>
				<Codepoint {codepoint} {extra} wide />
			</div>
		{/each}
		{#each graphemes as grapheme}
			<div
				class="grapheme"
				style="grid-row-start: {grapheme.first +
					2}; grid-row-end: {grapheme.last + 3}"
			>
				<Grapheme {grapheme} {extra} />
			</div>
		{/each}
	</div>
</div>

<style>
	.scroll {
		padding: 0.5em;
		margin: 0 -0.25em;
		background-color: var(--panel-bg);
		display: flex;
		flex-direction: column;
	}

	.inspect {
		display: grid;
		grid-template-columns: 2em min-content 2fr 1fr;
		background-color: var(--main-bg);
	}

	.header {
		grid-row: 1;
		font-family: var(--header-font);
		border-top: none;
	}

	.offset {
		grid-column: 1;
		text-align: right;
		padding: 0.25em;
		border-top: 1px solid var(--main-border);
		border-bottom: 1px solid var(--main-border);
		padding-right: 0.5em;
	}

	.codeunit {
		font-family: var(--mono-font);
		grid-column: 2;
		border-top: 1px solid var(--main-border);
		border-bottom: 1px solid var(--main-border);
		padding: 0.25em;
	}

	.codepoint {
		grid-column: 3;
		border-top: 1px solid var(--main-border);
		border-bottom: 1px solid var(--main-border);
	}

	.codepoint[data-invalid="true"] {
		border-top: 1px solid rgba(255, 0, 0, 0.33);
		border-bottom: 1px solid rgba(255, 0, 0, 0.33);
		background-color: rgba(255, 0, 0, 0.02);
	}

	.grapheme {
		grid-column: 4;
		border-top: 1px solid var(--main-border);
		border-bottom: 1px solid var(--main-border);
	}

	.class {
		font-size: 80%;
		font-family: var(--font);
	}
</style>
