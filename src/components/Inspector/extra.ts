import type { CharMap, SequenceInfo } from "server/Unicode";

export interface Extra {
	chars: CharMap;
	sequences: SequenceInfo[];
}
