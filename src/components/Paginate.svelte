<script lang="typescript">
	import Range from "util/Range";

	export let pages: number;
	export let current: number;
	export let createUrl: (page: number) => string;

	const maxPages = 5;

	function createPageList(current: number, pageCount: number) {
		const all = new Range(1, pageCount);
		const head = new Range(1, maxPages).intersect(all);
		const mid = new Range(current - maxPages, current + maxPages).intersect(
			all
		);
		const tail = new Range(pageCount - maxPages, pageCount).intersect(all);

		const gap1 = head.gap(mid);
		const gap2 = mid.gap(tail);

		const list = [];

		for (let i = 1; i <= pageCount; i++) {
			if (gap1.contains(i)) {
				list.push("...");
				i = gap1.last;
			} else if (gap2.contains(i)) {
				list.push("...");
				i = gap2.last;
			} else {
				list.push(i);
			}
		}

		return list;
	}

	$: pageList = createPageList(current, pages);
</script>

<style>
	nav {
		display: flex;
		flex-direction: row;
		gap: 2px;
		margin: 0.5em;
	}

	a {
		display: block;
		width: 1.75em;
		height: 1.75em;
		border: 1px solid rgb(156, 195, 255);
		text-decoration: none;
		text-align: center;
	}

	a:hover,
	a:focus {
		background-color: rgb(241, 248, 255);
	}

	a[aria-current="page"] {
		font-weight: bold;
	}
</style>

<nav>
	{#each pageList as page}
		{#if typeof page == 'string'}
			⋯
		{:else}
			<a
				href={createUrl(page)}
				aria-current={page == current ? 'page' : undefined}>
				{page}
			</a>
		{/if}
	{/each}
</nav>
