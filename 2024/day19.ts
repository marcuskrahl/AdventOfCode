import { assertEquals } from 'jsr:@std/assert';
import { getLines, sum } from './utils.ts';

const memo: {[key: string]: boolean} = {};
const memo2: {[key: string]: number} = {};

function isPossible(design: string, towels: string[]): boolean {
  if (design === '') {
    return true;
  }
  if (memo[design] != undefined) {
    return memo[design];
  }
  const result =  towels.some(t => design.startsWith(t) && isPossible(design.slice(t.length), towels));
  memo[design] = result;
  return result;
}

function availableDesigns(design: string, towels: string[]): number {
  if (design === '') {
    return 1;
  }
  if (memo2[design] != undefined) {
    return memo2[design];
  }
  const result =  sum(towels.map(t => design.startsWith(t) ? availableDesigns(design.slice(t.length), towels): 0));
  memo2[design] = result;
  return result;
}

export function part1(input: string) {
  const lines = getLines(input);
  const towels = lines[0].split(', ');
  const designs  =lines.slice(2);

  return designs.filter(d => isPossible(d,towels)).length;
}

export function part2(input: string) {
  const lines = getLines(input);
  const towels = lines[0].split(', ');
  const designs  =lines.slice(2);

  return sum(designs.map(d => availableDesigns(d,towels)));
}


const sampleInput = `
r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb
`.trim();

Deno.test("part1", async () => {
  assertEquals(part1(sampleInput), 6);
});

Deno.test("part2", async () => {
  assertEquals(part2(sampleInput), 16);
});
