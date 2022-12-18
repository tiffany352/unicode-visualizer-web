<script lang="ts" context="module">
	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

	export async function preload(this: any, page: any, session: any) {
		const { input } = page.params;

		const response: Response = await this.fetch(`inspect/${input}/info.json`, {
			headers: {
				Accept: "application/json",
			},
		});

		if (response.status == 200) {
			const json = await response.json();
			const chars: CharMap = json.codepoints;
			const sequences: SequenceInfo[] = json.sequences;
			const extra = { chars, sequences };
			return { input, extra };
		}

		return { input };
	}
</script>

<script lang="ts">
	import type { CharMap, SequenceInfo } from "$lib/server/Unicode";
	import OpenGraph from "../../../components/OpenGraph.svelte";
	import Inspector from "../../../components/Inspector/index.svelte";
	import StringBlob from "$lib/model/StringBlob";

	interface Extra {
		chars: CharMap;
		sequences: SequenceInfo[];
	}

	export let input: string;
	export let extra: Extra | null = null;

	$: string = StringBlob.urlDecode(input);
</script>

<OpenGraph
	title="Unicode Visualizer - Inspect String"
	description="Shows a breakdown of the contents of a given string."
/>

<h1>Inspect</h1>

<Inspector {string} {extra} />
