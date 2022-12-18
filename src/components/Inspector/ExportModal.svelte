<script lang="ts">
	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

	import StringBlob, { encodingToTag, DataType } from "$lib/model/StringBlob";
	import { getDisplayText } from "strings";
	import { createEventDispatcher, onMount } from "svelte";
	import Modal from "../Modal.svelte";
	import CopyButton from "../CopyButton.svelte";
	import { selectText } from "$lib/model/Util";

	const dispatch = createEventDispatcher();
	const close = () => dispatch("close");

	export let string: StringBlob;
	export let exportType: DataType;

	let pre: HTMLPreElement;
	let useSep: boolean = true;

	$: dataType = getDisplayText(`dataType.${exportType}`);
	$: encoding = getDisplayText(`encoding.${encodingToTag(string.encoding)}`);
	$: html = string.dataEncode(exportType, useSep).replace(/\./g, ".<wbr>");
	$: textToCopy = (exportType && string.dataEncode(exportType)) || "";

	onMount(() => {
		selectText(pre);
	});
</script>

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
		<CopyButton text={textToCopy} element={pre} />
	</div>
</Modal>
