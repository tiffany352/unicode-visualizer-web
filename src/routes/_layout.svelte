<script lang="typescript" context="module">
	export async function preload(this: any, page: any, session: any) {
		const response: Response = await this.fetch(`version.json`);
		if (response.status == 200) {
			const json = await response.json();
			const version = json.version;
			return { version };
		} else {
			this.error(500, "Unable to fetch version string");
		}
	}
</script>

<script lang="typescript">
	import Nav from "../components/Nav.svelte";

	export let segment: string;
	export let version: string;
</script>

<style>
	main {
		position: relative;
		max-width: 56em;
		background-color: white;
		padding: 2em;
		margin: 0 auto;
		box-sizing: border-box;
	}

	@media screen and (max-width: 500px) {
		main {
			padding: 0.25em;
		}
	}

	hr {
		border: none;
		border-bottom: 1px solid rgb(200, 200, 200);
	}
</style>

<Nav {segment} />

<main>
	<slot />

	<hr />

	<span>Data sourced from {version}.</span>
</main>
