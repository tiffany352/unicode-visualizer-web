<!-- This Source Code Form is subject to the terms of the Mozilla Public
 !-- License, v. 2.0. If a copy of the MPL was not distributed with this
 !-- file, You can obtain one at http://mozilla.org/MPL/2.0/. -->
<script lang="ts">
	import StringBlob, {
		Encoding,
		getEncodings,
		encodingToTag,
		DataType,
		getDataTypes,
	} from "$lib/model/StringBlob";
	import type { Extra } from "./extra";
	import { getDisplayText } from "$lib/strings";
	import DataRow from "./DataRow.svelte";
	import DataCol from "./DataCol.svelte";
	import Menu from "../Menu.svelte";
	import ExportModal from "./ExportModal.svelte";

	enum Direction {
		Row,
		Column,
	}

	export let string: StringBlob;
	export let extra: Extra | null = null;

	let direction: Direction = Direction.Row;
	let exportType: DataType | null = null;

	$: codeunits = string.getCodeunits();
	$: codepoints = string.getCodepoints();
	$: graphemes = string.getGraphemes();

	const normalForms = ["NFC", "NFD", "NFKC", "NFKD"];
</script>

<nav>
	<fieldset>
		<legend>Display</legend>

		<!-- Required because of Chrome bug. -->
		<div class="radio">
			<input
				id="row"
				type="radio"
				bind:group={direction}
				value={Direction.Row}
			/>
			<label for="row">Row</label>

			<input
				id="col"
				type="radio"
				bind:group={direction}
				value={Direction.Column}
			/>
			<label for="col">Col</label>
		</div>
	</fieldset>

	<Menu title="Convert text to another encoding">
		<span slot="button">Convert...</span>

		{#each getEncodings() as encoding}
			<li>
				<form method="get" action="/inspect/{string.convert(encoding).urlEncode()}">
					<button>
						{getDisplayText(`encoding.${encodingToTag(encoding)}`)}
					</button>
				</form>
			</li>
		{/each}
	</Menu>

	<Menu title="Reinterpret the bytes of this text as another encoding">
		<span slot="button">Reinterpret...</span>

		{#each getEncodings() as encoding}
			<li>
				<form method="get" action="/inspect/{string.reinterpret(encoding).urlEncode()}">
					<button>
						{getDisplayText(`encoding.${encodingToTag(encoding)}`)}
					</button>
				</form>
			</li>
		{/each}
	</Menu>

	<Menu title="Normalize text into one of the Unicode Normal Forms">
		<span slot="button">Normalize...</span>

		{#each normalForms as nf}
			<li title={getDisplayText(`normalFormTooltip.${nf}`)}>
				{#if string.normalize(nf).equal(string)}
					<button disabled>
						✓ {getDisplayText(`normalForm.${nf}`)}
					</button>
				{:else}
					<form method="get" action="/inspect/{string.normalize(nf).urlEncode()}">
						<button>
							{getDisplayText(`normalForm.${nf}`)}
						</button>
					</form>
				{/if}
			</li>
		{/each}
	</Menu>

	<Menu title="Export">
		<span slot="button">Export...</span>

		{#each getDataTypes() as type}
			{#if type != DataType.Plain}
				<li>
					<button on:click={() => (exportType = type)}>
						{getDisplayText(`dataType.${type}`)}
					</button>
				</li>
			{/if}
		{/each}
	</Menu>
</nav>

<pre class="text-preview">{string.stringEncode()}</pre>

{#if direction == Direction.Row}
	<DataRow {codeunits} {codepoints} {graphemes} {extra} />
{:else}
	<DataCol {codeunits} {codepoints} {graphemes} {extra} />
{/if}

{#if exportType}
	<ExportModal {string} {exportType} on:close={() => (exportType = null)} />
{/if}

<style>
	nav {
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		flex-wrap: wrap;
	}

	fieldset {
		padding: 0.25em;
		width: min-content;
		border: none;
	}
</style>
