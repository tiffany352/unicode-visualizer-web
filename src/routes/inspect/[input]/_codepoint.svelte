<script lang="typescript">
	import type { CodepointInfo } from "model/StringBlob";
	import type { CharMap } from "server/UnicodeXml";
	import type { NamedSequence } from "server/UnicodeParser";

	interface Extra {
		chars: CharMap;
		sequences: NamedSequence[];
	}

	export let codepoint: CodepointInfo;
	export let extra: Extra | null = null;

	function aliasOf(value: number) {
		// This code assumes that any character that has an
		// abbreviation, should be displayed abbreviated.
		if (extra) {
			const char = extra.chars[value.toString(16)];
			if (char && char.type == "char") {
				const alias = char.aliases.find(
					(alias) => alias.type == "abbreviation"
				);
				if (alias) {
					return alias.alias;
				}
			}
		}

		return null;
	}

	$: alias = (codepoint.value && aliasOf(codepoint.value)) || null;
</script>

<style>
	.preview {
		font-size: 1.2em;
		white-space: pre;
	}

	.alias {
		color: rgb(100, 100, 100);
		font-size: 1rem;
	}

	.scalar {
		font: var(--mono-font);
		font-size: 80%;
	}
</style>

{#if codepoint.value}
	<div class="preview">
		{#if alias}
			<span class="alias">{alias}</span>
		{:else}{String.fromCodePoint(codepoint.value || 0)}{/if}
	</div>
	<div class="scalar">
		U+{codepoint.value.toString(16).padStart(4, '0').toUpperCase()}
	</div>
{:else}
	<div class="preview">�</div>
	<div class="scalar">{codepoint.text || 'Invalid'}</div>
{/if}
