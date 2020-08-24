<script lang="typescript">
	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

	import type { CaseMappingFull, CaseMappingSimple } from "server/Unicode";
	import StringBlob, { Encoding } from "model/StringBlob";

	export let mapping: CaseMappingFull | CaseMappingSimple;
</script>

{#if mapping.type == 'simple'}
	<a href="codepoint/{mapping.slug}">
		{mapping.text} U+{mapping.codepointStr} {mapping.name}
	</a>
{:else if mapping.type == 'full'}
	<a
		href="inspect/{StringBlob.stringDecode(Encoding.Utf8, mapping.text).urlEncode()}">
		{mapping.text}
	</a>
{/if}
