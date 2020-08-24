<script lang="typescript">
	import OpenGraph from "../../components/OpenGraph.svelte";
	import StringBlob, {
		Encoding,
		DataType,
		getDataTypes,
		getEncodings,
		encodingToTag,
	} from "model/StringBlob";
	import { getDisplayText } from "strings";
	import { goto } from "@sapper/app";

	let dataType: DataType = DataType.Plain;
	let currentEncoding: Encoding = Encoding.Utf8;
	let data: string = "";

	$: string = StringBlob.dataDecode(dataType, currentEncoding, data);

	function updateSize(event: Event & { target: HTMLTextAreaElement }) {
		const lines = Math.max(
			10,
			event.target.value
				.split("\n")
				.reduce(
					(acc, line) => (acc += Math.ceil(line.length / event.target.cols)),
					0
				)
		);
		event.target.rows = lines;
	}

	function onSubmit() {
		goto(`inspect/${string.urlEncode()}`);
	}
</script>

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
		width: 100%;
		box-sizing: border-box;
		white-space: pre-wrap;
	}
</style>

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
					value={encoding} />
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
