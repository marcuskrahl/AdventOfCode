import { max, groupLines } from '@adventofcode2022/util';

type Grid = (number | undefined)[][];
type Coordinate = { x: number; y: number };
type Position = { pos: Coordinate; facing: Coordinate };
type Movement = number | 'L' | 'R';
type Mode = 'flat' | 'cube';

const WALL = 2;
const EMPTY = 1;

function buildGrid(lines: string[]): Grid {
  let grid: Grid = [];
  let maxWidth = max(lines.map((l) => l.length));
  for (let y = 0; y < lines.length; y++) {
    grid[y] = [];
    for (let x = 0; x < maxWidth; x++) {
      grid[y][x] =
        lines[y][x] === '.' ? EMPTY : lines[y][x] === '#' ? WALL : undefined;
    }
  }
  return grid;
}

function parseMovements(movementString: string): Movement[] {
  const nextL = movementString.indexOf('L');
  const nextR = movementString.indexOf('R');
  if (nextL === -1 && nextR === -1) {
    return [parseInt(movementString)];
  }
  if (nextL !== -1 && nextR === -1) {
    return [
      parseInt(movementString.slice(0, nextL)),
      'L',
      ...parseMovements(movementString.slice(nextL + 1)),
    ];
  }
  if (nextL === -1 && nextR !== -1) {
    return [
      parseInt(movementString.slice(0, nextR)),
      'R',
      ...parseMovements(movementString.slice(nextR + 1)),
    ];
  }
  if (nextL < nextR) {
    return [
      parseInt(movementString.slice(0, nextL)),
      'L',
      ...parseMovements(movementString.slice(nextL + 1)),
    ];
  }
  return [
    parseInt(movementString.slice(0, nextR)),
    'R',
    ...parseMovements(movementString.slice(nextR + 1)),
  ];
}

function getCubePos(
  currentPos: Position,
  nextPos: Position,
  grid: Grid
): Position {
  const cubeSize = grid.length < 20 ? 4 : 50;
  let [cy, cx] = [
    Math.floor(currentPos.pos.y / cubeSize),
    Math.floor(currentPos.pos.x / cubeSize),
  ];
  if (cubeSize === 4) {
    if (
      cy === 1 &&
      cx === 2 &&
      currentPos.facing.y === 0 &&
      currentPos.facing.x === 1
    ) {
      const newX = (3 + 1) * cubeSize - (currentPos.pos.y - cy * cubeSize) - 1;
      const newY = 2 * cubeSize;
      return {
        pos: {
          x: newX,
          y: newY,
        },
        facing: {
          x: 0,
          y: 1,
        },
      };
    }
    if (
      cy === 2 &&
      cx === 2 &&
      currentPos.facing.y === 1 &&
      currentPos.facing.x === 0
    ) {
      const newX = (0 + 1) * cubeSize - (currentPos.pos.x - cx * cubeSize) - 1;
      const newY = (1 + 1) * cubeSize - 1;
      return {
        pos: {
          x: newX,
          y: newY,
        },
        facing: {
          x: 0,
          y: -1,
        },
      };
    }
    if (
      cy === 1 &&
      cx === 1 &&
      currentPos.facing.y === -1 &&
      currentPos.facing.x === 0
    ) {
      const newX = 2 * cubeSize;
      const newY = 0 * cubeSize + currentPos.pos.x - cx * cubeSize;
      return {
        pos: {
          x: newX,
          y: newY,
        },
        facing: {
          x: 1,
          y: 0,
        },
      };
    }
  }
  if (cubeSize === 50) {
    if (
      cy === 0 &&
      cx === 1 &&
      currentPos.facing.y === -1 &&
      currentPos.facing.x === 0
    ) {
      const newX = 0 * cubeSize;
      const newY = 3 * cubeSize + (currentPos.pos.x - cx * cubeSize);
      return {
        pos: {
          x: newX,
          y: newY,
        },
        facing: {
          x: 1,
          y: 0,
        },
      };
    }
    if (
      cy === 3 &&
      cx === 0 &&
      currentPos.facing.y === 0 &&
      currentPos.facing.x === -1
    ) {
      const newX = 1 * cubeSize + (currentPos.pos.y - cy * cubeSize);
      const newY = 0 * cubeSize;
      return {
        pos: {
          x: newX,
          y: newY,
        },
        facing: {
          x: 0,
          y: 1,
        },
      };
    }
    if (
      cy === 3 &&
      cx === 0 &&
      currentPos.facing.y === 0 &&
      currentPos.facing.x === 1
    ) {
      const newX = 1 * cubeSize + (currentPos.pos.y - cy * cubeSize);
      const newY = (2 + 1) * cubeSize - 1;
      return {
        pos: {
          x: newX,
          y: newY,
        },
        facing: {
          x: 0,
          y: -1,
        },
      };
    }
    if (
      cy === 2 &&
      cx === 1 &&
      currentPos.facing.y === 1 &&
      currentPos.facing.x === 0
    ) {
      const newX = (0 + 1) * cubeSize - 1;
      const newY = 3 * cubeSize + (currentPos.pos.x - cx * cubeSize);
      return {
        pos: {
          x: newX,
          y: newY,
        },
        facing: {
          x: -1,
          y: 0,
        },
      };
    }
    if (
      cy === 3 &&
      cx === 0 &&
      currentPos.facing.y === 1 &&
      currentPos.facing.x === 0
    ) {
      const newX = 2 * cubeSize + (currentPos.pos.x - cx * cubeSize);
      const newY = 0 * cubeSize;
      return {
        pos: {
          x: newX,
          y: newY,
        },
        facing: {
          x: 0,
          y: 1,
        },
      };
    }
    if (
      cy === 0 &&
      cx === 2 &&
      currentPos.facing.y === 1 &&
      currentPos.facing.x === 0
    ) {
      const newX = (1 + 1) * cubeSize - 1;

      const newY = 1 * cubeSize + (currentPos.pos.x - cx * cubeSize);
      return {
        pos: {
          x: newX,
          y: newY,
        },
        facing: {
          x: -1,
          y: 0,
        },
      };
    }
    if (
      cy === 1 &&
      cx === 1 &&
      currentPos.facing.y === 0 &&
      currentPos.facing.x === 1
    ) {
      const newX = 2 * cubeSize + (currentPos.pos.y - cy * cubeSize);
      const newY = (0 + 1) * cubeSize - 1;

      return {
        pos: {
          x: newX,
          y: newY,
        },
        facing: {
          x: 0,
          y: -1,
        },
      };
    }
    if (
      cy === 0 &&
      cx === 2 &&
      currentPos.facing.y === 0 &&
      currentPos.facing.x === 1
    ) {
      const newX = (1 + 1) * cubeSize - 1;
      const newY = (2 + 1) * cubeSize - (currentPos.pos.y - cy * cubeSize) - 1;

      return {
        pos: {
          x: newX,
          y: newY,
        },
        facing: {
          x: -1,
          y: 0,
        },
      };
    }
    if (
      cy === 2 &&
      cx === 1 &&
      currentPos.facing.y === 0 &&
      currentPos.facing.x === 1
    ) {
      const newX = (2 + 1) * cubeSize - 1;
      const newY = (0 + 1) * cubeSize - (currentPos.pos.y - cy * cubeSize) - 1;

      return {
        pos: {
          x: newX,
          y: newY,
        },
        facing: {
          x: -1,
          y: 0,
        },
      };
    }
    if (
      cy === 0 &&
      cx === 1 &&
      currentPos.facing.y === 0 &&
      currentPos.facing.x === -1
    ) {
      const newX = 0 * cubeSize;
      const newY = (2 + 1) * cubeSize - (currentPos.pos.y - cy * cubeSize) - 1;

      return {
        pos: {
          x: newX,
          y: newY,
        },
        facing: {
          x: 1,
          y: 0,
        },
      };
    }
    if (
      cy === 2 &&
      cx === 0 &&
      currentPos.facing.y === 0 &&
      currentPos.facing.x === -1
    ) {
      const newX = 1 * cubeSize;
      const newY = (0 + 1) * cubeSize - (currentPos.pos.y - cy * cubeSize) - 1;

      return {
        pos: {
          x: newX,
          y: newY,
        },
        facing: {
          x: 1,
          y: 0,
        },
      };
    }
    if (
      cy === 2 &&
      cx === 0 &&
      currentPos.facing.y === -1 &&
      currentPos.facing.x === 0
    ) {
      const newX = 1 * cubeSize;
      const newY = 1 * cubeSize + (currentPos.pos.x - cx * cubeSize);

      return {
        pos: {
          x: newX,
          y: newY,
        },
        facing: {
          x: 1,
          y: 0,
        },
      };
    }

    if (
      cy === 1 &&
      cx === 1 &&
      currentPos.facing.y === 0 &&
      currentPos.facing.x === -1
    ) {
      const newX = 0 * cubeSize + (currentPos.pos.y - cy * cubeSize);
      const newY = 2 * cubeSize;

      return {
        pos: {
          x: newX,
          y: newY,
        },
        facing: {
          x: 0,
          y: 1,
        },
      };
    }
    if (
      cy === 0 &&
      cx === 2 &&
      currentPos.facing.y === -1 &&
      currentPos.facing.x === 0
    ) {
      const newX = 0 * cubeSize + (currentPos.pos.x - cx * cubeSize);
      const newY = (3 + 1) * cubeSize - 1;

      return {
        pos: {
          x: newX,
          y: newY,
        },
        facing: {
          x: 0,
          y: -1,
        },
      };
    }
  }
  console.log(
    'cy',
    cy,
    'cx',
    cx,
    'fx',
    currentPos.facing.x,
    'fy',
    currentPos.facing.y
  );
  throw new Error('not implemented');
}

function getNextPos(pos: Position, grid: Grid, mode: Mode): Position {
  let newPos = {
    pos: {
      x: pos.pos.x + pos.facing.x,
      y: pos.pos.y + pos.facing.y,
    },
    facing: pos.facing,
  };
  if (newPos.pos.y < 0) {
    if (mode === 'flat') {
      newPos.pos.y = grid.length - 1;
    } else {
      return getCubePos(pos, newPos, grid);
    }
  }
  if (newPos.pos.y >= grid.length) {
    if (mode === 'flat') {
      newPos.pos.y = 0;
    } else {
      return getCubePos(pos, newPos, grid);
    }
  }
  if (newPos.pos.x < 0) {
    if (mode === 'flat') {
      newPos.pos.x = grid[newPos.pos.y].length - 1;
    } else {
      return getCubePos(pos, newPos, grid);
    }
  }
  if (newPos.pos.x >= grid[newPos.pos.y].length) {
    if (mode === 'flat') {
      newPos.pos.x = 0;
    } else {
      return getCubePos(pos, newPos, grid);
    }
  }
  if (grid[newPos.pos.y][newPos.pos.x] === undefined) {
    if (mode === 'flat') {
      return getNextPos(newPos, grid, mode);
    } else {
      return getCubePos(pos, newPos, grid);
    }
  }
  return newPos;
}

function move(
  pos: Position,
  movement: Movement,
  grid: Grid,
  mode: Mode
): Position {
  if (movement === 'R') {
    return {
      pos: pos.pos,
      facing: {
        x: -pos.facing.y,
        y: pos.facing.x,
      },
    };
  }
  if (movement === 'L') {
    return {
      pos: pos.pos,
      facing: {
        x: pos.facing.y,
        y: -pos.facing.x,
      },
    };
  }
  let steps = movement;
  while (steps > 0) {
    const nextPos = getNextPos(pos, grid, mode);
    //console.log('next pos', nextPos);
    const nextTile = grid[nextPos.pos.y][nextPos.pos.x];
    if (nextTile === WALL) {
      //console.log('hit wall');
      return pos;
    }
    if (nextTile === EMPTY) {
      //console.log('empty');
      steps--;
      pos = nextPos;
    } else {
      throw new Error('should not reach void');
      /*console.log('void');
      pos = nextPos; //traverse the void*/
    }
  }
  return pos;
}

function solveGrid(grid: Grid, movements: Movement[], mode: Mode): Position {
  const startX = grid[0].findIndex((g) => g === EMPTY)!;
  let pos = { pos: { x: startX, y: 0 }, facing: { x: 1, y: 0 } };
  for (let movement of movements) {
    pos = move(pos, movement, grid, mode);
    //console.log(pos);
  }
  return pos;
}

function gradeResult(result: Position): number {
  const facing =
    result.facing.y === 0 && result.facing.x === 1
      ? 0
      : result.facing.y === 1 && result.facing.x === 0
      ? 1
      : result.facing.y === 0 && result.facing.x === -1
      ? 2
      : 3;
  return 1000 * (result.pos.y + 1) + 4 * (result.pos.x + 1) + facing;
}

export function part1(lines: string[]): number {
  const [gridLines, [movements]] = groupLines(lines);
  const result = solveGrid(
    buildGrid(gridLines),
    parseMovements(movements),
    'flat'
  );
  return gradeResult(result);
}

export function part2(lines: string[]): number {
  const [gridLines, [movements]] = groupLines(lines);
  const result = solveGrid(
    buildGrid(gridLines),
    parseMovements(movements),
    'cube'
  );
  return gradeResult(result);
}
