<!-- This Source Code Form is subject to the terms of the Mozilla Public
 !-- License, v. 2.0. If a copy of the MPL was not distributed with this
 !-- file, You can obtain one at http://mozilla.org/MPL/2.0/. -->
<script lang="ts">
	import { selectText } from "$lib/model/Util";
	import Icon from "./Icon.svelte";

	export let text: string;
	export let element: HTMLElement | undefined = undefined;
	let success: boolean = false;
	let fallbackElement: HTMLElement | undefined = undefined;

	function copyText() {
		const elt = element || fallbackElement;
		if (elt) {
			selectText(elt);
		}
		success = false;
		try {
			success = document.execCommand("copy", undefined, text);
		} catch (err) {
			console.log("Unable to copy: ", err);
		}
		setTimeout(() => (success = false), 500);
	}
</script>

<button class="button" on:click={copyText} data-text={text}>
	<Icon icon="copy" />
	Copy
</button>
<span class="copyText" class:success>Copied!</span>

{#if !element}
	<span class="hidden" bind:this={fallbackElement}>{text}</span>
{/if}

<style>
	.copyText {
		color: transparent;
	}

	.copyText.success {
		animation: 0.5s ease-out fadeout;
	}

	.hidden {
		font-size: 0;
	}

	@keyframes fadeout {
		from {
			color: var(--main-text);
		}

		50% {
			color: var(--main-text);
		}

		to {
			color: transparent;
		}
	}
</style>
