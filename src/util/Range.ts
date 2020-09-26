/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export default class Range {
	first: number;
	last: number;

	constructor();
	constructor(range: Range);
	constructor(single: number);
	constructor(first: number, last: number);

	constructor(arg1?: number | Range, arg2?: number) {
		if (typeof arg1 == "number" && arg2) {
			this.first = arg1;
			this.last = arg2;
		} else if (typeof arg1 == "number") {
			this.first = arg1;
			this.last = arg1;
		} else if (arg1 instanceof Range) {
			this.first = arg1.first;
			this.last = arg1.last;
		} else {
			throw new Error("Invalid arguments");
		}
	}

	overlaps(other: Range): boolean {
		return this.first <= other.last && this.last <= other.first;
	}

	union(other: Range): Range {
		return new Range(
			Math.min(this.first, other.first),
			Math.max(this.last, other.last)
		);
	}

	intersect(other: Range): Range {
		return new Range(
			Math.max(this.first, other.first),
			Math.min(this.last, other.last)
		);
	}

	gap(other: Range): Range {
		return new Range(this.last + 1, other.first - 1);
	}

	count(): number {
		return this.last - this.first + 1;
	}

	toList(): number[] {
		return Array.from(Array(this.count), (_, i) => this.first + i);
	}

	contains(value: number): boolean {
		return this.count() > 0 && value >= this.first && value <= this.last;
	}

	toString(): string {
		return `${this.first}..${this.last}`;
	}

	inspect(): string {
		return `Range(${this.first}..${this.last})`;
	}

	values(): { [Symbol.iterator]: () => RangeIterator } {
		return {
			[Symbol.iterator]: () => new RangeIterator(this),
		};
	}
}

export class RangeIterator implements Iterator<number> {
	current: number;
	last: number;

	constructor(range: Range) {
		this.current = range.first;
		this.last = range.last;
	}

	next(): IteratorResult<number> {
		if (this.current < this.last) {
			const value = this.current;
			this.current += 1;
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
