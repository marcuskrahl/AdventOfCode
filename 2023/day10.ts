import { Grid, parseGrid, printGrid, transpose } from './utils';

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

function markPath(
  grid: Grid<string>,
  x: number,
  y: number,
  previousX: number,
  previousY: number,
): void {
  while (true) {
    const current = grid[x][y];
    grid[x][y] = 'S';
    if (current === 'S') {
      if (previousX !== -1) {
        return;
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
}

export function part2(input: string) {
  const grid = transpose(parseGrid(input));
  const [x, y] = grid.flatMap((line, x) =>
    line.flatMap((c, y) => (c === 'S' ? [x, y] : [])),
  );
  markPath(grid, x, y, -1, -1);
  printGrid(grid);
}
