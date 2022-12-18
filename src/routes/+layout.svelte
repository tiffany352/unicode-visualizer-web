<!-- This Source Code Form is subject to the terms of the Mozilla Public
 !-- License, v. 2.0. If a copy of the MPL was not distributed with this
 !-- file, You can obtain one at http://mozilla.org/MPL/2.0/. -->
<script lang="ts">
	import Nav from "$lib/components/Nav.svelte";
	import Icon from "$lib/components/Icon.svelte";
	import type { PageData } from "./$types";
	import { page } from "$app/stores";

	export let data: PageData;
	let segment = $page.url.pathname;

	let menuExpanded: boolean = false;
</script>

<svelte:head>
	<link
		rel="search"
		type="application/opensearchdescription+xml"
		href="/opensearch.xml"
		title="Search {$page.url.hostname}"
	/>
</svelte:head>

<div class="outer">
	<header id="main-menu" aria-expanded={menuExpanded}>
		<Nav {segment} closeMenu={() => (menuExpanded = false)} />
	</header>

	<!-- svelte-ignore a11y-missing-content -->
	<a
		href="#main-menu-toggle"
		class="backdrop"
		tabindex="-1"
		aria-hidden="true"
		on:click|preventDefault={() => (menuExpanded = false)}
	/>

	<div class="scroll">
		<main>
			<a
				id="main-menu-toggle"
				href="#main-menu"
				class="menu button"
				on:click|preventDefault={() => (menuExpanded = true)}
			>
				<Icon icon="menu" />
				Menu
			</a>

			<slot />

			<hr />

			<span>Data sourced from Unicode {data.version}.</span>
		</main>
	</div>
</div>

<style>
	.outer {
		display: grid;
		grid-template-areas: "sidebar main";
		grid-template-columns: min-content 1fr;
	}

	.scroll {
		grid-area: main;
		overflow-y: auto;
		height: 100vh;
	}

	main {
		position: relative;
		max-width: 56em;
		padding: 2em;
		box-sizing: border-box;
	}

	.menu {
		display: none;
	}

	header {
		grid-area: sidebar;
		height: 100%;
		max-width: 15em;
	}

	.backdrop {
		display: none;
	}

	@media screen and (max-width: 500px) {
		main {
			padding: 0.25em;
		}

		.menu {
			display: inline-block;
		}

		header {
			position: absolute;
			/* display: none; */
			left: -500px;
			top: 0;
			height: 100%;
			overflow-y: scroll;
			overflow-x: visible;
			transition: left 0.3s ease, box-shadow 0.3s ease;
			z-index: 999;
			display: flex;
			flex-direction: row;
		}

		header:target,
		header[aria-expanded="true"] {
			display: flex;
			left: 0;
			outline: none;
			-moz-box-shadow: 3px 0 12px rgba(0, 0, 0, 0.25);
			-webkit-box-shadow: 3px 0 12px rgba(0, 0, 0, 0.25);
			box-shadow: 3px 0 12px rgba(0, 0, 0, 0.25);
		}

		header:target + .backdrop,
		header[aria-expanded="true"] + .backdrop {
			pointer-events: all;
			background-color: rgba(0, 0, 0, 0.25);
		}

		.backdrop {
			display: block;
			position: absolute;
			z-index: 900;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;

			transition: background-color 0.1s ease;
			pointer-events: none;
			background-color: rgba(0, 0, 0, 0);
		}
	}

	hr {
		border: none;
		border-bottom: 1px solid var(--main-border);
	}
</style>
