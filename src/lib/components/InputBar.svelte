<script lang="ts">
	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

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
		border: 1px solid var(--input-border);
		background-color: var(--input-bg);
		color: var(--main-text);
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
