<!-- This Source Code Form is subject to the terms of the Mozilla Public
 !-- License, v. 2.0. If a copy of the MPL was not distributed with this
 !-- file, You can obtain one at http://mozilla.org/MPL/2.0/. -->
<script lang="ts">
	import OpenGraph from "$lib/components/OpenGraph.svelte";
	import StringBlob, {
		Encoding,
		DataType,
		getDataTypes,
		getEncodings,
		encodingToTag,
	} from "$lib/model/StringBlob";
	import { getDisplayText } from "$lib/strings";
	import { goto } from "$app/navigation";

	let dataType: DataType = DataType.Plain;
	let currentEncoding: Encoding = Encoding.Utf8;
	let data: string = "";

	$: string = StringBlob.dataDecode(dataType, currentEncoding, data);

	function updateSize(event: Event & { currentTarget: HTMLTextAreaElement }) {
		const lines = Math.max(
			10,
			event.currentTarget.value
				.split("\n")
				.reduce(
					(acc, line) =>
						(acc += Math.ceil(line.length / event.currentTarget.cols)),
					0
				)
		);
		event.currentTarget.rows = lines;
	}

	function onSubmit() {
		goto(`inspect/${string.urlEncode()}`);
	}
</script>

<!-- prettier-ignore -->
<OpenGraph
	title="Inspect - Unicode Visualizer"
	description=
		"A page for inputting text to be inspected. Shows a breakdown of the codepoints in the string, and other information."
/>

<h1>Inspect</h1>

<form on:submit|preventDefault={onSubmit}>
	<div class="options">
		<fieldset class="radio">
			<legend>Data Type</legend>

			{#each getDataTypes() as type}
				<input id={type} type="radio" bind:group={dataType} value={type} />
				<label for={type}>{getDisplayText(`dataType.${type}`)}</label>
			{/each}
		</fieldset>

		<fieldset class="radio">
			<legend>Encoding</legend>

			{#each getEncodings() as encoding}
				<input
					id={encodingToTag(encoding)}
					type="radio"
					bind:group={currentEncoding}
					value={encoding}
				/>
				<label for={encodingToTag(encoding)}>
					{getDisplayText(`encoding.${encodingToTag(encoding)}`)}
				</label>
			{/each}
		</fieldset>
	</div>

	<textarea bind:value={data} on:input={updateSize} cols={80} rows="10" />

	<button class="button" type="submit">Submit</button>
</form>

<h3>Preview</h3>

<pre class="text-preview">{string.stringEncode()}</pre>

<style>
	.options {
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		flex-wrap: wrap;
		margin-bottom: 1em;
	}

	textarea {
		font-size: 1rem;
		font-family: var(--mono-font);
		color: var(--main-text);
		background-color: var(--input-bg);
		border: 1px solid var(--input-border);
		border-radius: 3px;
		padding: 3px;
		width: 100%;
		box-sizing: border-box;
		white-space: pre-wrap;
	}
</style>
