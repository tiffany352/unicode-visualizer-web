<script lang="typescript">
	import type { Grapheme } from "model/StringBlob";
	import type { SequenceInfo, CharMap } from "server/Unicode";

	interface Extra {
		chars: CharMap;
		sequences: SequenceInfo[];
	}

	export let grapheme: Grapheme;
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
