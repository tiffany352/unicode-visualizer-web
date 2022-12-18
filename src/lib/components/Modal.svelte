<script>
	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

	import { createEventDispatcher, onDestroy } from "svelte";

	const dispatch = createEventDispatcher();
	const close = () => dispatch("close");

	let modal;

	const handle_keydown = (e) => {
		if (e.key === "Escape") {
			close();
			return;
		}

		if (e.key === "Tab") {
			// trap focus
			const nodes = modal.querySelectorAll("*");
			const tabbable = Array.from(nodes).filter((n) => n.tabIndex >= 0);

			let index = tabbable.indexOf(document.activeElement);
			if (index === -1 && e.shiftKey) index = 0;

			index += tabbable.length + (e.shiftKey ? -1 : 1);
			index %= tabbable.length;

			tabbable[index].focus();
			e.preventDefault();
		}
	};

	const previously_focused =
		typeof document !== "undefined" && document.activeElement;

	if (previously_focused) {
		onDestroy(() => {
			previously_focused.focus();
		});
	}
</script>

<style>
	.modal-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.3);
	}

	.modal {
		position: absolute;
		left: 50%;
		top: 50%;
		width: calc(100vw - 4em);
		max-width: 32em;
		max-height: calc(100vh - 4em);
		overflow: auto;
		transform: translate(-50%, -50%);
		padding: 1em;
		border-radius: 0.2em;
		background: var(--modal-bg);
		box-shadow: 10px 10px 24px 0px rgba(0, 0, 0, 0.25);
	}

	hr {
		border: none;
		border-bottom: 1px solid var(--main-border);
		margin: 0 -1em;
	}

	.buttons {
		margin-top: 1em;
		display: flex;
		flex-direction: row;
		gap: 0.5em;
	}
</style>

<svelte:window on:keydown={handle_keydown} />

<div class="modal-background" on:click={close} />

<div class="modal" role="dialog" aria-modal="true" bind:this={modal}>
	<slot name="header" />
	<hr />
	<slot />
	<hr />

	<!-- svelte-ignore a11y-autofocus -->
	<div class="buttons">
		<button autofocus on:click={close} class="button">Close</button>
		<slot name="buttons" />
	</div>
</div>
