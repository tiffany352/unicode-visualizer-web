<script lang="typescript">
	import StringBlob, { Encoding } from "model/StringBlob";

	export let codepoint: number;
	export let encoding: Encoding;

	$: string = StringBlob.fromCodepoint(encoding, codepoint);
	$: codeunits = string.getCodeunits();
</script>

<style>
	div {
		display: inline-block;
		padding: 0.25em;
		border: 1px solid rgb(200, 200, 200);
		font-family: var(--mono-font);
	}
</style>

{#each codeunits as unit}
	<div>{unit.text}</div>
{/each}
