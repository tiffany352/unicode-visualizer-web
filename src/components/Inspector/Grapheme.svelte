<script lang="typescript">
	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

	import type { GraphemeInfo } from "model/StringBlob";
	import type { Extra } from "./extra";

	export let grapheme: GraphemeInfo;
	export let extra: Extra | null = null;

	function findSequence() {
		if (!extra) {
			return null;
		}

		const sequence = extra.sequences.find((seq) => seq.text == grapheme.text);

		if (!sequence) {
			return null;
		}

		return sequence.name;
	}

	$: sequence = findSequence() || "";
</script>

<style>
	.preview {
		font-size: 1.2em;
	}

	.sequence {
		font: var(--mono-font);
	}
</style>

<div class="preview">{grapheme.text}</div>
<div class="sequence">{sequence}</div>
