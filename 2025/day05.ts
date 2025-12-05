import { assertEquals } from 'jsr:@std/assert';
import { getLines, sum } from './utils.ts';

function parseInput(input: string): [[number, number][], number[]] {
  const lines = getLines(input);
  const divider = lines.indexOf('');
  const ranges = lines.slice(0, divider).map(l => l.split('-').map(l => parseInt(l, 10)) as [number,number]);
  const ids = lines.slice(divider+1).map(l => parseInt(l, 10));
  return [ranges, ids];
}

function isFresh(id: number, ranges: [number,number][]): boolean {
  return ranges.some(([start, end]) => id >= start && id <= end);
}

export function part1(input: string) {
  const [ranges, ids] = parseInput(input);
  return ids.filter(id => isFresh(id, ranges)).length;
}

function mergeRanges(ranges: [number, number][]): [number, number][] {
  const resultRanges: [number, number][] = [];
  for (let [rStart, rEnd] of ranges) {
    let keep = true;
    for (let i = 0; i<resultRanges.length; i++) {
      let [oStart, oEnd] = resultRanges[i];
      if (rStart > oEnd || rEnd < oStart ) {
        //no overlap
        continue;
      }
      if (rStart >= oStart && rEnd <= oEnd) {
        // inside existing range
        keep = false;
        break;
      }
      if (rStart <= oStart && rEnd >= oEnd) {
        // existing range inside new range - remove old range
        resultRanges.splice(i, 1);
        i--;
        continue;
      }
      if (rStart <= oStart) {
        //trim end of range to existing range start
        rEnd = oStart - 1;
      }
      if (rEnd >= oEnd) {
        //trim start of range to existing range end
        rStart = oEnd + 1;
      }
      if (rEnd < rStart) {
        //range became invalid, drop it
        keep = false; 
        break;
      }
    }
    if (keep) {
      resultRanges.push([rStart, rEnd]);
    }
  }
  return resultRanges;
}

function rangeLength([start, end]: [number, number]): number {
  return end - start + 1;
}

export function part2(input: string) {
    const [ranges] = parseInput(input);
  return sum(mergeRanges(ranges).map(r => rangeLength(r)))
}


const sampleInput = `
3-5
10-14
16-20
12-18

1
5
8
11
17
32
`.trim();

Deno.test("part1", async () => {
  assertEquals(part1(sampleInput), 3);
});

Deno.test("part2", async () => {
  assertEquals(part2(sampleInput), 14);
});
