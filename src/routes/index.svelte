<script lang="typescript">
	import StringBlob, { Encoding } from "model/StringBlob";

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

<svelte:head>
	<title>Unicode Visualizer</title>
</svelte:head>

<p>
	This a web tool for inspecting Unicode strings. A naughty string causing a bug
	in your code? Paste it here and it might help you find out why.
</p>

<h2>Browse</h2>
<ul>
	<li>
		<a href="blocks">Codepoints by block</a>
	</li>
	<li>
		<a href="browse/sequences">Named sequences</a>
	</li>
	<li>
		<a href="browse/emoji-sequences">Emoji Sequences</a>
	</li>
	<li>
		<a href="browse/emoji-zwj">Emoji ZWJ Sequences</a>
	</li>
</ul>

<h2>Example queries</h2>
<ul>
	{#each examples as example}
		<li>
			{example.description}:
			<a href={createUrl(example)}>{example.string}</a>
		</li>
	{/each}

	<li>
		Have more? Submit them as issues on{' '}
		<a href="https://github.com/tiffany352/unicode-visualizer-web">GitHub</a>
		!
	</li>
</ul>

<h2>Data Entry</h2>
<p>
	The search bar at the top allows you to conveniently paste in text, but it has
	some limitations. Typically, invalid Unicode gets replaced with
	<code>U+FFFD</code>
	, newlines are stripped out, and the text is converted to UTF-16. These
	widgets let you enter data directly, avoiding any conversion losses.
</p>
<h3>Base-16 Entry</h3>
<p>
	Insert base-16 encoded text in the relevant format. All non-hex characters are
	ignored.
</p>
<!--DataEntry /-->
<h3>Codepoint List Entry</h3>
<p>Insert a list of codepoints. Non-hex characters are used as delimiters.</p>
<!--CodepointEntry /-->
