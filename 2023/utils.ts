export function getLines(input: string): string[] {
  return input.split('\n').map((l) => l.trim());
}

export function sum(numbers: number[]): number {
  return numbers.reduce((sum, n) => sum + n, 0);
}
export function product(numbers: number[]): number {
  return numbers.reduce((product, n) => product * n, 1);
}

export function first<T>(arr: readonly T[]): T {
  return arr[0];
}
export function last<T>(arr: readonly T[]): T {
  return arr[arr.length - 1];
}

export function min<T>(arr: readonly T[], cmp: (item: T) => number) {
  return arr.reduce((min, curr) => (cmp(min) <= cmp(curr) ? min : curr));
}
export function max<T>(arr: readonly T[], cmp: (item: T) => number) {
  return arr.reduce((max, curr) => (cmp(max) >= cmp(curr) ? max : curr));
}
export function assertNotNull<T>(
  input: T | null | undefined,
  message?: string,
): asserts input is T {
  if (input == undefined) {
    throw new Error(message ?? 'expected value to be defined');
  }
}

export type Grid<T> = T[][];

export function parseGrid(input: string): Grid<string> {
  return input.split('\n').map((line) => line.trim().split(''));
}

export function transpose<T>(input: Grid<T>): Grid<T> {
  const result: Grid<T> = [];
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      if (result[x] === undefined) {
        result[x] = [];
      }
      result[x][y] = input[y][x];
    }
  }
  return result;
}

export function reduceGrid<T, U>(
  grid: Grid<T>,
  reducer: (acc: U, x: number, y: number) => U,
  start: U,
): U {
  let result = start;
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid.length; y++) {
      result = reducer(result, x, y);
    }
  }
  return result;
}

export function getNeighbors<T>(
  grid: Grid<T>,
  x: number,
  y: number,
): {
  n: T | undefined;
  ne: T | undefined;
  e: T | undefined;
  se: T | undefined;
  s: T | undefined;
  sw: T | undefined;
  w: T | undefined;
  nw: T | undefined;
} {
  const tryGetCoordinate = (xe: number, ye: number) => {
    if (xe < 0 || xe >= grid.length) {
      return undefined;
    }
    if (ye < 0 || ye >= grid[xe].length) {
      return undefined;
    }
    return grid[xe][ye];
  };
  return {
    n: tryGetCoordinate(x, y - 1),
    ne: tryGetCoordinate(x + 1, y - 1),
    e: tryGetCoordinate(x + 1, y),
    se: tryGetCoordinate(x + 1, y + 1),
    s: tryGetCoordinate(x, y + 1),
    sw: tryGetCoordinate(x - 1, y + 1),
    w: tryGetCoordinate(x - 1, y),
    nw: tryGetCoordinate(x - 1, y - 1),
  };
}

export function* loop<T>(input: T[]) {
  for (let i = 0; i < input.length; i++) {
    yield input[i];
    if (i === input.length - 1) {
      i = -1;
    }
  }
}

export function* pairwise<T>(input: T[]) {
  for (let i = 0; i < input.length - 1; i++) {
    yield [input[i], input[i + 1]];
  }
}

export function printGrid<T extends string>(grid: Grid<T>): void {
  let output = '';
  for (let y = 0; y < grid[0].length; y++) {
    let line = '';
    for (let x = 0; x < grid.length; x++) {
      line += grid[x][y].toString();
    }
    output += line + '\r\n';
  }
  console.log(output);
}

export function range(start: number, end: number): number[] {
  return new Array(end - start).fill(undefined).map((_, i) => start + i);
}

export function mapGrid<T>(
  grid: Grid<T>,
  mapFunction: (value: T, x: number, y: number) => T,
): Grid<T> {
  const newGrid: Grid<T> = [];
  for (let x = 0; x < grid.length; x++) {
    newGrid[x] = [];
    for (let y = 0; y < grid.length; y++) {
      newGrid[x][y] = mapFunction(grid[x][y], x, y);
    }
  }
  return newGrid;
}
export function rotateClockwise<T>(grid: Grid<T>): Grid<T> {
  return mapGrid(grid, (_, x, y) => grid[y][grid.length - x - 1]);
}
