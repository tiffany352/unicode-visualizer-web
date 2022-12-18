<script lang="ts" context="module">
	import type { CharInfo } from "$lib/server/Unicode";

	export async function preload(this: any, page: any, session: any) {
		const { id } = page.params;
		const response: Response = await this.fetch(`codepoint/${id}.json`);
		if (response.status == 200) {
			const char: CharInfo = await response.json();
			this.redirect(301, `codepoint/${char.slug}`);
		} else {
			this.error(response.status, response.statusText);
		}
	}
</script>
