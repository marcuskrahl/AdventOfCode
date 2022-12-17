import { bufferArray, max } from '@adventofcode2022/util';

type Coord = { x: number; y: number };

type BlockedCoords = Map<string, true>;

function getLineCoords([start, end]: string[]): Coord[] {
  const [startX, startY] = start.split(',').map((d) => parseInt(d));
  const [endX, endY] = end.split(',').map((d) => parseInt(d));
  if (startX != endX && startY != endY) {
    throw new Error('did not expect diagonal lines');
  }
  const dx = Math.sign(endX - startX);
  const dy = Math.sign(endY - startY);
  let result: Coord[] = [];
  if (dx === 0) {
    for (let y = startY; y * dy <= endY * dy; y += dy) {
      result = [...result, { x: startX, y }];
    }
  } else if (dy === 0) {
    for (let x = startX; x * dx <= endX * dx; x += dx) {
      result = [...result, { x, y: startY }];
    }
  }
  return result;
}

function getRockCoords(lines: string[]): Coord[] {
  return lines
    .map((l) =>
      Array.from(bufferArray(l.split(' -> '), 2)).map(([_, line]) =>
        getLineCoords(line)
      )
    )
    .flat(2);
}

function isFree(
  coord: Coord,
  blockedCoords: BlockedCoords,
  blockedSand: BlockedCoords
): boolean {
  return (
    !blockedCoords.has(`${coord.x}.${coord.y}`) &&
    !blockedSand.has(`${coord.x}.${coord.y}`)
  );
}

function pourSand(
  blockedRock: BlockedCoords,
  blockedSand: BlockedCoords,
  baseline: boolean = false
): Coord | undefined {
  let x = 500;
  let y = 0;
  const maxY =
    max(
      Array.from(blockedRock.keys())
        .map((c) => parseInt(c.split('.')[1]))
        .sort()
    ) + 1;
  const endY = baseline ? maxY + 1 : maxY + 1;
  while (y < endY) {
    if (baseline && y === endY - 1) {
      return { x, y };
    }
    if (isFree({ x, y: y + 1 }, blockedRock, blockedSand)) {
      y += 1;
      continue;
    }
    if (isFree({ x: x - 1, y: y + 1 }, blockedRock, blockedSand)) {
      x -= 1;
      y += 1;
      continue;
    }
    if (isFree({ x: x + 1, y: y + 1 }, blockedRock, blockedSand)) {
      x += 1;
      y += 1;
      continue;
    }
    return { x, y };
  }
  return baseline ? { x, y } : undefined;
}

function createMap(coords: Coord[]): Map<string, true> {
  const map = new Map<string, true>();
  for (let coord of coords) {
    map.set(`${coord.x}.${coord.y}`, true);
  }
  return map;
}

export function part1(lines: string[]): number {
  const rockCoords = createMap(getRockCoords(lines));
  let sandCoords = new Map<string, true>();
  let sandCount = 0;
  while (true) {
    sandCount++;
    const result = pourSand(rockCoords, sandCoords);
    if (result === undefined) {
      break;
    }
    sandCoords.set(`${result.x}.${result.y}`, true);
  }
  return sandCount - 1;
}

export function part2(lines: string[]): number {
  const rockCoords = createMap(getRockCoords(lines));
  let sandCoords = new Map<string, true>();
  let sandCount = 0;
  while (true) {
    sandCount++;
    const result = pourSand(rockCoords, sandCoords, true);
    if (result === undefined) {
      throw new Error('leak in part 2');
    }
    if (result.x === 500 && result.y === 0) {
      break;
    }
    sandCoords.set(`${result.x}.${result.y}`, true);
  }
  return sandCount;
}
