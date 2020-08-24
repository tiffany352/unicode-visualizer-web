<script lang="typescript">
	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

	import StringBlob, { Encoding } from "model/StringBlob";
	import OpenGraph from "../components/OpenGraph.svelte";
	import Searchbar from "../components/Searchbar.svelte";
	import Icon from "../components/Icon.svelte";
	import InspectBar from "../components/InspectBar.svelte";

	interface Example {
		string: string;
		description: string;
	}

	const examples: Example[] = [
		{
			string: "你好！怎么样？",
			description: "Chinese text, as a basic demo of UTF16/UTF8 encoding",
		},
		{
			string: "참 쉽죠?",
			description: "Korean jamo, a demo of NFC/NFD",
		},
		{
			string: "👩🏾‍🎤",
			description: "Multi-codepoint emoji sequences",
		},
		{
			string: "h̶̶̵͘͞e̵̢ļ̷́p̴̷̡ ̶̡͘͝m̛̛e̸͟͞",
			description: "Zalgo, showing combining diacritics",
		},
		{
			string: "مرحبا بالعالم",
			description: "Arabic, with its cursive script and RTL",
		},
		{
			string: "café vs café",
			description: "Precomposed vs decomposed forms",
		},
		{
			string: "𝕿𝖍𝖊 𝖖𝖚𝖎𝖈𝖐 𝖇𝖗𝖔𝖜𝖓 𝖋𝖔𝖝",
			description: "Compatibility formatting characters",
		},
		{
			string: "జ్ఞ‌ా",
			description: "A string which used to crash iMessage users",
		},
	];

	function createUrl(example: Example): string {
		const urlEncoded = StringBlob.stringDecode(
			Encoding.Utf16,
			example.string
		).urlEncode();
		return `/inspect/${urlEncoded}`;
	}
</script>

<style>
	h1 {
		text-align: center;
		font-weight: 300;
	}

	nav {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	nav a {
		text-decoration: none;
		font-size: 1.2em;
		color: rgb(60, 60, 60);
	}

	nav a:hover,
	nav a:focus {
		text-decoration: underline;
	}
</style>

<OpenGraph
	title="Unicode Visualizer"
	description="A tool for working with Unicode" />

<h1>Unicode Visualizer</h1>

<nav>
	<a href="https://github.com/tiffany352/unicode-visualizer-web">
		<Icon icon="github" />
		GitHub
	</a>
</nav>

<p>
	Unicode Visualizer is a website with information from the Unicode Character
	Database. It also offers a tool that lets you inspect strings and view the
	breakdown of their codepoints and graphemes.
</p>

<p>
	The
	<a href="inspect">inspect page</a>
	lets you paste in any string and learn what it has in it. It can help diagnose
	issues with encodings, Unicode handling in apps, text filter bypasses, and
	other Unicode-related tasks.
</p>

<h2>Search</h2>
<Searchbar />

<h2>Quick Inspect</h2>
<InspectBar />

<h2>Examples</h2>
<ul>
	{#each examples as example}
		<li>
			{example.description}:
			<a href={createUrl(example)}>{example.string}</a>
		</li>
	{/each}

	<!-- prettier-ignore -->
	<li>
		Have more? Submit them as issues on{' '}
		<a href="https://github.com/tiffany352/unicode-visualizer-web">GitHub</a>!
	</li>
</ul>
