<script lang="typescript" context="module">
	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

	export async function preload(this: any, page: any, session: any) {
		const { slug } = page.params;

		const response: Response = await this.fetch(`sequences/${slug}/info.json`, {
			headers: {
				Accept: "application/json",
			},
		});

		if (response.status == 200) {
			const json = await response.json();
			const sequence: SequenceInfo = json.sequence;
			const chars: CharMap = json.codepoints;
			const sequences: SequenceInfo[] = json.sequences;
			const extra = { chars, sequences };
			return { sequence, extra };
		} else {
			this.error(response.status, response.statusText);
		}
	}
</script>

<script lang="typescript">
	import type { SequenceInfo, CharMap, CharInfo } from "server/Unicode";
	import StringBlob, { Encoding } from "model/StringBlob";
	import { getDisplayText } from "strings";
	import OpenGraph from "../../../components/OpenGraph.svelte";
	import Inspector from "../../../components/Inspector/index.svelte";

	interface Extra {
		chars: CharMap;
		sequences: SequenceInfo[];
	}

	export let sequence: SequenceInfo;
	export let extra: Extra;

	$: string = StringBlob.stringDecode(Encoding.Utf8, sequence.text);
</script>

<!-- prettier-ignore -->
<OpenGraph
		title="{sequence.name} - Sequences - Unicode Visualizer"
		description="View the breakdown of the {sequence.name} Unicode named sequence."
		url="/sequences/{sequence.slug}" />

<h1>{sequence.name}</h1>
<h2>{getDisplayText(`sequenceType.${sequence.type}`)}</h2>

<Inspector {string} {extra} />
