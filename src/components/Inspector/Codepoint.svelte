<script lang="typescript">
	import type { CodepointInfo } from "model/StringBlob";
	import type { CharMap, CharInfo, SequenceInfo } from "server/Unicode";
	import { getDisplayText } from "strings";

	interface Extra {
		chars: CharMap;
		sequences: SequenceInfo[];
	}

	export let codepoint: CodepointInfo;
	export let extra: Extra | null = null;

	function getChar(value: number | null) {
		if (extra && value) {
			const char = extra.chars[value.toString(16)];
			if (char && char.type == "char") {
				return char;
			}
		}
		return null;
	}

	function aliasOf(char: CharInfo | null) {
		// This code assumes that any character that has an
		// abbreviation, should be displayed abbreviated.
		if (char && char.type == "char") {
			const alias = char.aliases.find((alias) => alias.type == "abbreviation");
			if (alias) {
				return alias.alias;
			}
		}

		return null;
	}

	function createUrl(char: CharInfo | null) {
		if (char && char.type == "char") {
			return `codepoint/${char.slug}`;
		}
		if (codepoint.value) {
			const cp = codepoint.value.toString(16).padStart(4, "0").toUpperCase();
			return `codepoint/${cp}-unicode`;
		}
		return "";
	}

	function tooltipOf(char: CharInfo | null) {
		if (!char && codepoint.value) {
			return `U+${codepoint.value.toString(16).padStart(4, "0").toUpperCase()}`;
		} else if (!char) {
			return codepoint.text || "";
		}
		if (char.type == "char") {
			return `U+${char.codepointStr} ${char.name}`;
		} else {
			return getDisplayText(char.reason);
		}
	}

	$: char = getChar(codepoint.value);
	$: alias = aliasOf(char);
	$: url = createUrl(char);
	$: tooltip = tooltipOf(char);
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

	.cell {
		padding: 0.25em;
	}

	a {
		text-decoration: none;
		display: block;
	}

	a:hover,
	a:focus {
		background-color: rgb(241, 248, 255);
	}
</style>

{#if codepoint.value}
	<a href={url} class="cell" title={tooltip}>
		<div class="preview">
			{#if alias}
				<span class="alias">{alias}</span>
			{:else}{String.fromCodePoint(codepoint.value || 0)}{/if}
		</div>
		<div class="scalar">
			U+{codepoint.value.toString(16).padStart(4, '0').toUpperCase()}
		</div>
	</a>
{:else}
	<div class="cell" title={tooltip}>
		<div class="preview">�</div>
		<div class="scalar">Invalid</div>
	</div>
{/if}
