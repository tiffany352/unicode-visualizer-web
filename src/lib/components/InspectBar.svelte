<!-- This Source Code Form is subject to the terms of the Mozilla Public
 !-- License, v. 2.0. If a copy of the MPL was not distributed with this
 !-- file, You can obtain one at http://mozilla.org/MPL/2.0/. -->
<script lang="ts">
	import { goto } from "$app/navigation";
	import InputBar from "./InputBar.svelte";
	import StringBlob, { Encoding } from "$lib/model/StringBlob";

	let query: string = "";

	function onSubmit() {
		const string = StringBlob.stringDecode(Encoding.Utf8, query);
		goto(`inspect/${string.urlEncode()}`);
	}
</script>

<InputBar on:submit={onSubmit} icon="terminal" bind:query />
