import { assertEquals } from 'jsr:@std/assert';
import {sum } from './utils.ts';

type Stones = {[key: number]: number};

function digits(n: number): number {
  return Math.floor(Math.log10(n))+ 1;
}

function split(n: number): [number, number] {
  const d = digits(n);
  const base10 = Math.pow(10,d / 2);
  const n2 = n % base10;
  const n1 = Math.floor(n / base10);
  return [n1,n2];
}

function blink(stones: Stones): Stones {
  const newStones: Stones = {};
  Object.entries(stones).forEach(([stone, count]) => {
    if (+stone === 0) {
      newStones[1] = (newStones[1] ?? 0) + count;
    } else if (digits(+stone) % 2 === 0) {
      const [n1,n2] = split(+stone);
      newStones[n1] = (newStones[n1] ?? 0) + count;
      newStones[n2] = (newStones[n2] ?? 0) + count;
    } else {
      const n = +stone * 2024;
      newStones[n] = (newStones[n] ?? 0) + count;
    }
  });

  return newStones;
}

export function part1(input: string) {
  let stones: Stones = Object.fromEntries(input.split(' ').map(i => [parseInt(i, 10), 1]));
  for (let i =0 ;i<25; i++) {
   stones = blink(stones); 
  }
  return sum(Object.values(stones));
}

export function part2(input: string) {
  let stones: Stones = Object.fromEntries(input.split(' ').map(i => [parseInt(i, 10), 1]));
  for (let i =0 ;i<75; i++) {
   stones = blink(stones); 
  }
  return sum(Object.values(stones));
}


const sampleInput = `125 17
`.trim();

Deno.test("part1", async () => {
  assertEquals(part1(sampleInput), 55312);
});

Deno.test("digits", () => {
    assertEquals(digits(1), 1);
    assertEquals(digits(10), 2);
    assertEquals(digits(99), 2);
    assertEquals(digits(12345), 5);
});

Deno.test("split", () => {
    assertEquals(split(10), [1,0]);
    assertEquals(split(99), [9,9]);
    assertEquals(split(123456), [123,456]);
});

Deno.test("part2", async () => {
  assertEquals(part2(sampleInput), 65601038650482);
});
