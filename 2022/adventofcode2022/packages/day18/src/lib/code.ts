import { sum } from '@adventofcode2022/util';

type Cube = { x: number; y: number; z: number };

function getCubes(lines: readonly string[]): Cube[] {
  return lines.map((line) => {
    const coords = line.split(',').map((s) => parseInt(s));
    return {
      x: coords[0],
      y: coords[1],
      z: coords[2],
    };
  });
}

function isFree(cube: Cube, offset: Cube, cubes: readonly Cube[]): boolean {
  return !cubes.some(
    (c) =>
      c.x === cube.x + offset.x &&
      c.y == cube.y + offset.y &&
      c.z === cube.z + offset.z
  );
}

function getSurfaceAreaForCube(cube: Cube, cubes: readonly Cube[]): number {
  const offsets: Cube[] = [
    { x: 1, y: 0, z: 0 },
    { x: -1, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 0, y: -1, z: 0 },
    { x: 0, y: 0, z: 1 },
    { x: 0, y: 0, z: -1 },
  ];
  return sum(offsets.map((offset) => (isFree(cube, offset, cubes) ? 1 : 0)));
}

function getSurfaceArea(cubes: readonly Cube[]): number {
  return sum(cubes.map((c) => getSurfaceAreaForCube(c, cubes)));
}
export function part1(lines: string[]): number {
  const cubes = getCubes(lines);
  const surfaceArea = getSurfaceArea(cubes);
  return surfaceArea;
}

type Grid = number[][][];

function getMinPos(grid: Grid): Cube {
  let minValue = Number.MAX_SAFE_INTEGER;
  let minPos: Cube = { x: 0, y: 0, z: 0 };
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      for (let z = 0; z < grid[x][y].length; z++) {
        if (grid[x][y][z] < minValue) {
          minValue = grid[x][y][z];
          minPos = { x, y, z };
        }
      }
    }
  }
  return minPos;
}

function fillGrid(grid: Grid): void {
  while (true) {
    const minPos = getMinPos(grid);
    if (grid[minPos.x][minPos.y][minPos.z] === 1) {
      return;
    }
    const offsets: Cube[] = [
      { x: 1, y: 0, z: 0 },
      { x: -1, y: 0, z: 0 },
      { x: 0, y: 1, z: 0 },
      { x: 0, y: -1, z: 0 },
      { x: 0, y: 0, z: 1 },
      { x: 0, y: 0, z: -1 },
    ];
    for (let offset of offsets) {
      const nx = minPos.x + offset.x;
      const ny = minPos.y + offset.y;
      const nz = minPos.z + offset.z;
      if (
        nx < 0 ||
        nx >= grid.length ||
        ny < 0 ||
        ny >= grid[nx].length ||
        nz < 0 ||
        nz >= grid[nx][ny].length
      ) {
        continue;
      }
      if (grid[nx][ny][nz] === 2) {
        grid[nx][ny][nz] = 0;
      }
    }
    grid[minPos.x][minPos.y][minPos.z] = 1;
  }
}

function getPocketArea(cubes: readonly Cube[]): number {
  const grid: Grid = [];
  const gridWidth = 25;
  for (let x = 0; x < gridWidth; x++) {
    grid[x] = [];
    for (let y = 0; y < gridWidth; y++) {
      grid[x][y] = [];
      for (let z = 0; z < gridWidth; z++) {
        grid[x][y][z] = isFree({ x, y, z }, { x: 0, y: 0, z: 0 }, cubes)
          ? 2
          : Number.MAX_SAFE_INTEGER;
      }
    }
  }
  grid[0][0][0] = 0;
  fillGrid(grid);

  const pocketCubes = grid.flatMap((a, x) =>
    a.flatMap((row, y) => row.flatMap((c, z) => (c === 2 ? [{ x, y, z }] : [])))
  );
  console.log(pocketCubes);
  return getSurfaceArea(pocketCubes);
}

export function part2(lines: string[]): number {
  const cubes = getCubes(lines);
  const pocketArea = getPocketArea(cubes);
  const surfaceArea = getSurfaceArea(cubes);
  return surfaceArea - pocketArea;
}
