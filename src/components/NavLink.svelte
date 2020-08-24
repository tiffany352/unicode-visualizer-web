<script lang="typescript">
	export let segment: string;
	export let href: string;
	export let closeMenu: () => void;

	$: current =
		(href == "." ? segment === undefined : segment == href) || undefined;
</script>

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

<a aria-current={current} {href} on:click={closeMenu}>
	<slot />
</a>
