<script lang="typescript">
	import { goto } from "@sapper/app";
	import Icon from "./Icon.svelte";

	export let query: string = "";

	function onSubmit() {
		goto(`search/${encodeURIComponent(query)}`);
	}
</script>

<style>
	form {
		width: 100%;
		display: flex;
		align-items: center;
		margin: 0.5em 0;
	}

	.icon {
		z-index: 2;
		display: block;
		padding-left: 4px;
	}

	.icon :global(svg) {
		display: block;
	}

	input {
		flex-grow: 1;
		font-size: 1.2em;
		padding: 0.25em;
		border: 1px solid rgb(100, 100, 100);
		background-color: white;
		border-radius: 5px;
		margin-left: -28px;
		padding-left: calc(0.25em + 24px);
	}
</style>

<form action="search" method="get" on:submit|preventDefault={onSubmit}>
	<div class="icon">
		<Icon icon="search" />
	</div>
	<input type="search" bind:value={query} />
</form>
