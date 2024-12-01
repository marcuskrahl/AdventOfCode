import { assertEquals } from 'jsr:@std/assert';
import { getLines, sum } from './utils.ts';

export function part1(input: string) {
  const inputs = getLines(input).map(s => s.split(' ').filter(i => i !== '').map(i => +i)).filter(i => i.length > 0);
  const firstMatches = inputs.map(([i,_])=> i).sort((a,b) => a-b);
  const secondMatches = inputs.map(([_,i])=> i).sort((a,b) => a-b);
  const differences = firstMatches.map((f, i) => Math.abs(f - secondMatches[i]));
  return sum(differences);

}

function count(inp: number[]):  {[key: number]: number} {
let result: {[key:number]: number} = {};
  inp.forEach((i) => {
    result[i] = (result[i] ?? 0) + 1
  })
return result;
}

export function part2(input: string) {
  const inputs = getLines(input).map(s => s.split(' ').filter(i => i !== '').map(i => +i)).filter(i => i.length > 0);
  const firstMatches = inputs.map(([i,_])=> i);
  const secondMatches = inputs.map(([_,i])=> i);
  const counts = count(secondMatches);
  const scores = firstMatches.map(f => (counts[f] ?? 0) * f);
  return sum(scores);

}


const sampleInput = `
3   4
4   3
2   5
1   3
3   9
3   3
`.trim();

Deno.test("part1", async () => {
  assertEquals(part1(sampleInput), 11);
});

Deno.test("part2", async () => {
  assertEquals(part2(sampleInput), 31);
});
