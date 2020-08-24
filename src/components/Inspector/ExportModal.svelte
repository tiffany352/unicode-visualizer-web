<script lang="typescript">
	import StringBlob, { encodingToTag, DataType } from "model/StringBlob";
	import { getDisplayText } from "strings";
	import { createEventDispatcher, onMount } from "svelte";
	import Modal from "../Modal.svelte";

	const dispatch = createEventDispatcher();
	const close = () => dispatch("close");

	export let string: StringBlob;
	export let exportType: DataType;

	let pre: HTMLPreElement;
	let success: boolean;
	let useSep: boolean = true;

	$: dataType = getDisplayText(`dataType.${exportType}`);
	$: encoding = getDisplayText(`encoding.${encodingToTag(string.encoding)}`);
	$: html = string.dataEncode(exportType, useSep).replace(/\./g, ".<wbr>");

	function selectText() {
		const range = document.createRange();
		range.selectNode(pre);
		window.getSelection()?.addRange(range);
	}

	function copyText() {
		selectText();
		success = false;
		try {
			success = document.execCommand(
				"copy",
				undefined,
				(exportType && string.dataEncode(exportType)) || ""
			);
		} catch (err) {
			console.log("Unable to copy: ", err);
		}
		setTimeout(() => (success = false), 500);
	}

	onMount(() => {
		selectText();
	});
</script>

<style>
	.copyText {
		color: transparent;
	}

	.copyText.success {
		animation: 0.5s ease-out fadeout;
	}

	@keyframes fadeout {
		from {
			color: black;
		}

		50% {
			color: black;
		}

		to {
			color: transparent;
		}
	}
</style>

<Modal on:close={close}>
	{#if exportType == DataType.Codepoints}
		<p>Exported as list of codepoints.</p>
	{:else}
		<p>Exported as {dataType}-encoded {encoding}.</p>
	{/if}

	<input id="sep" type="checkbox" bind:checked={useSep} />
	<label for="sep">Use separator</label>

	<pre class="text-preview" bind:this={pre}>
		{@html html}
	</pre>

	<div slot="buttons">
		<button class="button" on:click={copyText}>Copy</button>
		<span class="copyText" class:success>Copied!</span>
	</div>
</Modal>
