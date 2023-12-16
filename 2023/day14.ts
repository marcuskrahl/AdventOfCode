import {
  Grid,
  parseGrid,
  printGrid,
  rotateClockwise,
  transpose,
} from './utils';

function fillSpan(
  line: string[],
  start: number,
  end: number,
  rocks: number,
  emtpy: number,
) {
  for (let i = start; i < end; i++) {
    if (rocks > 0) {
      line[i] = 'O';
      rocks--;
    } else {
      line[i] = '.';
      emtpy--;
    }
  }
}

function tiltNorth(grid: Grid<string>): Grid<string> {
  let newGrid: Grid<string> = [];
  for (let x = 0; x < grid.length; x++) {
    newGrid[x] = [];
    let countRocks = 0;
    let countEmpty = 0;
    let startY = 0;
    for (let y = 0; y < grid[x].length; y++) {
      switch (grid[x][y]) {
        case '.':
          countEmpty++;
          break;
        case 'O':
          countRocks++;
          break;
        case '#': {
          newGrid[x][y] = '#';
          fillSpan(newGrid[x], startY, y, countRocks, countEmpty);
          countEmpty = 0;
          countRocks = 0;
          startY = y + 1;
          break;
        }
        default:
          throw new Error('unexpected char');
      }
    }
    if (startY < grid[x].length) {
      fillSpan(newGrid[x], startY, grid[x].length, countRocks, countEmpty);
    }
  }
  return newGrid;
}

function calculateLoadBearing(grid: Grid<string>): number {
  let sum = 0;
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid.length; y++) {
      if (grid[x][y] === 'O') {
        sum += grid[0].length - y;
      }
    }
  }
  return sum;
}

export function part1(input: string) {
  let grid = transpose(parseGrid(input));
  grid = tiltNorth(grid);
  return calculateLoadBearing(grid);
}

function gridState(grid: Grid<string>): string {
  return grid.flatMap((row) => row).join('');
}

export function part2(input: string) {
  let grid = transpose(parseGrid(input));

  let states: { [key: string]: number } = {};
  let goMode: boolean = false;
  for (let c = 0; c < 1_000_000_000; c++) {
    for (let i = 0; i < 4; i++) {
      grid = tiltNorth(grid);
      grid = rotateClockwise(grid);
    }
    if (goMode) {
      continue;
    }
    const state = gridState(grid);
    if (states[state] !== undefined) {
      const loopOffset = c;
      const loopLength = c - states[state];
      const toSimulate = (1_000_000_000 - loopOffset) % loopLength;
      c = 1_000_000_000 - toSimulate;
      goMode = true;
    }
    states[state] = c;
  }
  return calculateLoadBearing(grid);
}
