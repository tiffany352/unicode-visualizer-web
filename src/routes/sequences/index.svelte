<script lang="typescript" context="module">
	export async function preload(this: any, page: any, session: any) {
		const response: Response = await this.fetch("sequences.json");
		if (response.status == 200) {
			const sequences: SequenceInfo[] = await response.json();
			return { sequences };
		} else {
			this.error(404, "Couldn't load list of sequences");
		}
	}

	function codepoint(value: number): string {
		return "U+" + (value || 0).toString(16).padStart(4, "0").toUpperCase();
	}
</script>

<script lang="typescript">
	import OpenGraph from "../../components/OpenGraph.svelte";
	import type { SequenceInfo } from "server/Unicode";
	import StringBlob, { Encoding } from "model/StringBlob";

	export let sequences: SequenceInfo[];

	function createUrl(seq: SequenceInfo) {
		const string = StringBlob.stringDecode(Encoding.Utf8, seq.text);
		return `inspect/${string.urlEncode()}`;
	}
</script>

<style>
	.table {
		grid-template-columns: 1fr min-content;
	}
</style>

<OpenGraph
	title="Sequences - Unicode Visualizer"
	description="Browse the named sequences in Unicode." />

<h1>Browse Unicode Named Sequences</h1>

<div class="table">
	{#each sequences as sequence}
		<a href="sequences/{sequence.slug}">
			<div>{sequence.name}</div>
			<div>
				<code>{sequence.text}</code>
			</div>
		</a>
	{/each}
</div>
