<script lang="typescript">
	import { createEventDispatcher } from "svelte";
	import Icon from "./Icon.svelte";

	const dispatch = createEventDispatcher();

	export let query: string;
	export let icon: string = "search";
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

<form
	action="search"
	method="get"
	on:submit|preventDefault={(event) => dispatch('submit', event)}>
	<div class="icon">
		<Icon {icon} />
	</div>
	<input type="search" bind:value={query} />
</form>
