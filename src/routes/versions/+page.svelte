<script lang="ts" context="module">
	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

	export async function preload(this: any, page: any, session: any) {
		const response: Response = await this.fetch("versions.json");
		if (response.status == 200) {
			const versions: string[] = await response.json();
			return { versions };
		} else {
			this.error(404, "Couldn't load list of versions");
		}
	}
</script>

<script lang="ts">
	import OpenGraph from "../../components/OpenGraph.svelte";

	export let versions: string[];
</script>

<OpenGraph
	title="Versions - Unicode Visualizer"
	description="Browse the list of Unicode releases."
/>

<h1>Unicode Versions</h1>

<ul>
	{#each versions as version}
		<li>
			<a href="/versions/{version}">{version}</a>
		</li>
	{/each}
</ul>
