<script lang="typescript">
	import { goto } from "@sapper/app";
	import InputBar from "./InputBar.svelte";

	let query: string = "";

	function onSubmit() {
		goto(`search/${encodeURIComponent(query)}`);
	}
</script>

<InputBar on:submit={onSubmit} icon="search" bind:query />
