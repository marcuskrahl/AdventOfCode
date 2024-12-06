import { assertEquals } from 'jsr:@std/assert';
import { Grid, parseGrid, printGrid, transpose, tryGetCoordinate } from './utils.ts';


type LabGrid = Grid<string>;

function walkGuard(grid: LabGrid, x: number, y: number, dirX: number, dirY: number): number {
  const pos: Set<number> = new Set()
  while(true) {
    pos.add(x * 1000 + y);
    const nx  = x + dirX;
    const ny = y + dirY;
    const next = tryGetCoordinate(grid, nx, ny);
    if (next === undefined) {
      return pos.size;
    }
    if (next === '#') {
      const tmp = dirX;
      dirX = -dirY;
      dirY = tmp;
    } else {
      x = nx;
      y = ny;
    }
  }
}

function locationHash(x: number,y: number, dirX: number, dirY: number): number {
    return x * 1_000_000 + y * 1_000 + (dirX + 2) * 10 + (dirY+2);
}

function isLoop(grid: LabGrid, x: number, y: number, dirX: number, dirY: number): boolean {
  const pos: Set<number> = new Set()
  while(true) {
    const hash = locationHash(x, y, dirX, dirY);
    if (pos.has(hash)) {
      return true;
    }
    pos.add(hash)
    const nx  = x + dirX;
    const ny = y + dirY;
    const next = tryGetCoordinate(grid, nx, ny);
    if (next === undefined) {
        return false;
    }
    if (next === '#') {
      const tmp = dirX;
      dirX = -dirY;
      dirY = tmp;
    } else {
      x = nx;
      y = ny;
    }
  }
}

function getStartPos(grid: LabGrid): [number, number] {
  for (let x = 0; x < grid.length; x++) {
      for (let y= 0; y < grid[0].length; y++) {
        if (grid[x][y] === '^') {
          return [x,y];
      }
    }
  }
  throw new Error('start not found');
}


export function part1(input: string) {
  const grid = transpose(parseGrid(input));
  const [x,y] = getStartPos(grid);  
  printGrid(grid);
  return walkGuard(grid,x,y, 0, -1);
}

function getLoopableGrids(grid: LabGrid): number {
  let count = 0;
  const [startX,startY] = getStartPos(grid);  
  for (let x = 0; x < grid.length; x++) {
    for(let y = 0; y < grid[0].length; y++) {
      if (grid[x][y] !== '.') {
          continue;
      }
      grid[x][y] = '#';
      count += isLoop(grid, startX, startY, 0, -1) ? 1 : 0;
      grid[x][y] = '.';
    }
  }
  return count;
}

export function part2(input: string) {
  const grid = transpose(parseGrid(input));
  return getLoopableGrids(grid);
}


const sampleInput = `
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...
`.trim();

Deno.test("part1", async () => {
  assertEquals(part1(sampleInput), 41);
});

Deno.test("part2", async () => {
  assertEquals(part2(sampleInput), 6);
});
