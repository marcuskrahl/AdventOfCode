import { assertEquals } from 'jsr:@std/assert';
import { Grid, parseGrid, transpose, unique } from './utils.ts'

type Antenna = { x: number, y: number, frequency: string};

function getAntennas(grid: Grid<string>): Antenna[] {
  const antennas: Antenna[] = [];
  for (let x =0; x < grid.length; x++) {
    for (let y = 0; y < grid[0].length; y++) {
      if (grid[x][y] !== '.') {
        antennas.push({x,y, frequency: grid[x][y]}) 
      }
    }
  }
  return antennas;
}

function getFrequencyInferences(antennas: Antenna[], width: number, height: number, deep: boolean): {x: number, y: number}[] { 
  const result: {x: number, y: number}[] = [];
  for (let i = 0; i < antennas.length; i++) {
    for(let j = i+1; j < antennas.length; j++) {
        const a1 = antennas[i];
        const a2 = antennas[j];
        const diffX = a2.x - a1.x;
        const diffY = a2.y - a1.y;
        let p1x = a1.x - diffX;
        let p1y = a1.y - diffY;
        let p2x = a2.x + diffX;
        let p2y = a2.y + diffY;
        if (deep) {
          result.push({x: a1.x, y: a1.y});
          result.push({x: a2.x, y: a2.y});
          while (p1x >= 0 && p1x < width && p1y >= 0 && p1y < height) {
            result.push({x: p1x, y: p1y});
            p1x -= diffX;
            p1y -= diffY;
          } 
          while (p2x >= 0 && p2x < width && p2y >= 0 && p2y < height) {
            result.push({x: p2x, y: p2y});
            p2x += diffX;
            p2y += diffY;
          } 
        } else {
          if (p1x >= 0 && p1x < width && p1y >= 0 && p1y < height) {
            result.push({x: p1x, y: p1y});
          }
          if (p2x >= 0 && p2x < width && p2y >= 0 && p2y < height) {
            result.push({x: p2x, y: p2y});
          }
        }
    }
  }
  return result;
}

function getInferences(antennas: Antenna[], width: number, height: number, deep: boolean = false): {x: number, y: number}[] {
  const frequencies = unique(antennas.map(a => a.frequency)); 
  return unique(frequencies.flatMap(f => getFrequencyInferences(antennas.filter(a => a.frequency === f), width, height, deep)), (p1, p2) => p1.x === p2.x && p1.y === p2.y);
}

export function part1(input: string) {
  const grid = transpose(parseGrid(input));
  const antennas = getAntennas(grid);
  const inferences = getInferences(antennas, grid.length, grid[0].length);
  return inferences.length;
}

export function part2(input: string) {
  const grid = transpose(parseGrid(input));
  const antennas = getAntennas(grid);
  const inferences = getInferences(antennas, grid.length, grid[0].length, true);
  return inferences.length;
}


const sampleInput = `
............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............
`.trim();

Deno.test("part1", async () => {
  assertEquals(part1(sampleInput), 14);
});

Deno.test("part2", async () => {
  assertEquals(part2(sampleInput), 34);
});
