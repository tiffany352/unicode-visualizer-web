<script lang="ts">
	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

	import StringBlob, { Encoding } from "$lib/model/StringBlob";

	export let codepoint: number;
	export let encoding: Encoding;

	$: string = StringBlob.fromCodepoint(encoding, codepoint);
	$: codeunits = string.getCodeunits();
</script>

{#each codeunits as unit}
	<div class="repr-box">{unit.text}</div>
{/each}
