<script lang="typescript">
	import type { Grapheme } from "model/StringBlob";
	import type { CharMap } from "server/UnicodeXml";
	import type { NamedSequence } from "server/UnicodeParser";

	interface Extra {
		chars: CharMap;
		sequences: NamedSequence[];
	}

	export let grapheme: Grapheme;
	export let extra: Extra | null = null;

	function findSequence() {
		if (!extra) {
			return null;
		}

		const sequence = extra.sequences.find(
			(seq) => seq.sequence == grapheme.text
		);

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
