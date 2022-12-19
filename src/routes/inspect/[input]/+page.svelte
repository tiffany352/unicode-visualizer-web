<!-- This Source Code Form is subject to the terms of the Mozilla Public
 !-- License, v. 2.0. If a copy of the MPL was not distributed with this
 !-- file, You can obtain one at http://mozilla.org/MPL/2.0/. -->
<script lang="ts">
	import OpenGraph from "$lib/components/OpenGraph.svelte";
	import Inspector from "$lib/components/Inspector/index.svelte";
	import StringBlob from "$lib/model/StringBlob";
	import type { PageData } from "./$types";

	export let data: PageData;

	$: string = StringBlob.urlDecode(data.input);
	$: extra = data.extra;

	$: isSingleGrapheme = string.getGraphemes().length == 1;
	$: origString = string.stringEncode();
	$: truncString =
		origString.length > 30
			? string.stringEncode().substring(0, 27) + "..."
			: origString;
</script>

{#if isSingleGrapheme}
	<OpenGraph
		title="Inspector"
		description="Shows a breakdown of the contents of a given string."
		previewText={truncString}
	/>
{:else}
	<OpenGraph
		title="{truncString} - Inspector"
		description="Shows a breakdown of the contents of a given string."
	/>
{/if}

<h1>Inspect</h1>

<Inspector {string} {extra} />
