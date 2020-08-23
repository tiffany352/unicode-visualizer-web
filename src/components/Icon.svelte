<script lang="typescript">
	export let icon: string = "search";
</script>

<style>
	svg {
		stroke: currentColor;
		fill: none;
	}
</style>

<svg width="24" height="24">
	<use href="icons/{icon}.svg#{icon}" />
</svg>
