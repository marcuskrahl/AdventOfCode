import { assertEquals } from 'jsr:@std/assert';
import { sum } from './utils.ts';


function isValidId(n: number, allowedSubdivisions: number): boolean {
  const str = n.toString();
  for (let i = 2; i <= allowedSubdivisions && i <= str.length; i++) {
    if (str.length % i !== 0) {
      continue;
    }
    const patternLength = str.length / i;
    const expectedPattern = str.slice(0, patternLength);
    let repeating = true;
    for (let j = 1; j < i; j++) {
      const myPattern = str.slice(j * patternLength, (j +1) * patternLength);
      if (expectedPattern !== myPattern) {
        repeating = false;
        break;
      }
    }
    if (repeating) {
      return false;
    }
  }
  return true;
}

function invalidIds(rangeStart:number, rangeEnd: number, allowedSubdivisions:number): number { 
  let result = 0;
  for (let p = rangeStart; p <= rangeEnd; p++) {
    result += isValidId(p, allowedSubdivisions) ? 0 : p;
  }
  return result;
}

export function part1(input: string) {
  const ranges = input.split(',').map(r => r.split('-').map(s => parseInt(s, 10)));
  return sum(ranges.map(r => invalidIds(r[0],r[1], 2)));
}

export function part2(input: string) {
  const ranges = input.split(',').map(r => r.split('-').map(s => parseInt(s, 10)));
  return sum(ranges.map(r => invalidIds(r[0],r[1], Number.MAX_SAFE_INTEGER)));
}


const sampleInput = `
11-22,95-115,998-1012,1188511880-1188511890,222220-222224,
1698522-1698528,446443-446449,38593856-38593862,565653-565659,
824824821-824824827,2121212118-2121212124
`.replace(/\s+/g,'').trim();

Deno.test("part1", async () => {
  assertEquals(part1(sampleInput), 1227775554);
});

Deno.test("part2", async () => {
  assertEquals(part2(sampleInput), 4174379265);
});
