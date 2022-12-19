<!-- This Source Code Form is subject to the terms of the Mozilla Public
 !-- License, v. 2.0. If a copy of the MPL was not distributed with this
 !-- file, You can obtain one at http://mozilla.org/MPL/2.0/. -->
<script lang="ts">
	import type { SequenceInfo, CharMap, CharInfo } from "$lib/server/Unicode";
	import StringBlob, { Encoding } from "$lib/model/StringBlob";
	import { getDisplayText } from "$lib/strings";
	import OpenGraph from "$lib/components/OpenGraph.svelte";
	import Inspector from "$lib/components/Inspector/index.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;

	$: string = StringBlob.stringDecode(Encoding.Utf8, data.sequence.text);
</script>

<!-- prettier-ignore -->
<OpenGraph
		title="{data.sequence.name} - Sequences"
		description="View the breakdown of the {data.sequence.name} Unicode named sequence."
		previewText={string.stringEncode()}
		url="/sequences/{data.sequence.slug}" />

<h1>{data.sequence.name}</h1>
<h2>{getDisplayText(`sequenceType.${data.sequence.type}`)}</h2>

<Inspector {string} extra={data.extra} />
