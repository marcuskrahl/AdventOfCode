import {
  Grid,
  mapGrid,
  parseGrid,
  printGrid,
  transpose,
  getNeighbors as getGridNeighbors,
} from './utils';

function getNeighbors(c: string): [[number, number], [number, number]] {
  switch (c) {
    case '|':
      return [
        [0, -1],
        [0, 1],
      ];
    case '-':
      return [
        [-1, 0],
        [1, 0],
      ];
    case 'L':
      return [
        [0, -1],
        [1, 0],
      ];
    case 'J':
      return [
        [0, -1],
        [-1, 0],
      ];
    case '7':
      return [
        [-1, 0],
        [0, 1],
      ];
    case 'F':
      return [
        [1, 0],
        [0, 1],
      ];
  }
  throw new Error(`unexpected tile ${c}`);
}

function getLoopLength(
  grid: Grid<string>,
  x: number,
  y: number,
  previousX: number,
  previousY: number,
): number {
  let pathLength = -1;
  while (true) {
    pathLength += 1;
    const current = grid[x][y];
    if (current === 'S') {
      if (previousX !== -1) {
        return pathLength;
      }
      if (
        grid[x][y - 1] === '|' ||
        grid[x][y - 1] === '7' ||
        grid[x][y - 1] === 'F'
      ) {
        previousX = x;
        previousY = y;
        x = x;
        y = y - 1;
        continue;
      }
      if (
        grid[x][y + 1] === '|' ||
        grid[x][y + 1] === 'L' ||
        grid[x][y + 1] === 'J'
      ) {
        previousX = x;
        previousY = y;
        x = x;
        y = y + 1;
        continue;
      }
      if (
        grid[x + 1][y] === '-' ||
        grid[x + 1][y] === 'J' ||
        grid[x + 1][y] === '7'
      ) {
        previousX = x;
        previousY = y;
        x = x + 1;
        y = y;
        continue;
      }
      throw new Error('should not be here');
    } else {
      const [[x1, y1], [x2, y2]] = getNeighbors(current);
      if (x + x1 === previousX && y + y1 === previousY) {
        previousX = x;
        previousY = y;
        x = x + x2;
        y = y + y2;
      } else {
        previousX = x;
        previousY = y;
        x = x + x1;
        y = y + y1;
      }
    }
  }
  return 0;
}

export function part1(input: string) {
  const grid = transpose(parseGrid(input));
  const [x, y] = grid.flatMap((line, x) =>
    line.flatMap((c, y) => (c === 'S' ? [x, y] : [])),
  );
  return getLoopLength(grid, x, y, -1, -1) / 2;
}

function guessStart(grid: Grid<string>, x: number, y: number): string {
  const neighbors = getGridNeighbors(grid, x, y);
  const northOpen =
    neighbors.n === 'F' || neighbors.n === '7' || neighbors.n === '|';
  const southOpen =
    neighbors.s === 'J' || neighbors.s === 'L' || neighbors.s === '|';
  const westOpen =
    neighbors.w === 'F' || neighbors.w === 'L' || neighbors.w === '-';
  const eastOpen =
    neighbors.e === 'J' || neighbors.e === '7' || neighbors.e === '-';
  if (northOpen && southOpen) {
    return '|';
  }
  if (eastOpen && westOpen) {
    return '-';
  }
  if (northOpen && eastOpen) {
    return 'L';
  }
  if (northOpen && westOpen) {
    return 'J';
  }
  if (southOpen && eastOpen) {
    return 'F';
  }
  if (southOpen && westOpen) {
    return '7';
  }
  throw new Error('should not be here');
}

function markPath(
  grid: Grid<string>,
  x: number,
  y: number,
  previousX: number,
  previousY: number,
): Grid<boolean> {
  const pathGrid: Grid<boolean> = mapGrid(grid, () => false);
  let xs = 0;
  let ys = 0;

  while (true) {
    const current = grid[x][y];
    pathGrid[x][y] = true;
    if (current === 'S') {
      if (previousX !== -1) {
        const xe = x - previousX;
        const ye = y - previousY;
        grid[x][y] = guessStart(grid, x, y);
        return pathGrid;
      }
      if (
        grid[x][y - 1] === '|' ||
        grid[x][y - 1] === '7' ||
        grid[x][y - 1] === 'F'
      ) {
        previousX = x;
        previousY = y;
        x = x;
        y = y - 1;
        ys = -1;
        continue;
      }
      if (
        grid[x][y + 1] === '|' ||
        grid[x][y + 1] === 'L' ||
        grid[x][y + 1] === 'J'
      ) {
        previousX = x;
        previousY = y;
        x = x;
        y = y + 1;
        ys = 1;
        continue;
      }
      if (
        grid[x + 1][y] === '-' ||
        grid[x + 1][y] === 'J' ||
        grid[x + 1][y] === '7'
      ) {
        previousX = x;
        previousY = y;
        x = x + 1;
        y = y;
        xs = 1;
        continue;
      }
      throw new Error('should not be here');
    } else {
      const [[x1, y1], [x2, y2]] = getNeighbors(current);
      if (x + x1 === previousX && y + y1 === previousY) {
        previousX = x;
        previousY = y;
        x = x + x2;
        y = y + y2;
      } else {
        previousX = x;
        previousY = y;
        x = x + x1;
        y = y + y1;
      }
    }
  }
  return pathGrid;
}

function removeJunk(grid: Grid<string>, pathGrid: Grid<boolean>): Grid<string> {
  return mapGrid(grid, (v, x, y) => (pathGrid[x][y] ? v : '.'));
}

function getTile(value: string): string[][] {
  switch (value) {
    case '-':
      return [
        ['.', '.', '.'],
        ['#', '#', '#'],
        ['.', '.', '.'],
      ];
    case '|':
      return [
        ['.', '#', '.'],
        ['.', '#', '.'],
        ['.', '#', '.'],
      ];
    case 'L':
      return [
        ['.', '#', '.'],
        ['.', '#', '#'],
        ['.', '.', '.'],
      ];
    case 'F':
      return [
        ['.', '.', '.'],
        ['.', '#', '#'],
        ['.', '#', '.'],
      ];
    case 'J':
      return [
        ['.', '#', '.'],
        ['#', '#', '.'],
        ['.', '.', '.'],
      ];
    case '7':
      return [
        ['.', '.', '.'],
        ['#', '#', '.'],
        ['.', '#', '.'],
      ];
    case '.':
      return [
        ['.', '.', '.'],
        ['.', '.', '.'],
        ['.', '.', '.'],
      ];
  }
  throw new Error('unexpected value');
}

function zoomGrid(grid: Grid<string>): Grid<string> {
  const newGrid: Grid<string> = [];
  for (let x = 0; x < grid.length; x++) {
    newGrid[3 * x] = [];
    newGrid[3 * x + 1] = [];
    newGrid[3 * x + 2] = [];
    for (let y = 0; y < grid.length; y++) {
      const value = grid[x][y];
      const tile = getTile(value);
      for (let xs = 0; xs < 3; xs++) {
        for (let ys = 0; ys < 3; ys++) {
          newGrid[3 * x + xs][3 * y + ys] = tile[ys][xs];
        }
      }
    }
  }
  return [
    newGrid[0].map(() => '.'),
    ...newGrid.map((row) => ['.', ...row, '.']),
    newGrid[0].map(() => '.'),
  ];
}

function floodFill(grid: Grid<string>): void {
  const queue = [[0, 0]];
  while (queue.length > 0) {
    let [x, y] = queue.pop()!;
    if (grid[x][y] === '.') {
      grid[x][y] = 'O';
      let neighbors = getGridNeighbors(grid, x, y);
      if (neighbors.n !== undefined) {
        queue.push([x, y - 1]);
      }
      if (neighbors.s !== undefined) {
        queue.push([x, y + 1]);
      }
      if (neighbors.w !== undefined) {
        queue.push([x - 1, y]);
      }
      if (neighbors.e !== undefined) {
        queue.push([x + 1, y]);
      }
    }
  }
}

function countNotFloodedTiles(grid: Grid<string>): number {
  let count = 0;
  for (let x = 2; x < grid.length; x += 3) {
    for (let y = 2; y < grid[0].length; y += 3) {
      if (grid[x][y] === '.') {
        count += 1;
      }
    }
  }
  return count;
}

export function part2(input: string) {
  let grid = transpose(parseGrid(input));
  const [x, y] = grid.flatMap((line, x) =>
    line.flatMap((c, y) => (c === 'S' ? [x, y] : [])),
  );
  const pathGrid = markPath(grid, x, y, -1, -1);
  grid = removeJunk(grid, pathGrid);
  grid = zoomGrid(grid);
  floodFill(grid);
  //printGrid(grid);
  return countNotFloodedTiles(grid);
  //printGrid(mapGrid(pathGrid, (b) => (b ? '#' : '.')));
}
