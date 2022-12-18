<!-- This Source Code Form is subject to the terms of the Mozilla Public
 !-- License, v. 2.0. If a copy of the MPL was not distributed with this
 !-- file, You can obtain one at http://mozilla.org/MPL/2.0/. -->
<script lang="ts">
	import Icon from "./Icon.svelte";
	import NavLink from "./NavLink.svelte";

	export let segment: string;
	export let closeMenu: () => void;
</script>

<nav>
	<h1>Unicode Visualizer</h1>

	<a
		href="#main-menu-toggle"
		id="main-menu-close"
		class="menu-close"
		aria-label="Close main menu"
		on:click|preventDefault={closeMenu}
	>
		<span class="sr-only">Close main menu</span>
		<Icon icon="x" />
	</a>

	<ul>
		<NavLink {segment} {closeMenu} href="/">Home</NavLink>
		<NavLink {segment} {closeMenu} href="/search">Search</NavLink>
		<NavLink {segment} {closeMenu} href="/inspect">Inspect</NavLink>
		<hr />
		<h2>Browse</h2>
		<NavLink {segment} {closeMenu} href="/blocks">Blocks</NavLink>
		<NavLink {segment} {closeMenu} href="/sequences">Sequences</NavLink>
		<NavLink {segment} {closeMenu} href="/versions">Versions</NavLink>
	</ul>
	<div class="spacer" />
</nav>

<style>
	nav {
		border-right: 1px solid rgba(112, 47, 25, 0.562);
		font-weight: 300;
		padding: 2em 2em;
		box-sizing: border-box;
		height: 100%;
		background-color: var(--main-bg);
	}

	ul {
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		justify-content: stretch;
		list-style: none;
	}

	hr {
		width: 100%;
		border: none;
		border-bottom: 1px dotted rgba(112, 47, 25, 0.562);
	}

	.sr-only {
		display: none;
	}

	.menu-close {
		display: none;
		float: right;
	}

	.spacer {
		flex-grow: 1;
	}

	h2 {
		font-size: 1rem;
	}

	@media screen and (max-width: 500px) {
		.menu-close {
			display: block;
		}
	}
</style>
