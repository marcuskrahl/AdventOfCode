import { assertEquals } from 'jsr:@std/assert';
import { Grid, parseGrid, reduceGrid, sum, transpose, tryGetCoordinate } from './utils.ts';

type Plot = {x: number, y: number}[];


function floodFill(x:number, y:number, grid: Grid<string>, target: string): Plot {
  //console.log("fill", x,y);
  grid[x][y] = '.';
  const results: Plot = [];
  results.push({x,y});
  if (tryGetCoordinate(grid,x-1,y) === target) {
    results.push(...floodFill(x-1, y, grid, target));
  }
  if (tryGetCoordinate(grid,x+1,y) === target) {
    results.push(...floodFill(x+1, y, grid, target));
  }
  if (tryGetCoordinate(grid,x,y-1) === target) {
    results.push(...floodFill(x, y-1, grid, target));
  }
  if (tryGetCoordinate(grid,x,y+1) === target) {
    results.push(...floodFill(x, y+1, grid, target));
  }
  return results;
} 

function getPlots(grid: Grid<string>): Plot[] {
  let allPoints = reduceGrid(grid, (acc, x,y) => [...acc, {x,y}], [] as {x: number, y:number}[]);
  let plots: Plot[] = [];
  while(allPoints.length > 0 ) {
      const start = allPoints.shift()!;
      //console.log(start);
      const plot = floodFill(start.x, start.y, grid, grid[start.x][start.y])
      //console.log(plot);
      allPoints = allPoints.filter(({x,y}) => !plot.some(p => p.x === x && p.y === y));
      plots.push(plot);
  }
  return plots;
}

function getArea(plot: Plot): number {
  return plot.length;
}

function getCircumference(plot: Plot): number {
  return sum(plot.map(({x,y}) => {
    let sum = 0;
    if (!plot.some((p) => p.x === x && p.y ===y  - 1)) {
      sum += 1;
    }
    if (!plot.some((p) => p.x === x && p.y ===y  + 1)) {
      sum += 1;
    }
    if (!plot.some((p) => p.x === x -1 && p.y ===y)) {
      sum += 1;
    }
    if (!plot.some((p) => p.x === x +1 && p.y ===y)) {
      sum += 1;
    }
    return sum;
  }));
}

export function part1(input: string) {
  const grid = transpose(parseGrid(input))
  const plots = getPlots(grid);
  return sum(plots.map(p => getArea(p) * getCircumference(p)));
}

function getSides(plot: Plot): number {
  const sideParts = plot.flatMap(({x,y}) => {
    let parts: {type:string, x: number, y:number}[] = [];
    if (!plot.some((p) => p.x === x && p.y ===y  - 1)) {
      parts.push({type: 'top', x,y});
    }
    if (!plot.some((p) => p.x === x && p.y ===y  + 1)) {
      parts.push({type: 'bottom', x,y});
    }
    if (!plot.some((p) => p.x === x -1 && p.y ===y)) {
      parts.push({type: 'left', x,y});
    }
    if (!plot.some((p) => p.x === x +1 && p.y ===y)) {
      parts.push({type: 'right', x,y});
    }
    return parts;
  });
  const topParts = sideParts.filter(p => p.type === 'top');
  const bottomParts = sideParts.filter(p => p.type === 'bottom');
  const leftParts = sideParts.filter(p => p.type === 'left');
  const rightParts = sideParts.filter(p => p.type === 'right');

  const top = topParts.filter(p => !topParts.some(p2 => p.y === p2.y && p.x === p2.x - 1));
  const bottom = bottomParts.filter(p => !bottomParts.some(p2 => p.y === p2.y && p.x === p2.x + 1));
  const left = leftParts.filter(p => !leftParts.some(p2 => p.x === p2.x && p.y === p2.y - 1));
  const right = rightParts.filter(p => !rightParts.some(p2 => p.x === p2.x && p.y === p2.y + 1));
  
  return top.length + bottom.length + left.length + right.length;
}

export function part2(input: string) {
  const grid = transpose(parseGrid(input))
  const plots = getPlots(grid);
  return sum(plots.map(p => getArea(p) * getSides(p)));
}


const sampleInput = `
RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE
`.trim();

Deno.test("part1", async () => {
  assertEquals(part1(sampleInput), 1930);
});

Deno.test("part2", async () => {
  assertEquals(part2(sampleInput), 1206);
});
