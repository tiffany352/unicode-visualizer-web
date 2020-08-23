<script lang="typescript" context="module">
	export async function preload(this: any, page: any, session: any) {
		const { id, slug } = page.params;
		const response: Response = await this.fetch(
			`codepoint/${id}-${slug}/data.json`
		);
		if (response.status == 200) {
			const char: CharInfo = await response.json();
			return { char };
		} else {
			this.error(
				404,
				`Could not find Unicode codepoint U+${id.toUpperCase()}.`
			);
		}
	}
</script>

<script lang="typescript">
	import type { CharInfo } from "server/Unicode";
	import OpenGraph from "../../../components/OpenGraph.svelte";
	import { getDisplayText } from "strings";

	export let char: CharInfo;
</script>

<style>
	.preview {
		font-size: 3em;
		padding: 10px;
		background-color: rgb(240, 240, 240);
		border: 1px solid rgb(100, 100, 100);
		border-radius: 5px;
		color: rgb(60, 60, 60);
		width: min-content;
		height: min-content;
		min-width: 1em;
		min-height: 1em;
		text-align: center;
	}

	.table {
		grid-template-columns: min-content 1fr;
	}
</style>

<svelte:head>
	{#if char.type == 'char'}
		<!-- prettier-ignore -->
		<OpenGraph
			title="U+{char.codepointStr} {char.name} - Unicode Visualizer"
			description="View the properties of U+{char.codepointStr} {char.name}."
			url="/codepoint/{char.slug}" />
	{:else}
		<!-- prettier-ignore -->
		<OpenGraph
			title="Invalid codepoint"
			description="U+{char.codepointStr} does not refer to a valid Unicode codepoint. {getDisplayText(char.reason)}"
			url="/codepoint/{char.codepointStr}-invalid" />
	{/if}
</svelte:head>

{#if char.type == 'char'}
	<h1>
		<span class="mono">U+{char.codepointStr}</span>
		{char.name}
	</h1>

	<div class="preview">{char.text}</div>

	<h2>Properties</h2>

	<div class="table">
		<div>Appeared</div>
		<div>Unicode {char.age}</div>
		<div>Aliases</div>
		<div>
			{#if char.type == 'char' && char.aliases && char.aliases.length > 0}
				<ul>
					{#each char.aliases as alias}
						<li>{alias.text} ({alias.type})</li>
					{/each}
				</ul>
			{:else}None{/if}
		</div>
		<div>Block</div>
		<div>{char.block}</div>
		<div>Category</div>
		<div>{getDisplayText(`generalCategory.${char.category}`)}</div>
	</div>
{:else}
	<h1>0x{char.codepointStr} Invalid Unicode</h1>

	<p>{getDisplayText(char.reason)}</p>
{/if}
