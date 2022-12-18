<!-- This Source Code Form is subject to the terms of the Mozilla Public
 !-- License, v. 2.0. If a copy of the MPL was not distributed with this
 !-- file, You can obtain one at http://mozilla.org/MPL/2.0/. -->
<script lang="ts">
	export let segment: string;
	export let href: string;
	export let closeMenu: () => void;

	$: current =
		(href == "." ? segment === undefined : segment == href) || undefined;
</script>

<a aria-current={current} {href} on:click={closeMenu}>
	<slot />
</a>

<style>
	a {
		text-decoration: none;
		padding: 0.25em 1em;
		display: block;
		border-left: 4px solid transparent;
	}

	a[aria-current] {
		border-left-color: rgb(255, 62, 0);
	}

	a:hover,
	a:focus {
		text-decoration: underline;
	}
</style>
