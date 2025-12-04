import { assertEquals } from 'jsr:@std/assert';
import { getNeighbors, Grid, mapGrid, parseGrid, sumGrid, transpose } from './utils.ts';

function canRemove(grid: Grid<string>, x: number,y: number) {
  const v = grid[x][y];
 if (v !== '@') {
      return 0;
    }
    const neighbors = getNeighbors(grid, x,y);
    let sum = 0;
    sum += neighbors.n != undefined && neighbors.n === '@' ? 1 : 0;
    sum += neighbors.ne != undefined && neighbors.ne === '@' ? 1 : 0;
    sum += neighbors.e != undefined && neighbors.e === '@' ? 1 : 0;
    sum += neighbors.se != undefined && neighbors.se === '@' ? 1 : 0;
    sum += neighbors.s != undefined && neighbors.s === '@' ? 1 : 0;
    sum += neighbors.sw != undefined && neighbors.sw === '@' ? 1 : 0;
    sum += neighbors.w != undefined && neighbors.w === '@' ? 1 : 0;
    sum += neighbors.nw != undefined && neighbors.nw === '@' ? 1 : 0;
    if (sum < 4) {
      return 1;
    }
    return 0;
}

export function part1(input: string) {
  const grid = transpose(parseGrid(input))
  return sumGrid(grid, (v,x,y) => {
    return canRemove(grid,x,y) ? 1 : 0;
  });
}

export function part2(input: string) {
  let grid = transpose(parseGrid(input));
  let sum = 0;
  while(true) {
    let didMove = false;
    grid = mapGrid(grid, (v, x,y) => {
      if (canRemove(grid, x,y)) {
        didMove = true;
        sum += 1;
        return '.';
      }
      return v;
    });
    if (!didMove) {
      break;
    }
  }
  return sum;
}


const sampleInput = `
..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.
`.trim();

Deno.test("part1", async () => {
  assertEquals(part1(sampleInput), 13);
});

Deno.test("part2", async () => {
  assertEquals(part2(sampleInput), 43);
});
