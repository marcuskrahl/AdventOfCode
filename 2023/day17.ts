import {
  Grid,
  getNeighbors,
  mapGrid,
  min,
  parseGrid,
  printGrid,
  transpose,
} from './utils';

interface DijkstraState {
  left: [number, number, number];
  right: [number, number, number];
  up: [number, number, number];
  down: [number, number, number];
}

function moveDirectToNeighbor(
  node: [number, number, number],
  neighbor: [number, number, number],
  heat: number,
): boolean {
  let trackNode = false;
  if (node[0] + heat < neighbor[1]) {
    trackNode = true;
    neighbor[1] = node[0] + heat;
  }
  if (node[1] + heat < neighbor[2]) {
    trackNode = true;
    neighbor[2] = node[1] + heat;
  }
  return trackNode;
}

function moveIndirectNeighbor(
  min: number,
  neighbor: [number, number, number],
  heat: number,
): boolean {
  let trackNode = false;
  min = min + heat;
  if (neighbor[0] > min) {
    neighbor[0] = min;
    neighbor[1] = min;
    neighbor[2] = min;
    trackNode = true;
  } else if (neighbor[1] > min) {
    neighbor[1] = min;
    neighbor[2] = min;
    trackNode = true;
  } else if (neighbor[2] > min) {
    neighbor[2] = min;
    trackNode = true;
  }
  return trackNode;
}

function getMin(
  n1: [number, number, number],
  n2: [number, number, number],
): number {
  return min(n1.concat(n2), (n) => n);
}

function expandNodeToNeighbors(
  grid: Grid<number>,
  dijkstraGrid: Grid<DijkstraState>,
  x: number,
  y: number,
): [number, number][] {
  const neighbors = getNeighbors(dijkstraGrid, x, y);
  const node = dijkstraGrid[x][y];
  if (node == undefined) {
    throw new Error(`node undefined for ${x} ${y}`);
  }
  const trackedNodes: [number, number][] = [];
  if (neighbors.n !== undefined) {
    const heat = grid[x][y - 1];
    const min = getMin(node.left, node.right);
    let t1 = moveDirectToNeighbor(node.up, neighbors.n.up, heat);
    let t2 = moveIndirectNeighbor(min, neighbors.n.up, heat);
    let t3 = moveIndirectNeighbor(min, neighbors.n.up, heat);
    if (t1 || t2 || t3) {
      trackedNodes.push([x, y - 1]);
    }
  }

  if (neighbors.e != undefined) {
    const heat = grid[x + 1][y];
    const min = getMin(node.up, node.down);
    let t1 = moveDirectToNeighbor(node.right, neighbors.e.right, heat);
    let t2 = moveIndirectNeighbor(min, neighbors.e.right, heat);
    let t3 = moveIndirectNeighbor(min, neighbors.e.right, heat);
    if (t1 || t2 || t3) {
      trackedNodes.push([x + 1, y]);
    }
  }
  if (neighbors.s !== undefined) {
    const heat = grid[x][y + 1];
    const min = getMin(node.left, node.right);
    let t1 = moveDirectToNeighbor(node.down, neighbors.s.down, heat);
    let t2 = moveIndirectNeighbor(min, neighbors.s.down, heat);
    let t3 = moveIndirectNeighbor(min, neighbors.s.down, heat);
    if (t1 || t2 || t3) {
      trackedNodes.push([x, y + 1]);
    }
  }
  if (neighbors.w != undefined) {
    const heat = grid[x - 1][y];
    const min = getMin(node.up, node.down);
    let t1 = moveDirectToNeighbor(node.left, neighbors.w.left, heat);
    let t2 = moveIndirectNeighbor(min, neighbors.w.left, heat);
    let t3 = moveIndirectNeighbor(min, neighbors.w.left, heat);
    if (t1 || t2 || t3) {
      trackedNodes.push([x - 1, y]);
    }
  }
  return trackedNodes;
}

function dijkstraMin(state: DijkstraState): number {
  return Math.min(
    getMin(state.up, state.down),
    getMin(state.left, state.right),
  );
}

function shortestPath(grid: Grid<number>): number {
  const dijkstraGrid: Grid<DijkstraState> = mapGrid(grid, () => ({
    left: [
      Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
    ],
    right: [
      Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
    ],
    down: [
      Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
    ],
    up: [
      Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
    ],
  }));
  const nodesToVisit: [number, number][] = [[0, 0]];
  dijkstraGrid[0][0] = {
    left: [0, 0, 0],
    right: [0, 0, 0],
    down: [0, 0, 0],
    up: [0, 0, 0],
  };
  let i = 0;
  while (i++ >= 0) {
    const [x, y] = nodesToVisit.shift() ?? [];

    //console.log(nodesToVisit);
    if (x === undefined || y === undefined) {
      break;
    }
    nodesToVisit.push(...expandNodeToNeighbors(grid, dijkstraGrid, x, y));
  }

  const endNode =
    dijkstraGrid[dijkstraGrid.length - 1][dijkstraGrid[0].length - 1];
  const min1 = getMin(endNode.up, endNode.down);
  const min2 = getMin(endNode.left, endNode.right);
  return Math.min(min1, min2);
}

export function part1(input: string) {
  const grid = mapGrid(transpose(parseGrid(input)), (v) => parseInt(v, 10));
  return shortestPath(grid);
}

export function part2(input: string) {}
