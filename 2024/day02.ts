import { assertEquals } from 'jsr:@std/assert';
import { getLines, pairwise, sum } from './utils.ts';

function isSafe(data: number[]): boolean {
  const pairs = pairwise(data);
  let direction = 0;
  for (let [p1, p2] of pairs) {
    const diff = p1 - p2;
    if (Math.abs(diff) > 3 || Math.abs(diff) < 1) {
      return false;
    }
    if (direction == 0) {
      direction = Math.sign(diff);
    }
    if (Math.sign(diff) !== direction) {
      return false;
    }
  }
  return true;
}

function isSafeDampened(data: number[]): boolean {
  if (isSafe(data)) {
    return true;
  }
  for (let i = 0; i < data.length; i++) {
    if (isSafe(data.filter((_,ix) => i != ix))) {
      return true;
    }
  }
  return false;
}

export function part1(input: string) {
  return getLines(input).map(l => l.split(' ').map(d => parseInt(d, 10))).filter(d => isSafe(d)).length;
}

export function part2(input: string) {
  return getLines(input).map(l => l.split(' ').map(d => parseInt(d, 10))).filter(d => isSafeDampened(d)).length;
}


const sampleInput = `
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9
`.trim();

Deno.test("is safe", () => {

 assertEquals(isSafe([7, 6, 4, 2, 1]), true);
 assertEquals(isSafe([1, 2, 7, 8, 9]), false);
 assertEquals(isSafe([9, 7, 6, 2, 1]), false);
 assertEquals(isSafe([1, 3, 2, 4, 5]), false);
 assertEquals(isSafe([8, 6, 4, 4, 1]), false);
 assertEquals(isSafe([1, 3, 6, 7, 9]), true);
 assertEquals(isSafe([2, 3, 6, 7, 9, 13]), false);
 assertEquals(isSafe([1,2,2,3]), false);
});

Deno.test("is safe dampened", () => {
 assertEquals(isSafeDampened([7, 6, 4, 2, 1]), true);
 assertEquals(isSafeDampened([1, 2, 7, 8, 9]), false);
 assertEquals(isSafeDampened([9, 7, 6, 2, 1]), false);
 assertEquals(isSafeDampened([1, 3, 2, 4, 5]), true);
 assertEquals(isSafeDampened([8, 6, 4, 4, 1]), true);
 assertEquals(isSafeDampened([1, 3, 6, 7, 9]), true);
});

Deno.test("part1", async () => {
  assertEquals(part1(sampleInput), 2);
});

Deno.test("part2", async () => {
  assertEquals(part2(sampleInput), 4);
});
