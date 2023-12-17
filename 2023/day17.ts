import {
  Grid,
  getNeighbors,
  mapGrid,
  min,
  parseGrid,
  printGrid,
  transpose,
  tryGetCoordinate,
} from './utils';

interface DijkstraState {
  left: number;
  right: number;
  up: number;
  down: number;
}

function moveInDirection(
  min: number,
  grid: Grid<number>,
  dijkstraGrid: Grid<DijkstraState>,
  x: number,
  y: number,
  xOffset: number,
  yOffset: number,
  start: number = 1,
  finish: number = 3,
  key: keyof DijkstraState,
): [number, number][] {
  let nodesToTrack: [number, number][] = [];
  let heat = 0;
  for (let i = 1; i <= finish; i++) {
    const xi = x + xOffset * i;
    const yi = y + yOffset * i;
    const heatNode = tryGetCoordinate(grid, xi, yi);
    if (heatNode === undefined) {
      return nodesToTrack;
    }
    heat += heatNode;
    if (i < start) {
      continue;
    }
    let node = tryGetCoordinate(dijkstraGrid, xi, yi);
    if (node != undefined && node[key] > min + heat) {
      node[key] = min + heat;
      nodesToTrack.push([xi, yi]);
    }
  }
  return nodesToTrack;
}

function expandNodeToNeighbors(
  grid: Grid<number>,
  dijkstraGrid: Grid<DijkstraState>,
  x: number,
  y: number,
  start: number,
  finish: number,
): [number, number][] {
  const node = dijkstraGrid[x][y];
  if (node == undefined) {
    throw new Error(`node undefined for ${x} ${y}`);
  }
  return [
    ...moveInDirection(
      Math.min(node.left, node.right),
      grid,
      dijkstraGrid,
      x,
      y,
      0,
      -1,
      start,
      finish,
      'up',
    ),
    ...moveInDirection(
      Math.min(node.left, node.right),
      grid,
      dijkstraGrid,
      x,
      y,
      0,
      1,
      start,
      finish,
      'down',
    ),
    ...moveInDirection(
      Math.min(node.up, node.down),
      grid,
      dijkstraGrid,
      x,
      y,
      -1,
      0,
      start,
      finish,
      'left',
    ),
    ...moveInDirection(
      Math.min(node.up, node.down),
      grid,
      dijkstraGrid,
      x,
      y,
      1,
      0,
      start,
      finish,
      'right',
    ),
  ];
}

function shortestPath(
  grid: Grid<number>,
  start: number,
  finish: number,
): number {
  const dijkstraGrid: Grid<DijkstraState> = mapGrid(grid, () => ({
    left: Number.MAX_SAFE_INTEGER,
    right: Number.MAX_SAFE_INTEGER,
    down: Number.MAX_SAFE_INTEGER,
    up: Number.MAX_SAFE_INTEGER,
  }));
  const nodesToVisit: [number, number][] = [[0, 0]];
  dijkstraGrid[0][0] = {
    left: 0,
    right: 0,
    down: 0,
    up: 0,
  };
  let i = 0;
  while (i++ >= 0) {
    const [x, y] = nodesToVisit.shift() ?? [];

    //console.log(nodesToVisit);
    if (x === undefined || y === undefined) {
      break;
    }
    nodesToVisit.push(
      ...expandNodeToNeighbors(grid, dijkstraGrid, x, y, start, finish),
    );
  }

  /*printGrid(
    mapGrid(dijkstraGrid, (v) =>
      Math.min(v.left, v.right, v.down, v.up).toString().padStart(3),
    ),
  );*/
  const endNode =
    dijkstraGrid[dijkstraGrid.length - 1][dijkstraGrid[0].length - 1];
  const min1 = Math.min(endNode.up, endNode.down);
  const min2 = Math.min(endNode.left, endNode.right);
  return Math.min(min1, min2);
}

export function part1(input: string) {
  const grid = mapGrid(transpose(parseGrid(input)), (v) => parseInt(v, 10));
  return shortestPath(grid, 1, 3);
}

export function part2(input: string) {
  const grid = mapGrid(transpose(parseGrid(input)), (v) => parseInt(v, 10));
  return shortestPath(grid, 4, 10);
}
