import { assertEquals } from 'jsr:@std/assert';
import { getNeighbors, Grid, mapGrid, parseGrid, sum, transpose, unique } from './utils.ts';

type DijkstraNode = {
  distance: number,
  predecessor: [number, number],
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

function findStartAndEnd(grid: Grid<string>): { startNode: {x: number, y:number}, endNode: {x:number, y:number}} {
  const startNode = {x: -1, y: -1};
  const endNode = {x: -1, y: -1};
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[0].length; y++) {
      if (grid[x][y] === 'S') {
        startNode.x = x;
        startNode.y = y;
      }
      if (grid[x][y] === 'E') {
        endNode.x = x;
        endNode.y = y;
      }
    }
  }

  return { startNode, endNode};
}

type GridResult = { grid: Grid<DijkstraNode>, startNode: {x:number, y:number}, endNode: {x:number, y:number}} 

function shortestPath(grid: Grid<string>): GridResult { 
  const dijkstraGrid = mapGrid(grid, v => ({ distance: 99999 , predecessor: [-1, -1], visited: v === '#' ? true: false} as DijkstraNode));
  const { startNode, endNode } = findStartAndEnd(grid);
  dijkstraGrid[startNode.x][startNode.y].distance = 0;
  dijkstraGrid[startNode.x][startNode.y].visited = false;
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
      neighbors.n.predecessor = [xn,yn];
      
    }
    if (neighbors.s != undefined && neighbors.s.visited === false && neighbors.s.distance > node.distance + 1) {
      neighbors.s.distance = node.distance + 1;
      neighbors.s.predecessor = [xn,yn];
    }
    if (neighbors.w != undefined && neighbors.w.visited === false && neighbors.w.distance > node.distance + 1) {
      neighbors.w.distance = node.distance + 1;
      neighbors.w.predecessor = [xn,yn];
    }
    if (neighbors.e != undefined && neighbors.e.visited === false && neighbors.e.distance > node.distance + 1) {
      neighbors.e.distance = node.distance + 1;
      neighbors.e.predecessor = [xn,yn];
    }
  }
  return { grid: dijkstraGrid, startNode, endNode};
}

export function part1(input: string, cheatThreshold: number = 100) {
  const grid = transpose(parseGrid(input));
  const solvedGrid = shortestPath(grid);
  return possibleCheats2(solvedGrid, cheatThreshold, 2);
}

function possibleCheats2(result: GridResult, cheatThreshold: number, distance: number = 20): number {
  let shortestPath: [number, number][] = [];
  let x = result.endNode.x;
  let y = result.endNode.y; 
  while (x != result.startNode.x || y != result.startNode.y) {
    shortestPath.push([x,y]);
    const [xn,yn] = result.grid[x][y].predecessor;
    x = xn;
    y = yn;
  }
  shortestPath.push([result.startNode.x,result.startNode.y]);
  return sum(shortestPath.map(([x,y]) => {
    let count = 0;
    for (let xo = -distance; xo <= +distance; xo ++) {
      for (let yo = -distance; yo <= +distance; yo++) {
        if (Math.abs(xo) + Math.abs(yo) > distance) {
          continue;
        }
        const xt = x + xo;
        const yt = y + yo;
        if (xt < 0 || yt < 0 || xt >= result.grid.length || yt >= result.grid[0].length) {
          continue;
        }
        const node = result.grid[x][y];
        const target = result.grid[xt][yt];
        if (target.distance >= 99999) {
          continue;
        }
        const cheatDistance = target.distance - node.distance;
        const time = Math.abs(xo) + Math.abs(yo);
        if (cheatDistance - time >= cheatThreshold) {
          count++;
        }
      }
    }
    return count;
  }));
}

export function part2(input: string, cheatThreshold: number = 100) {
  const grid = transpose(parseGrid(input));
  const solvedGrid = shortestPath(grid);
  return possibleCheats2(solvedGrid, cheatThreshold);
}


const sampleInput = `
###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############
`.trim();

Deno.test("part1", async () => {
  assertEquals(part1(sampleInput, 10), 10);
});

Deno.test("part2", async () => {
  assertEquals(part2(sampleInput, 50), 32 + 31 + 29 + 39 + 25 + 23+20 + 19+12+14+12+22+4+3);
});
