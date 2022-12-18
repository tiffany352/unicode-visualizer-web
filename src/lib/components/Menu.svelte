<!-- This Source Code Form is subject to the terms of the Mozilla Public
 !-- License, v. 2.0. If a copy of the MPL was not distributed with this
 !-- file, You can obtain one at http://mozilla.org/MPL/2.0/. -->
<script lang="ts">
	import Icon from "./Icon.svelte";

	export let title: string = "";
</script>

<nav>
	<button {title} class="button">
		<slot name="button">
			<Icon icon="menu" />
		</slot>
	</button>
	<ul tabindex="-1">
		<slot />
	</ul>
</nav>

<style>
	nav {
		position: relative;
		color: var(--main-text);
	}

	ul {
		visibility: hidden;
		position: absolute;
		left: 0;
		background-color: var(--main-bg);
		box-shadow: 3px 3px 12px 4px rgba(0, 0, 0, 0.2);
		border-radius: 10px;
		padding: 0;
		margin: 0;
		list-style: none;
		width: 10em;
		overflow: hidden;
	}

	nav:focus > ul,
	nav:focus-within > ul {
		visibility: visible;
	}

	ul :global(li > *) {
		font-family: inherit;
		font-size: inherit;
		font-weight: normal;
		display: block;
		text-decoration: none;
		padding: 0.5em;
		border: none;
		border-bottom: 1px solid var(--main-border);
		color: inherit;
		border-radius: inherit;
		background-color: inherit;
		width: 100%;
	}

	ul :global(li > .disabled) {
		color: var(--disabled-text);
	}

	ul :global(a):hover,
	ul :global(a):focus,
	ul :global(button):hover,
	ul :global(button):focus {
		background-color: var(--main-hover);
		color: inherit;
	}

	ul :global(li:last-child a),
	ul :global(li:last-child button) {
		border-bottom: none;
	}
</style>
