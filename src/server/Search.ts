import FlexSearch, { Index } from "flexsearch";
import {
	getAllNotableChars,
	getBlocks,
	getVersions,
	getSequences,
} from "./Unicode";

export interface Link {
	text: string;
	url: string;
}

export interface Page {
	url: string;
	title: string;
	description: string;
	tags?: string;
	links?: Link[];
}

const index: Index<Page> = FlexSearch.create({
	profile: "balance",
	async: true,
	doc: {
		id: "url",
		field: ["title", "description", "tags"],
	},
});

export async function search(query: string): Promise<Page[]> {
	return await index.search(query);
}

console.log("Initializing search engine");

for (const char of getAllNotableChars()) {
	const page: Page = {
		url: `codepoint/${char.slug}`,
		title: `${char.text} U+${char.codepointStr} ${char.name}`,
		description: `Properties of U+${char.codepointStr} ${char.name}, a character in the ${char.block.name} block.`,
		tags: char.tags
			.filter((tag) => tag != "Emoji" && tag != "Emoji_Component")
			.map((tag) => tag.replace("_", " "))
			.join(", "),
		links: [
			{
				text: char.block.name,
				url: `blocks/${char.block.slug}`,
			},
		],
	};
	index.add(page);
}

for (const block of getBlocks()) {
	const page = {
		url: `blocks/${block.slug}`,
		title: block.name,
		description: `Browse characters in the ${block.name} block.`,
	};
	index.add(page);
}

for (const version of getVersions()) {
	const page = {
		url: `versions/${version}/page/1`,
		title: `Unicode ${version}`,
		description: `Browse characters added in Unicode ${version}`,
	};
	index.add(page);
}

for (const seq of getSequences()) {
	const page = {
		url: `sequences/${seq.slug}`,
		title: `${seq.text} ${seq.name}`,
		description: `View the codepoint breakdown of the ${seq.name} sequence.`,
	};
	index.add(page);
}

console.log("Done");
