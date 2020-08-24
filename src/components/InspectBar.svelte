<script lang="typescript">
	import { goto } from "@sapper/app";
	import InputBar from "./InputBar.svelte";
	import StringBlob, { Encoding } from "model/StringBlob";

	let query: string = "";

	function onSubmit() {
		const string = StringBlob.stringDecode(Encoding.Utf8, query);
		goto(`inspect/${string.urlEncode()}`);
	}
</script>

<InputBar on:submit={onSubmit} icon="terminal" bind:query />
