import { Grid, getLines, parseGrid, printGrid, sum, transpose } from './utils';

function getGrids(input: string): Grid<string>[] {
  let gridLines = [];
  let grids = [];
  const lines = getLines(input).concat('');
  for (let line of lines) {
    if (line === '') {
      grids.push(transpose(parseGrid(gridLines.join('\n'))));
      gridLines = [];
    } else {
      gridLines.push(line);
    }
  }
  return grids;
}

function isVerticalMirrorLine(
  grid: Grid<string>,
  x: number,
  allowedSmudges: number,
): boolean {
  let smudges = 0;
  for (let xo = 0; xo < grid.length; xo++) {
    for (let y = 0; y < grid[0].length; y++) {
      const xl = x - xo - 1;
      const xr = x + xo;
      if (xl < 0 || xr >= grid.length) {
        break;
      }
      if (grid[xl][y] != grid[xr][y]) {
        smudges++;
        if (smudges > allowedSmudges) {
          return false;
        }
      }
    }
  }
  return smudges === allowedSmudges;
}

function isHorizontalMirrorLine(
  grid: Grid<string>,
  y: number,
  allowedSmudges: number,
): boolean {
  let smudges = 0;
  for (let yo = 0; yo < grid[0].length; yo++) {
    for (let x = 0; x < grid.length; x++) {
      const yl = y - yo - 1;
      const yr = y + yo;
      if (yl < 0 || yr >= grid[0].length) {
        break;
      }
      if (grid[x][yl] != grid[x][yr]) {
        smudges++;
        if (smudges > allowedSmudges) return false;
      }
    }
  }
  return smudges === allowedSmudges;
}

function getVerticalMirror(grid: Grid<string>, allowedSmudges: number): number {
  for (let x = 1; x < grid.length; x++) {
    if (isVerticalMirrorLine(grid, x, allowedSmudges)) {
      return x;
    }
  }
  return 0;
}

function getHorizontalMirror(
  grid: Grid<string>,
  allowedSmudges: number,
): number {
  for (let y = 1; y < grid[0].length; y++) {
    if (isHorizontalMirrorLine(grid, y, allowedSmudges)) {
      return y;
    }
  }
  return 0;
}

export function part1(input: string) {
  let grids = getGrids(input);
  const verticalMirrorSum = sum(grids.map((g) => getVerticalMirror(g, 0)));
  const horizontalMirrorSum = sum(grids.map((g) => getHorizontalMirror(g, 0)));
  return verticalMirrorSum + 100 * horizontalMirrorSum;
}

export function part2(input: string) {
  let grids = getGrids(input);
  const verticalMirrorSum = sum(grids.map((g) => getVerticalMirror(g, 1)));
  const horizontalMirrorSum = sum(grids.map((g) => getHorizontalMirror(g, 1)));
  return verticalMirrorSum + 100 * horizontalMirrorSum;
}
