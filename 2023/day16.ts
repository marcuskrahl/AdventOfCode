import {
  Grid,
  mapGrid,
  max,
  parseGrid,
  printGrid,
  sum,
  transpose,
} from './utils';

type BeamDirection = 'left' | 'right' | 'top' | 'bottom';

function nextInDirection(x: number, y: number, direction: BeamDirection) {
  switch (direction) {
    case 'left':
      return { x: x - 1, y: y };
    case 'right':
      return { x: x + 1, y: y };
    case 'top':
      return { x: x, y: y - 1 };
    case 'bottom':
      return { x: x, y: y + 1 };
  }
}

function trackBeams(
  grid: Grid<string>,
  startX: number,
  startY: number,
  startDirection: BeamDirection,
): Grid<BeamDirection[]> {
  const beamGrid: Grid<BeamDirection[]> = mapGrid(grid, () => []);
  const queue: { x: number; y: number; direction: BeamDirection }[] = [
    { x: startX, y: startY, direction: startDirection },
  ];
  while (queue.length > 0) {
    const { x, y, direction } = queue.pop()!;
    if (x < 0 || y < 0 || x >= grid.length || y >= grid[0].length) {
      continue;
    }
    if (beamGrid[x][y].includes(direction)) {
      continue;
    }
    beamGrid[x][y].push(direction);
    const tile = grid[x][y];
    if (
      tile === '.' ||
      (tile === '-' && direction === 'left') ||
      (tile === '-' && direction === 'right') ||
      (tile === '|' && direction === 'top') ||
      (tile === '|' && direction === 'bottom')
    ) {
      const next = nextInDirection(x, y, direction);
      queue.push({ ...next, direction });
    } else if (tile === '|') {
      const up = nextInDirection(x, y, 'top');
      const down = nextInDirection(x, y, 'bottom');
      queue.push({ ...up, direction: 'top' });
      queue.push({ ...down, direction: 'bottom' });
    } else if (tile === '-') {
      const left = nextInDirection(x, y, 'left');
      const right = nextInDirection(x, y, 'right');
      queue.push({ ...left, direction: 'left' });
      queue.push({ ...right, direction: 'right' });
    } else if (tile === '/') {
      const nextDirection =
        direction === 'right'
          ? 'top'
          : direction === 'left'
            ? 'bottom'
            : direction === 'top'
              ? 'right'
              : 'left';
      const next = nextInDirection(x, y, nextDirection);
      queue.push({ ...next, direction: nextDirection });
    } else if (tile === '\\') {
      const nextDirection =
        direction === 'right'
          ? 'bottom'
          : direction === 'left'
            ? 'top'
            : direction === 'top'
              ? 'left'
              : 'right';
      const next = nextInDirection(x, y, nextDirection);
      queue.push({ ...next, direction: nextDirection });
    }
  }
  return beamGrid;
}

function printBeamMap(grid: Grid<BeamDirection[]>): void {
  printGrid(
    mapGrid(grid, ([first, ...rest]) => {
      if (rest.length > 0) {
        return `${rest.length + 1}`;
      }
      if (first === undefined) {
        return '.';
      }
      if (first === 'left') {
        return '<';
      }
      if (first === 'right') {
        return '>';
      }
      if (first === 'bottom') {
        return 'v';
      }
      if (first === 'top') {
        return '^';
      }
      return '.';
    }),
  );
}

function getEnergization(grid: Grid<BeamDirection[]>): number {
  let sum = 0;
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[0].length; y++) {
      if (grid[x][y].length > 0) {
        sum += 1;
      }
    }
  }
  return sum;
}

export function part1(input: string) {
  const grid = transpose(parseGrid(input));
  const beamGrid = trackBeams(grid, 0, 0, 'right');
  return getEnergization(beamGrid);
}

export function part2(input: string) {
  const grid = transpose(parseGrid(input));
  const beamGrids = [];
  for (let x = 0; x < grid.length; x++) {
    beamGrids.push(trackBeams(grid, x, 0, 'bottom'));
    beamGrids.push(trackBeams(grid, x, grid[0].length - 1, 'top'));
  }
  for (let y = 0; y < grid.length; y++) {
    beamGrids.push(trackBeams(grid, 0, y, 'right'));
    beamGrids.push(trackBeams(grid, grid.length - 1, y, 'left'));
  }

  const maxLight = max(beamGrids, (g) => getEnergization(g));
  return getEnergization(maxLight);
}
