<script lang="typescript">
	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

	import type {
		CodeunitInfo,
		CodepointInfo,
		GraphemeInfo,
	} from "model/StringBlob";
	import type { Extra } from "./extra";
	import Codepoint from "./Codepoint.svelte";
	import Grapheme from "./Grapheme.svelte";

	export let extra: Extra | null;
	export let codeunits: CodeunitInfo[];
	export let codepoints: CodepointInfo[];
	export let graphemes: GraphemeInfo[];
</script>

<style>
	.scroll {
		padding: 0.5em;
		margin: 0 -0.25em;
		background-color: var(--panel-bg);
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.inspect {
		display: grid;
		grid-template-rows: min-content min-content min-content;
		width: max-content;
		overflow-x: auto;
		text-align: center;
		background-color: var(--main-bg);
	}

	.codeunit {
		font-family: var(--mono-font);
		grid-row: 1;
		border-left: 1px solid var(--main-border);
		border-right: 1px solid var(--main-border);
		padding: 0.25em;
	}

	.codepoint {
		grid-row: 2;
		border-left: 1px solid var(--main-border);
		border-right: 1px solid var(--main-border);
	}

	.codepoint[data-invalid="true"] {
		border-top: 1px solid rgba(255, 0, 0, 0.33);
		border-bottom: 1px solid rgba(255, 0, 0, 0.33);
		background-color: rgba(255, 0, 0, 0.1);
	}

	.grapheme {
		grid-row: 3;
		border-left: 1px solid var(--main-border);
		border-right: 1px solid var(--main-border);
	}
</style>

<div class="scroll">
	<div
		class="inspect"
		style="grid-template-columns: repeat({codeunits.length}, fit-content)">
		{#each codeunits as codeunit}
			<div class="codeunit" title={codeunit.class}>{codeunit.text}</div>
		{/each}
		{#each codepoints as codepoint}
			<div
				class="codepoint"
				data-invalid={codepoint.value == null}
				style="grid-column-start: {codepoint.first + 1}; grid-column-end: {codepoint.last + 2}">
				<Codepoint {codepoint} {extra} />
			</div>
		{/each}
		{#each graphemes as grapheme}
			<div
				class="grapheme"
				style="grid-column-start: {grapheme.first + 1}; grid-column-end: {grapheme.last + 2}">
				<Grapheme {grapheme} {extra} onlyItem={codepoints.length == 1} />
			</div>
		{/each}
	</div>
</div>
