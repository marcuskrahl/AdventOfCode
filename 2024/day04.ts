import { assertEquals } from 'jsr:@std/assert';
import { getCoordinateLoop, Grid, parseGrid, printGrid, sum, sumGrid, tryGetCoordinate } from './utils.ts';


function checkOffset(grid: Grid<string>, x: number, y:number, [xo, yo]: [number, number]): number {
  if(tryGetCoordinate(grid, x + xo, y + yo) !== 'M') {
    return 0;
  }

  if(tryGetCoordinate(grid, x + 2* xo, y + 2* yo) !== 'A') {
    return 0;
  }

  if(tryGetCoordinate(grid, x + 3* xo, y + 3* yo) !== 'S') {
    return 0;
  }
  return 1;
}

function checkGrid(grid: Grid<string>, x: number, y: number): number {
  if (grid[x][y] !== 'X') {
    return  0;
  }
  return sum(([[-1, -1], [0, -1], [1, -1], [-1, 0], [1,0],[-1,1],[0,1],[1,1]] as [number,number][])
    .map(offset => checkOffset(grid, x,y, offset)))
}

export function part1(input: string) {
  const grid = parseGrid(input);
  return sumGrid(grid, (_,x,y) => checkGrid(grid, x,y))
}

function rotate(x:number,y: number): [number, number] {
  return [-y, x];
}

function checkOffsetX(grid: Grid<string>, x: number, y:number, [xo, yo]: [number, number]): number {
  let xv = xo;
  let yv = yo;
  if(tryGetCoordinate(grid, x + xv, y + yv) !== 'M') {
    return 0;
  }

  [xv,yv] = rotate(xv,yv);
  if(tryGetCoordinate(grid, x + xv, y + yv) !== 'M') {
    return 0;
  }

  [xv,yv] = rotate(xv,yv);
  if(tryGetCoordinate(grid, x + xv, y + yv) !== 'S') {
    return 0;
  }

  [xv,yv] = rotate(xv,yv);
  if(tryGetCoordinate(grid, x + xv, y + yv) !== 'S') {
    return 0;
  }

  return 1;
}

function checkGridX(grid: Grid<string>, x: number, y: number): number {
  if (grid[x][y] !== 'A') {
    return  0;
  }
  const s =  sum(([[-1, -1], [1, -1], [-1,1],[1,1]] as [number,number][])
    .map(offset => checkOffsetX(grid, x,y, offset)))
  return s;
}

export function part2(input: string) {
  const grid = parseGrid(input);
  return sumGrid(grid, (_,x,y) => checkGridX(grid, x,y))
}


const sampleInput = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`.trim();

const sample2 = `
MMS
MAS
MSS
`.trim()

Deno.test("part1", async () => {
  assertEquals(part1(sampleInput), 18);
});

Deno.test("part2", async () => {
  assertEquals(part2(sampleInput), 9);
  assertEquals(part2(sample2), 1);
});
