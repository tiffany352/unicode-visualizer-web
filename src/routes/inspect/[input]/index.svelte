<script lang="typescript" context="module">
	export async function preload(page: any, session: any) {
		const { input } = page.params;

		return { input };
	}
</script>

<script lang="typescript">
	import StringBlob from "model/StringBlob";

	export let input: string;

	$: string = StringBlob.urlDecode(input);
	$: graphemes = string.getGraphemes();
</script>

<h1>Inspect</h1>

<ul>
	{#each graphemes as grapheme}
		<li>{grapheme.text}</li>
	{/each}
</ul>
