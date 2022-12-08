import { sum, max } from '@adventofcode2022/util';

function inputToGrid(lines: readonly string[]): number[][] {
  return lines.map((l) => l.split('').map((c) => parseInt(c)));
}

function isVisible(grid: number[][], x: number, y: number): 0 | 1 {
  if (x == 0 || y == 0) {
    return 1;
  }
  if (x == grid.length - 1 || y == grid[x].length - 1) {
    return 1;
  }
  const row = grid[x];
  if (row.slice(0, y).every((c) => c < grid[x][y])) {
    return 1;
  }
  if (row.slice(y + 1).every((c) => c < grid[x][y])) {
    return 1;
  }
  const column = grid.map((r) => r[y]);
  if (column.slice(0, x).every((c) => c < grid[x][y])) {
    return 1;
  }
  if (column.slice(x + 1).every((c) => c < grid[x][y])) {
    return 1;
  }
  return 0;
}

function getVisibleGrid(grid: number[][]): number[][] {
  let result: number[][] = [];
  for (let x = 0; x < grid.length; x++) {
    result[x] = [];
    for (let y = 0; y < grid[x].length; y++) {
      result[x][y] = isVisible(grid, x, y);
    }
  }
  return result;
}

function treesInDirection({
  grid,
  dx,
  dy,
  threshold,
  x,
  y,
}: {
  grid: number[][];
  dx: number;
  dy: number;
  threshold: number;
  x: number;
  y: number;
}): number {
  const nx = x + dx;
  const ny = y + dy;

  if (nx < 0 || ny < 0 || nx >= grid.length || ny >= grid[nx].length) {
    return 0;
  }
  if (grid[nx][ny] >= threshold) {
    return 1;
  }
  return 1 + treesInDirection({ grid, dx, dy, threshold, x: nx, y: ny });
}

function getScenicScore(grid: number[][], x: number, y: number): number {
  const threshold = grid[x][y];
  const north = treesInDirection({ grid, dx: -1, dy: 0, threshold, x, y });
  const east = treesInDirection({ grid, dx: 0, dy: -1, threshold, x, y });
  const south = treesInDirection({ grid, dx: 1, dy: 0, threshold, x, y });
  const west = treesInDirection({ grid, dx: 0, dy: 1, threshold, x, y });
  return north * east * south * west;
}

export function part1(lines: string[]): number {
  const grid = inputToGrid(lines);
  const visibleGrid = getVisibleGrid(grid);
  const result = sum(visibleGrid.map((g) => sum(g)));
  return result;
}

export function part2(lines: string[]): number {
  const grid = inputToGrid(lines);
  const scenicScores = grid.flatMap((row, x) =>
    row.map((_, y) => getScenicScore(grid, x, y))
  );
  return max(scenicScores);
}
