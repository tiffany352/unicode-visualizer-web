<script lang="typescript">
	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

	import type { CodepointInfo } from "model/StringBlob";
	import type { CharInfo } from "server/Unicode";
	import { getDisplayText } from "strings";
	import type { Extra } from "./extra";

	export let codepoint: CodepointInfo;
	export let extra: Extra | null = null;
	export let wide: boolean = false;

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
				return alias.text;
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
	$: name = (wide && char && char.name) || null;
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
		height: 100%;
	}

	.wide {
		padding: 0.25em 0.5em;
	}

	.wide > .preview {
		width: 1.8em;
	}

	.wide > div {
		display: inline-block;
	}

	a {
		text-decoration: none;
		display: block;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
	}

	a:hover,
	a:focus {
		background-color: rgb(241, 248, 255);
	}
</style>

{#if codepoint.value}
	<a href={url} class="cell" title={tooltip} class:wide>
		<div class="preview">
			{#if alias}
				<span class="alias">{alias}</span>
			{:else}{String.fromCodePoint(codepoint.value || 0)}{/if}
		</div>
		<div class="scalar">
			U+{codepoint.value.toString(16).padStart(4, '0').toUpperCase()}
			{#if name}{name}{/if}
		</div>
	</a>
{:else}
	<div class="cell" title={tooltip} class:wide>
		<div class="preview">�</div>
		<div class="scalar">Invalid</div>
	</div>
{/if}
