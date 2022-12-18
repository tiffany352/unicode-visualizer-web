<!-- This Source Code Form is subject to the terms of the Mozilla Public
 !-- License, v. 2.0. If a copy of the MPL was not distributed with this
 !-- file, You can obtain one at http://mozilla.org/MPL/2.0/. -->
<script lang="ts">
	import Searchbar from "$lib/components/Searchbar.svelte";

	let query: string = "";
</script>

<h1>Search</h1>

<Searchbar bind:query />
