<script lang="typescript">
	import StringBlob from "model/StringBlob";
	import Codepoint from "./Codepoint.svelte";
	import Grapheme from "./Grapheme.svelte";
	import type { SequenceInfo, CharMap } from "server/Unicode";

	interface Extra {
		chars: CharMap;
		sequences: SequenceInfo[];
	}

	export let string: StringBlob;
	export let extra: Extra | null = null;

	$: codeunits = string.getCodeunits();
	$: codepoints = string.getCodepoints();
	$: graphemes = string.getGraphemes();
</script>

<style>
	.scroll {
		padding: 0.5em;
		margin: 0 -0.25em;
		background-color: rgb(153, 153, 153);
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.inspect {
		display: grid;
		grid-template-rows: min-content min-content min-content;
		width: min-content;
		overflow-x: auto;
		text-align: center;
		background-color: white;
	}

	.codeunit {
		font-family: var(--mono-font);
		grid-row: 1;
		border-left: 1px solid rgb(200, 200, 200);
		border-right: 1px solid rgb(200, 200, 200);
		padding: 0.25em;
	}

	.codepoint {
		grid-row: 2;
		border-left: 1px solid rgb(200, 200, 200);
		border-right: 1px solid rgb(200, 200, 200);
	}

	.codepoint[data-invalid="true"] {
		border-left: 1px solid rgb(255, 89, 89);
		border-right: 1px solid rgb(255, 89, 89);
		background-color: rgb(255, 243, 243);
	}

	.grapheme {
		grid-row: 3;
		border-left: 1px solid rgb(200, 200, 200);
		border-right: 1px solid rgb(200, 200, 200);
	}

	pre {
		border: 1px solid rgb(153, 197, 255);
		background-color: rgb(249, 252, 255);
		border-radius: 3px;
		font-size: unset;
		font-family: var(--mono-font);
		white-space: pre-line;
		overflow-x: auto;
		padding: 0.5em;
	}
</style>

<pre>{string.stringEncode()}</pre>

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
				<Grapheme {grapheme} {extra} />
			</div>
		{/each}
	</div>
</div>
