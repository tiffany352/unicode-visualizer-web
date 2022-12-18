<script lang="ts">
	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

	import { goto } from "$app/navigation";
	import InputBar from "./InputBar.svelte";

	export let query: string = "";

	function onSubmit() {
		goto(`/search/${encodeURIComponent(query)}`);
	}
</script>

<InputBar on:submit={onSubmit} icon="search" bind:query />
