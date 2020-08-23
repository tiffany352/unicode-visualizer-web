<script lang="typescript">
	import { goto } from "@sapper/app";
	import Searchbar from "../../components/Searchbar.svelte";

	let query: string = "";
</script>

<h1>Search</h1>

<Searchbar {query} />
