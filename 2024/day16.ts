import { assertEquals } from 'jsr:@std/assert';
import { parseGrid, transpose, mapGrid, getNeighbors, Grid, min, unique } from './utils.ts';

const EAST = 0;
const SOUTH = 1;
const WEST = 2;
const NORTH = 3;

type Directions = typeof EAST | typeof SOUTH | typeof WEST | typeof NORTH;

const neighborMap = {
  [EAST] : 'e',
  [SOUTH] : 's',
  [WEST] : 'w',
  [NORTH] : 'n',
} as const;

type DijkstraNode = {
  distance: number,
  predecessor: DijkstraNode | undefined,
  visited: boolean
}

function findMinNode(grid: Grid<DijkstraNode[]>): [number, number, Directions] {
  let minX = -1;
  let minY = -1;
  let minD = -1;
  let minV = Number.MAX_SAFE_INTEGER;
  for(let x = 0; x < grid.length; x++) {
    for (let y =0; y<grid.length; y++) {
      for (let d = 0; d < 4; d++) {
        if (grid[x][y][d] .visited === false && grid[x][y][d].distance < minV) {
          minX = x;
          minY = y;
          minD = d;
          minV = grid[x][y][d].distance;
        }
      }
    }
  }
  return [minX,minY, minD as Directions];
};

function shortestPath(grid: Grid<string>): number {
  const dijkstraGrid = mapGrid(grid, (v) => new Array(4).fill(undefined).map(() => ({ distance: Number.MAX_SAFE_INTEGER , visited: v === '#' ? true: false} as DijkstraNode)));
  const startX = 1;
  const startY = grid.length - 2;
  dijkstraGrid[startX][startY][EAST].distance = 0;
  dijkstraGrid[startX][startY][EAST].visited = false;
  while(true) {
    const [xn, yn, dn] = findMinNode(dijkstraGrid);
    if (xn === -1) {
      break;
    } 
    const node = dijkstraGrid[xn][yn][dn]; 
    node.visited = true;
    const neighbors = getNeighbors(dijkstraGrid, xn, yn);
    const neighbor = neighbors[neighborMap[dn]];
    if (neighbor != undefined && neighbor[dn].visited === false && neighbor[dn].distance > node.distance + 1) {
      neighbor[dn].distance = node.distance + 1; 
    }
    const dl = (dn -1 < 0 ? dn +3 : dn - 1) as Directions;
    const dr = ((dn + 1) % 4) as Directions;
  //console.log(xn, yn, dn, dl, dr, node.distance);
    const neighborLeft = dijkstraGrid[xn][yn][dl];
    //console.log(neighborLeft)
    if (neighborLeft != undefined && neighborLeft.visited === false && neighborLeft.distance > node.distance + 1_000) {
      //console.log('set left');
      neighborLeft.distance = node.distance + 1_000; 
    }
    const neighborRight = dijkstraGrid[xn][yn][dr];
    if (neighborRight != undefined && neighborRight.visited === false && neighborRight.distance > node.distance + 1_000) {
      //console.log('set right');
      neighborRight.distance = node.distance + 1_000; 
    }
  }
  return min(dijkstraGrid[grid.length - 2][1], n => n.distance).distance;
}

function shortestPaths(grid: Grid<string>): number {
  const dijkstraGrid = mapGrid(grid, (v) => new Array(4).fill(undefined).map(() => ({ distance: Number.MAX_SAFE_INTEGER , visited: v === '#' ? true: false} as DijkstraNode)));
  const startX = 1;
  const startY = grid.length - 2;
  dijkstraGrid[startX][startY][EAST].distance = 0;
  dijkstraGrid[startX][startY][EAST].visited = false;
  while(true) {
    const [xn, yn, dn] = findMinNode(dijkstraGrid);
    if (xn === -1) {
      break;
    } 
    const node = dijkstraGrid[xn][yn][dn]; 
    node.visited = true;
    const neighbors = getNeighbors(dijkstraGrid, xn, yn);
    const neighbor = neighbors[neighborMap[dn]];
    if (neighbor != undefined && neighbor[dn].visited === false && neighbor[dn].distance > node.distance + 1) {
      neighbor[dn].distance = node.distance + 1; 
    }
    const dl = (dn -1 < 0 ? dn +3 : dn - 1) as Directions;
    const dr = ((dn + 1) % 4) as Directions;
  //console.log(xn, yn, dn, dl, dr, node.distance);
    const neighborLeft = dijkstraGrid[xn][yn][dl];
    //console.log(neighborLeft)
    if (neighborLeft != undefined && neighborLeft.visited === false && neighborLeft.distance > node.distance + 1_000) {
      //console.log('set left');
      neighborLeft.distance = node.distance + 1_000; 
    }
    const neighborRight = dijkstraGrid[xn][yn][dr];
    if (neighborRight != undefined && neighborRight.visited === false && neighborRight.distance > node.distance + 1_000) {
      //console.log('set right');
      neighborRight.distance = node.distance + 1_000; 
    }
  }
  const endNode = dijkstraGrid[grid.length - 2][1];
  const minNode =  min(endNode, n => n.distance);
  const allTiles = getPathTiles(dijkstraGrid, [[grid.length -2,1, endNode.indexOf(minNode)]]);
  return unique(allTiles.map(([x,y]) => [x,y]), ([x1,y1], [x2,y2]) => x1 == x2 && y1 == y2).length;
}

function getOffset(direction: Directions): [number,number] {
  switch(direction) {
    case EAST: return [1,0]
    case SOUTH: return [0,1]
    case WEST: return [-1,0]
    case NORTH: return [0,-1]
  }
}

const uniqueTiles = (tiles: [number,number,number][]) => unique(tiles, ([x1,y1,d1], [x2,y2,d2]) => x1 === x2 && y1 === y2 && d1 === d2);

function  getPathTiles(dijkstraGrid: Grid<DijkstraNode[]>, nodes: [number,number, number][]): [number,number, number][] {
  let nextNodes: [number, number, number][] = [];
  if (nodes.length === 0) {
    return [];
  }
  for (const [x,y, d] of nodes) {
      const node = dijkstraGrid[x][y][d];
      const dp = (((d +2) % 4) as Directions);
      const predecessor = getNeighbors(dijkstraGrid,x,y)[neighborMap[dp]]; 
      if (predecessor![d].distance === node.distance - 1) {
        const [xo,yo] = getOffset(dp)
        nextNodes.push([x+xo, y+yo, d]);
      }
      const dl = (d + 1) % 4;
      const dr = (d + 3) % 4;
      const predecessorLeft = dijkstraGrid[x][y][dl];
      if (predecessorLeft.distance === node.distance - 1000) {
        nextNodes.push([x,y,dl]);
      }
      if (dijkstraGrid[x][y][dr].distance === node.distance - 1000) {
        nextNodes.push([x,y,dp]);
      }

  }
  return [...getPathTiles(dijkstraGrid, uniqueTiles(nextNodes)), ...nodes];
}

export function part1(input: string) {
  const grid = transpose(parseGrid(input));
  return shortestPath(grid);
}

export function part2(input: string) {
  const grid = transpose(parseGrid(input));
  return shortestPaths(grid);
}


const sampleInput = `
###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############
`.trim();

Deno.test("part1", async () => {
  assertEquals(part1(sampleInput), 7036);
});

Deno.test("part2", async () => {
  assertEquals(part2(sampleInput), 45);
});
