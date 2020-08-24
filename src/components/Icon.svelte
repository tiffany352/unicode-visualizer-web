<script lang="typescript">
	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

	export let icon: string = "search";
</script>

<style>
	svg {
		stroke: currentColor;
		stroke-width: 2px;
		fill: none;
		vertical-align: bottom;
	}
</style>

<svg width="24" height="24">
	<use href="icons/{icon}.svg#{icon}" />
</svg>
