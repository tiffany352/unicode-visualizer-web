<script lang="ts">
	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

	import type { SingleCharRef, MultiCharRef } from "$lib/server/Unicode";
	import StringBlob, { Encoding } from "$lib/model/StringBlob";

	export let ref: SingleCharRef | MultiCharRef;
</script>

{#if ref.type == "single"}
	<a href="codepoint/{ref.slug}">
		{ref.text} U+{ref.codepointStr}
		{ref.name}
	</a>
{:else if ref.type == "multi"}
	<a
		href="inspect/{StringBlob.stringDecode(
			Encoding.Utf8,
			ref.text
		).urlEncode()}"
	>
		{ref.text}
	</a>
{/if}
