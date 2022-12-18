<script lang="ts">
	import type { CharMap, SequenceInfo } from "$lib/server/Unicode";
	import OpenGraph from "../../../components/OpenGraph.svelte";
	import Inspector from "../../../components/Inspector/index.svelte";
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
