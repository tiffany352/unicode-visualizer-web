<script lang="typescript">
	import StringBlob, {
		Encoding,
		getEncodings,
		encodingToTag,
	} from "model/StringBlob";
	import type { Extra } from "./extra";
	import DataRow from "./DataRow.svelte";
	import DataCol from "./DataCol.svelte";
	import Menu from "../Menu.svelte";
	import { getDisplayText } from "strings";

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

	const normalForms = ["NFC", "NFD", "NFKC", "NFKD"];
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

	nav {
		display: flex;
		flex-direction: row;
		align-items: flex-end;
	}
</style>

<nav>
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

	<Menu title="Convert text to another encoding">
		<span slot="button">Convert...</span>

		{#each getEncodings() as encoding}
			<li>
				<a href="inspect/{string.convert(encoding).urlEncode()}">
					{getDisplayText(`encoding.${encodingToTag(encoding)}`)}
				</a>
			</li>
		{/each}
	</Menu>

	<Menu title="Reinterpret the bytes of this text as another encoding">
		<span slot="button">Reinterpret...</span>

		{#each getEncodings() as encoding}
			<li>
				<a href="inspect/{string.reinterpret(encoding).urlEncode()}">
					{getDisplayText(`encoding.${encodingToTag(encoding)}`)}
				</a>
			</li>
		{/each}
	</Menu>

	<Menu title="Normalize text into one of the Unicode Normal Forms">
		<span slot="button">Normalize...</span>

		{#each normalForms as nf}
			<li title={getDisplayText(`normalFormTooltip.${nf}`)}>
				{#if string.normalize(nf).equal(string)}
					<div class="disabled">✓ {getDisplayText(`normalForm.${nf}`)}</div>
				{:else}
					<a href="inspect/{string.normalize(nf).urlEncode()}">
						{getDisplayText(`normalForm.${nf}`)}
					</a>
				{/if}
			</li>
		{/each}
	</Menu>

</nav>

<pre>{string.stringEncode()}</pre>

{#if direction == Direction.Row}
	<DataRow {codeunits} {codepoints} {graphemes} {extra} />
{:else}
	<DataCol {codeunits} {codepoints} {graphemes} {extra} />
{/if}
