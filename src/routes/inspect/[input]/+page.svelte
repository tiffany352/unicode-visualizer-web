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
</script>

<OpenGraph
	title="Unicode Visualizer - Inspect String"
	description="Shows a breakdown of the contents of a given string."
/>

<h1>Inspect</h1>

<Inspector {string} {extra} />
