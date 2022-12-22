import { max, groupLines } from '@adventofcode2022/util';

type Grid = (number | undefined)[][];
type Coordinate = { x: number; y: number };
type Position = { pos: Coordinate; facing: Coordinate };
type Movement = number | 'L' | 'R';

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

function getNextPos(pos: Position, grid: Grid): Position {
  let newPos = {
    pos: {
      x: pos.pos.x + pos.facing.x,
      y: pos.pos.y + pos.facing.y,
    },
    facing: pos.facing,
  };
  if (newPos.pos.y < 0) {
    newPos.pos.y = grid.length - 1;
  }
  if (newPos.pos.y >= grid.length) {
    newPos.pos.y = 0;
  }
  if (newPos.pos.x < 0) {
    newPos.pos.x = grid[newPos.pos.y].length - 1;
  }
  if (newPos.pos.x >= grid[newPos.pos.y].length) {
    newPos.pos.x = 0;
  }
  if (grid[newPos.pos.y][newPos.pos.x] === undefined) {
    return getNextPos(newPos, grid);
  }
  return newPos;
}

function move(pos: Position, movement: Movement, grid: Grid): Position {
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
    const nextPos = getNextPos(pos, grid);
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

function solveGrid(grid: Grid, movements: Movement[]): Position {
  const startX = grid[0].findIndex((g) => g === EMPTY)!;
  let pos = { pos: { x: startX, y: 0 }, facing: { x: 1, y: 0 } };
  for (let movement of movements) {
    pos = move(pos, movement, grid);
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
  const result = solveGrid(buildGrid(gridLines), parseMovements(movements));
  return gradeResult(result);
}

export function part2(lines: string[]): number {
  return 0;
}
