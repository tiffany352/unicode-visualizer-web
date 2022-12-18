/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import IntervalTree, { IntervalTreeIterator } from "./IntervalTree";
import Range from "./Range";

/**
 * Uses IntervalTree to store ranges, and a map to store individual
 * values.
 */
export class IntervalMap<T> {
	tree: IntervalTree<T>;
	map: Map<number, T>;

	constructor(input: [Range, T][] = []) {
		const singles: [number, T][] = [];
		const ranges: [Range, T][] = [];

		for (const [range, value] of input) {
			if (range.count() > 1) {
				ranges.push([range, value]);
			} else {
				singles.push([range.first, value]);
			}
		}
		this.tree = new IntervalTree(ranges);
		this.map = new Map(singles);
	}

	get(index: number): T | null {
		return this.map.get(index) || this.tree.get(index);
	}

	add(range: Range, value: T) {
		if (range.count() > 1) {
			this.tree.add(range, value);
		} else {
			this.map.set(range.first, value);
		}
	}

	[Symbol.iterator]() {
		return new IntervalMapIterator(
			this.tree[Symbol.iterator](),
			this.map.entries()
		);
	}
}

export class IntervalMapIterator<T> {
	first: IntervalTreeIterator<T>;
	second: Iterator<[number, T]>;
	firstDone: boolean = false;
	secondDone: boolean = false;

	constructor(first: IntervalTreeIterator<T>, second: Iterator<[number, T]>) {
		this.first = first;
		this.second = second;
	}

	next(): IteratorResult<[Range, T]> {
		if (!this.firstDone) {
			const result = this.first.next();
			this.firstDone = result.done || false;
			return result;
		} else if (!this.secondDone) {
			const result = this.second.next();
			this.secondDone = result.done || false;
			return {
				done: result.done,
				value: [new Range(result.value[0]), result.value[1]],
			};
		} else {
			return {
				done: true,
				value: undefined,
			};
		}
	}
}
