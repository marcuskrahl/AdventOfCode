import { getLines, newGrid, sum } from './utils';

type Cube = {
  x: number;
  y: number;
  z: number;
};
type Brick = {
  start: Cube;
  end: Cube;
};

type DescendedBrick = Brick & {
  id: number;
  supportedBy: number[];
};

type GridTop = {
  id: number;
  z: number;
};

function parseCube(input: string): Cube {
  const [x, y, z] = input.split(',').map((v) => parseInt(v, 10));
  return { x, y, z };
}

function parseBrick(input: string): Brick {
  const [start, end] = input.split('~');
  const startCube = parseCube(start);
  const endCube = parseCube(end);
  return {
    start: endCube.z > startCube.z ? endCube : startCube,
    end: endCube.z > startCube.z ? startCube : endCube,
  };
}

function descendBricks(bricks: Brick[]): DescendedBrick[] {
  const maxX = Math.max(...bricks.flatMap((b) => [b.start.x, b.end.x]));
  const maxY = Math.max(...bricks.flatMap((b) => [b.start.y, b.end.y]));
  let currentTop = newGrid<GridTop | undefined>(maxX + 1, maxY + 1, undefined);
  const descendedBricks: DescendedBrick[] = [];
  let id = 0;
  for (let brick of bricks) {
    //console.log(currentTop);
    const minX = Math.min(brick.start.x, brick.end.x);
    const maxX = Math.max(brick.start.x, brick.end.x);
    const minY = Math.min(brick.start.y, brick.end.y);
    const maxY = Math.max(brick.start.y, brick.end.y);
    let minZ = 0;
    let supportedBy: number[] = [];
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        const top = currentTop[x][y];
        if (top === undefined) {
          continue;
        }
        if (top.z > minZ) {
          minZ = top.z;
          supportedBy = [top.id];
        } else if (top.z === minZ && !supportedBy.includes(top.id)) {
          supportedBy.push(top.id);
        }
      }
    }
    id++;
    let node: GridTop = {
      id: id,
      z: minZ + Math.abs(brick.end.z - brick.start.z) + 1,
    };
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        currentTop[x][y] = node;
      }
    }
    descendedBricks.push({ ...brick, id, supportedBy });
  }

  return descendedBricks;
}

function isSupportingBrick(
  brick: DescendedBrick,
  bricks: DescendedBrick[],
): boolean {
  return bricks
    .filter((b) => b.supportedBy.includes(brick.id))
    .some((b) => b.supportedBy.length === 1);
}

export function part1(input: string) {
  const bricks = getLines(input)
    .map(parseBrick)
    .toSorted((b1, b2) => b1.end.z - b2.end.z);
  const descendedBricks = descendBricks(bricks);
  return descendedBricks.filter((b) => !isSupportingBrick(b, descendedBricks))
    .length;
}

function disintegrationEffect(
  brick: DescendedBrick,
  descendedBricks: DescendedBrick[],
): number {
  let fallenBricks = [brick.id];
  while (true) {
    const relatedFallenBricks = descendedBricks.filter(
      (b) =>
        !fallenBricks.includes(b.id) &&
        b.supportedBy.length > 0 &&
        b.supportedBy.every((b2) => fallenBricks.includes(b2)),
    );
    if (relatedFallenBricks.length === 0) {
      return fallenBricks.length - 1;
    }
    fallenBricks.push(...relatedFallenBricks.map((b) => b.id));
  }
}

export function part2(input: string) {
  const bricks = getLines(input)
    .map(parseBrick)
    .toSorted((b1, b2) => b1.end.z - b2.end.z);
  const descendedBricks = descendBricks(bricks);
  return sum(
    descendedBricks.map((b) => disintegrationEffect(b, descendedBricks)),
  );
}
