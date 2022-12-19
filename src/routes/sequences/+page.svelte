<!-- This Source Code Form is subject to the terms of the Mozilla Public
 !-- License, v. 2.0. If a copy of the MPL was not distributed with this
 !-- file, You can obtain one at http://mozilla.org/MPL/2.0/. -->
<script lang="ts">
	import OpenGraph from "$lib/components/OpenGraph.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<OpenGraph
	title="Sequences"
	description="Browse the named sequences in Unicode."
/>

<h1>Browse Unicode Named Sequences</h1>

<div class="table">
	{#each data.sequences as sequence}
		<a href="/sequences/{sequence.slug}">
			<div>{sequence.name}</div>
			<div>
				<code>{sequence.text}</code>
			</div>
		</a>
	{/each}
</div>

<style>
	.table {
		grid-template-columns: 1fr min-content;
	}
</style>
