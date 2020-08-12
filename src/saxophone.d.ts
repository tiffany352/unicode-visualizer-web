import { Writable, Readable } from "stream";

declare module "saxophone" {
	export interface TextNode {
		contents: string;
	}

	export interface CDATANode {
		contents: string;
	}

	export interface CommentNode {
		contents: string;
	}

	export interface ProcessingInstructionNode {
		contents: string;
	}

	export interface TagOpenNode {
		name: string;
		attrs: string;
		isSelfClosing: boolean;
	}

	export interface TagCloseNode {
		name: string;
	}

	export interface Attributes {
		[name: string]: string | undefined;
	}

	export default class Saxophone extends Writable {
		constructor();

		parse(input: Buffer | string): Saxophone;

		static parseAttrs(input: string): Attributes;
		static parseEntities(input: string): string;

		on(event: "text", listener: (node: TextNode) => void): this;
		on(event: "cdata", listener: (node: CDATANode) => void): this;
		on(event: "comment", listener: (node: CommentNode) => void): this;
		on(
			event: "processinginstruction",
			listener: (node: ProcessingInstructionNode) => void
		): this;
		on(event: "tagopen", listener: (node: TagOpenNode) => void): this;
		on(event: "tagclose", listener: (node: TagCloseNode) => void): this;

		on(event: "close", listener: () => void): this;
		on(event: "drain", listener: () => void): this;
		on(event: "error", listener: (err: Error) => void): this;
		on(event: "finish", listener: () => void): this;
		on(event: "pipe", listener: (src: Readable) => void): this;
		on(event: "unpipe", listener: (src: Readable) => void): this;
		on(event: string | symbol, listener: (...args: any[]) => void): this;
	}
}
