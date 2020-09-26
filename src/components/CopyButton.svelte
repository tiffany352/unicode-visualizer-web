<script lang="typescript">
	import { selectText } from "model/Util";
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

<button class="button" on:click={copyText} data-text={text}>
	<Icon icon="copy" />
	Copy
</button>
<span class="copyText" class:success>Copied!</span>

{#if !element}
	<span class="hidden" bind:this={fallbackElement}>{text}</span>
{/if}
