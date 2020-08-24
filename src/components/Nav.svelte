<script lang="typescript">
	import Icon from "./Icon.svelte";
	import NavLink from "./NavLink.svelte";

	export let segment: string;
	export let closeMenu: () => void;
</script>

<style>
	nav {
		border-right: 1px solid rgba(112, 47, 25, 0.562);
		font-weight: 300;
		padding: 2em 2em;
		box-sizing: border-box;
		height: 100%;
		background-color: white;
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

	@media screen and (max-width: 500px) {
		.menu-close {
			display: block;
		}
	}
</style>

<nav>
	<h1>Unicode Visualizer</h1>

	<a
		href="#main-menu-toggle"
		id="main-menu-close"
		class="menu-close"
		aria-label="Close main menu"
		on:click|preventDefault={closeMenu}>
		<span class="sr-only">Close main menu</span>
		<Icon icon="x" />
	</a>

	<ul>
		<NavLink {segment} {closeMenu} href=".">Home</NavLink>
		<NavLink {segment} {closeMenu} href="search">Search</NavLink>
		<hr />
		<NavLink {segment} {closeMenu} href="inspect">Inspect</NavLink>
		<NavLink {segment} {closeMenu} href="blocks">Blocks</NavLink>
		<NavLink {segment} {closeMenu} href="sequences">Sequences</NavLink>
		<NavLink {segment} {closeMenu} href="versions">Versions</NavLink>
	</ul>
	<div class="spacer" />
</nav>
