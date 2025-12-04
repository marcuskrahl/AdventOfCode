import { assertEquals } from 'jsr:@std/assert';
import { getLines, max, sum } from './utils.ts';

function maxJoltage(bank: number[], joltagePlaces: number): number {
  if (joltagePlaces === 0) {
    return 0;
  }
  //console.log(bank, joltagePlaces);
  const maxValue = max(bank.slice(0, joltagePlaces > 1 ? -(joltagePlaces - 1) : bank.length), b => b);
  const maxIndex = bank.indexOf(maxValue);
  return Math.pow(10, joltagePlaces -1) * maxValue + maxJoltage(bank.slice(maxIndex + 1), joltagePlaces - 1);
}

export function part1(input: string) {
  return sum(
    getLines(input).map(line => line.split('').map(l => parseInt(l,10))).map(l => maxJoltage(l,2))
  )
}

export function part2(input: string) {
  return sum(
    getLines(input).map(line => line.split('').map(l => parseInt(l,10))).map(l => maxJoltage(l,12))
  )
}


const sampleInput = `
987654321111111
811111111111119
234234234234278
818181911112111
`.trim();

Deno.test("part1", async () => {
  assertEquals(part1(sampleInput), 357);
});

Deno.test("part2", async () => {
  assertEquals(part2(sampleInput), 3121910778619);
});
