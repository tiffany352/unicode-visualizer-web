<script lang="typescript">
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
