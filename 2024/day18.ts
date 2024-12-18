import { assertEquals } from 'jsr:@std/assert';
import { getLines, getNeighbors, Grid, mapGrid, newGrid, printGrid } from './utils.ts';

type DijkstraNode = {
  distance: number,
  predecessor: DijkstraNode | undefined,
  visited: boolean
}

function findMinNode(grid: Grid<DijkstraNode>): [number, number] {
  let minX = -1;
  let minY = -1;
  let minV = 999999;
  for(let x = 0; x < grid.length; x++) {
    for (let y =0; y<grid.length; y++) {
      if (grid[x][y] .visited === false && grid[x][y].distance < minV) {
        minX = x;
        minY = y;
        minV = grid[x][y].distance;
      }
    }
  }
  return [minX,minY];
};

function shortestPath(grid: Grid<number>): number {
  const dijkstraGrid = mapGrid(grid, v => ({ distance: 99999 , predecessor: undefined, visited: v === -1 ? true: false} as DijkstraNode));
  dijkstraGrid[0][0].distance = 0;
  dijkstraGrid[0][0].visited = false;
  while(true) {
    const [xn, yn] = findMinNode(dijkstraGrid);
    if (xn === -1) {
      break;
    } 
    const node = dijkstraGrid[xn][yn]; 
    node.visited = true;
    const neighbors = getNeighbors(dijkstraGrid, xn, yn);
   //console.log(xn,yn, node.distance);
    if (neighbors.n != undefined && neighbors.n.visited === false && neighbors.n.distance > node.distance + 1) {
      neighbors.n.distance = node.distance + 1;
    }
    if (neighbors.s != undefined && neighbors.s.visited === false && neighbors.s.distance > node.distance + 1) {
      neighbors.s.distance = node.distance + 1;
    }
    if (neighbors.w != undefined && neighbors.w.visited === false && neighbors.w.distance > node.distance + 1) {
      neighbors.w.distance = node.distance + 1;
    }
    if (neighbors.e != undefined && neighbors.e.visited === false && neighbors.e.distance > node.distance + 1) {
      neighbors.e.distance = node.distance + 1;
    }
  }
  return dijkstraGrid[grid.length - 1][grid.length - 1].distance;
}

function fillGridWithInput(grid: Grid<number>, input: string[]): void {
  for(let line of input) {
    const [x,y] = line.split(',').map(n => +n);
    grid[x][y] = -1;
  }
}

export function part1(input: string, gridLength: number = 71, bytes: number = 1024) {
  const grid = newGrid(gridLength, gridLength, 0);
  fillGridWithInput(grid, getLines(input).slice(0,bytes)); 
  //printGrid(mapGrid(grid, g => g === -1 ? '#' : '.'));
  return shortestPath(grid);
}

//this can be optimizied - we do not have to do a whole dijkstra run for every new node, but just adapt the rest of the grid if a node falls into the shortest path
export function part2(input: string, gridLength: number = 71, bytes: number = 1024) {
  const grid = newGrid(gridLength, gridLength, 0);
  fillGridWithInput(grid, getLines(input).slice(0,bytes)); 
  for (let line of getLines(input).slice(bytes)) {
    fillGridWithInput(grid, [line]); 
    if (shortestPath(grid) > 1000) {
      return line;
    }
  }
  throw new Error('no blocking patch found');
}


const sampleInput = `
5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0
`.trim();

Deno.test("part1", async () => {
  assertEquals(part1(sampleInput,7, 12), 22);
});

Deno.test("part2", async () => {
  assertEquals(part2(sampleInput, 7, 12), '6,1');
});
