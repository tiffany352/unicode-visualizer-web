<script lang="typescript">
	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

	import { goto } from "@sapper/app";
	import InputBar from "./InputBar.svelte";

	let query: string = "";

	function onSubmit() {
		goto(`search/${encodeURIComponent(query)}`);
	}
</script>

<InputBar on:submit={onSubmit} icon="search" bind:query />
