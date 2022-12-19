<!-- This Source Code Form is subject to the terms of the Mozilla Public
 !-- License, v. 2.0. If a copy of the MPL was not distributed with this
 !-- file, You can obtain one at http://mozilla.org/MPL/2.0/. -->
<script lang="ts">
	import OpenGraph from "$lib/components/OpenGraph.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<OpenGraph
	title="Versions"
	description="Browse the list of Unicode releases."
/>

<h1>Unicode Versions</h1>

<ul>
	{#each data.versions as version}
		<li>
			<a href="/versions/{version}">{version}</a>
		</li>
	{/each}
</ul>
