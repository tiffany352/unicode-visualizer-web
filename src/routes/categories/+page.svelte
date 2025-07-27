<!-- This Source Code Form is subject to the terms of the Mozilla Public
 !-- License, v. 2.0. If a copy of the MPL was not distributed with this
 !-- file, You can obtain one at http://mozilla.org/MPL/2.0/. -->
<script lang="ts">
	import OpenGraph from "$lib/components/OpenGraph.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<OpenGraph title="Blocks" description="Browse the categories in Unicode." />

<h1>Categories</h1>

<ul>
	{#each data.categories as category}
		<li>
			<a href="/categories/{category.slug}">
				({category.abbr}) {category.name}
			</a>
		</li>
	{/each}
</ul>

<style>
a {
	text-decoration: none;
}
</style>
