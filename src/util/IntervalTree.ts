import type Range from "./Range";

export class OverlappingRangeError extends Error {}

class Node<T> {
	range: Range;
	value: T;
	left: Node<T> | null = null;
	right: Node<T> | null = null;
	parent: Node<T> | null = null;

	constructor(range: Range, value: T) {
		this.range = range;
		this.value = value;
	}

	setLeft(left: Node<T> | null) {
		this.left = left;
		if (left) {
			left.parent = this;
		}
	}

	setRight(right: Node<T> | null) {
		this.right = right;
		if (right) {
			right.parent = right;
		}
	}

	get(index: number): T | null {
		if (this.range.contains(index)) {
			return this.value;
		}
		if (index < this.range.first && this.left) {
			return this.left.get(index);
		}
		if (index > this.range.last && this.right) {
			return this.right.get(index);
		}
		return null;
	}

	insert(range: Range, value: T) {
		if (range.first > this.range.last) {
			if (this.right) {
				this.right.insert(range, value);
			} else {
				this.right = new Node(range, value);
			}
		} else if (range.last < this.range.first) {
			if (this.left) {
				this.left.insert(range, value);
			} else {
				this.left = new Node(range, value);
			}
		} else {
			throw new OverlappingRangeError(
				`Attempted to insert range with overlapping bounds: ${range} overlaps with existing value ${this.range}`
			);
		}
	}
}

export default class IntervalTree<T> {
	root: Node<T> | null;

	constructor(ranges: [Range, T][] = []) {
		ranges.sort((left, right) => left[0].first - right[0].first);

		const recurse = (start: number, end: number, pivot: number) => {
			if (end - start <= 0) {
				return null;
			}
			const entry = ranges[pivot];

			const node = new Node(entry[0], entry[1]);
			node.setLeft(recurse(start, pivot, Math.floor((start + pivot - 1) / 2)));
			node.setRight(recurse(pivot + 1, end, Math.floor((pivot + 1 + end) / 2)));

			return node;
		};

		this.root = recurse(0, ranges.length, Math.floor(ranges.length / 2));
	}

	get(index: number): T | null {
		if (this.root) {
			return this.root.get(index);
		}
		return null;
	}

	add(range: Range, value: T) {
		if (this.root) {
			this.root.insert(range, value);
		} else {
			this.root = new Node(range, value);
		}
	}

	[Symbol.iterator]() {
		return new IntervalTreeIterator(this.root);
	}
}

export class IntervalTreeIterator<T> implements Iterator<[Range, T]> {
	current: Node<T> | null;

	constructor(root: Node<T> | null) {
		this.current = root;
	}

	next(): IteratorResult<[Range, T]> {
		if (this.current) {
			const value: [Range, T] = [this.current.range, this.current.value];
			if (this.current.left) {
				this.current = this.current.left;
			} else if (this.current.right) {
				this.current = this.current.right;
			} else if (this.current.parent) {
				this.current = this.current.parent.right;
			} else {
				this.current = null;
			}
			return {
				done: false,
				value,
			};
		} else {
			return {
				done: true,
				value: undefined,
			};
		}
	}
}
