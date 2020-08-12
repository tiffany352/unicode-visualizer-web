import Saxophone, {
	TagOpenNode,
	TagCloseNode,
	TextNode,
	Attributes,
} from "saxophone";

export interface NamedSequence {
	sequence: string;
	name: string;
}

export interface Block {
	first: number;
	last: number;
	name: string;
}

export interface NameAlias {
	alias: string;
	type:
		| "abbreviation"
		| "alternate"
		| "control"
		| "correction"
		| "figment"
		| string;
}

export interface CharSet {
	first: number;
	last: number;
	group: Attributes | null;
	attrs: Attributes;
	aliases?: NameAlias[];
}

export interface Result {
	description: string;
	blocks: Block[];
	chars: CharSet[];
	sequences: NamedSequence[];
}

type Tag = string;

export class UnicodeParser {
	sax: Saxophone;
	stack: Tag[] = [];
	current: Tag = "root";

	description: string = "";
	repertoire = [];
	blocks: Block[] = [];
	group: Attributes | null = null;
	chars: CharSet[] = [];
	char: CharSet | null = null;
	sequences: NamedSequence[] = [];

	constructor() {
		this.sax = new Saxophone();

		this.sax.on("tagopen", this.tagopen);
		this.sax.on("tagclose", this.tagclose);
		this.sax.on("text", this.text);
	}

	finish(): Result {
		const { description, blocks, chars, sequences } = this;
		return {
			description,
			blocks,
			chars,
			sequences,
		};
	}

	static parse(input: Buffer | string): Result {
		const self = new UnicodeParser();
		self.sax.parse(input);
		return self.finish();
	}

	parseCode(input: string | undefined): number {
		return parseInt(input || "0", 16);
	}

	parseCodeList(input: string | undefined): string {
		return (input || "")
			.split(" ")
			.map((str) => parseInt(str, 16))
			.join("");
	}

	parseBool(input: string): boolean {
		return input == "Y";
	}

	enter(tag: Tag) {
		this.stack.push(this.current);
		this.current = tag;
	}

	leave() {
		switch (this.current) {
			case "group":
				this.group = null;
				break;
			case "char":
				this.char = null;
				break;
		}

		this.current = this.stack.pop() || "root";
	}

	tagopen = (tag: TagOpenNode) => {
		this.enter(tag.name);

		let attrs;

		switch (tag.name) {
			case "block":
				attrs = Saxophone.parseAttrs(tag.attrs);
				this.blocks.push({
					first: this.parseCode(attrs["first-cp"]),
					last: this.parseCode(attrs["last-cp"]),
					name: attrs["name"] || "",
				});
				break;
			case "named-sequence":
				attrs = Saxophone.parseAttrs(tag.attrs);
				this.sequences.push({
					sequence: this.parseCodeList(attrs["cps"]),
					name: attrs["name"] || "",
				});
				break;
			case "group":
				this.group = Saxophone.parseAttrs(tag.attrs);
				break;
			case "char":
				attrs = Saxophone.parseAttrs(tag.attrs);
				let first, last;
				if (attrs["cp"]) {
					first = last = this.parseCode(attrs["cp"]);
				} else {
					first = this.parseCode(attrs["first-cp"]);
					last = this.parseCode(attrs["last-cp"]);
				}
				this.char = {
					first,
					last,
					group: this.group,
					attrs,
				};
				this.chars.push(this.char);
				break;
			case "name-alias":
				if (this.char) {
					const attrs = Saxophone.parseAttrs(tag.attrs);
					this.char.aliases = this.char.aliases || [];
					const alias = attrs["alias"];
					const type = attrs["type"];
					if (alias && type) {
						this.char.aliases.push({
							alias,
							type,
						});
					}
				}
				break;
		}

		if (tag.isSelfClosing) {
			this.leave();
		}
	};

	tagclose = (tag: TagCloseNode) => {
		this.leave();
	};

	text = (node: TextNode) => {
		switch (this.current) {
			case "description":
				this.description += Saxophone.parseEntities(node.contents);
		}
	};
}
