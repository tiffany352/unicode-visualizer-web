<script lang="typescript">
	import type StringBlob from "model/StringBlob";
	import DataRow from "./DataRow.svelte";
	import DataCol from "./DataCol.svelte";
	import type { Extra } from "./extra";

	enum Direction {
		Row,
		Column,
	}

	export let string: StringBlob;
	export let extra: Extra | null = null;

	let direction: Direction = Direction.Row;

	$: codeunits = string.getCodeunits();
	$: codepoints = string.getCodepoints();
	$: graphemes = string.getGraphemes();
</script>

<style>
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

<fieldset class="radio">
	<legend>Display</legend>

	<input id="row" type="radio" bind:group={direction} value={Direction.Row} />
	<label for="row">Row</label>

	<input
		id="col"
		type="radio"
		bind:group={direction}
		value={Direction.Column} />
	<label for="col">Col</label>
</fieldset>

<pre>{string.stringEncode()}</pre>

{#if direction == Direction.Row}
	<DataRow {codeunits} {codepoints} {graphemes} {extra} />
{:else}
	<DataCol {codeunits} {codepoints} {graphemes} {extra} />
{/if}
