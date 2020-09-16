<script lang="typescript">
	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

	import StringBlob, { Encoding } from "model/StringBlob";

	export let codepoint: number;
	export let encoding: Encoding;

	$: string = StringBlob.fromCodepoint(encoding, codepoint);
	$: codeunits = string.getCodeunits();
</script>

<style>
	div {
		display: inline-block;
		padding: 0.25em;
		border: 1px solid var(--main-border);
		font-family: var(--mono-font);
	}
</style>

{#each codeunits as unit}
	<div>{unit.text}</div>
{/each}
