import { assertEquals } from 'jsr:@std/assert';
import { getLines } from './utils.ts';

type Coord = {x:number, y:number};

function parseCoords(input:string): Coord[] {
  return getLines(input)
    .map(i => i.split(','))
    .map(([x,y]) => ({x: parseInt(x), y: parseInt(y)}));
}

function getMaxArea(coords: Coord[]): number {
  let maxArea = 0;
  for(let i = 0; i< coords.length; i++) {
    for (let j = i+1; j < coords.length; j++) {
      const c1 = coords[i];
      const c2 = coords[j];
      const area = (Math.abs(c1.x - c2.x) + 1) * (Math.abs(c1.y - c2.y) + 1);
      if (area > maxArea) {
        maxArea = area;
      }
    }
  }
  return maxArea;
}

export function part1(input: string) {
  const coords = parseCoords(input);
  return getMaxArea(coords);
}

export function part2(input: string) {
  const coords = parseCoords(input);
  return 0;
}


const sampleInput = `
7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3 
`.trim();

Deno.test("part1", async () => {
  assertEquals(part1(sampleInput), 50);
});

Deno.test("part2", async () => {
  assertEquals(part2(sampleInput), 0);
});
