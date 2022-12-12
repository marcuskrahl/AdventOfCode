function getHeightMap(lines: string[]): number[][] {
  return lines.map((line) =>
    line
      .split('')
      .map((c) =>
        c === 'S' ? -1 : c === 'E' ? -2 : c.charCodeAt(0) - 'a'.charCodeAt(0)
      )
  );
}

function printMap(map: number[][]): void {
  console.log(
    map
      .map((row) =>
        row
          .map((v) =>
            v === Number.MAX_SAFE_INTEGER ? ' #' : v.toString().padStart(2)
          )
          .join(' ')
      )
      .join('\r\n')
  );
}

function getDistanceMap(map: number[][]): number[][] {
  return map.map((row) =>
    row.map((s) => (s === -1 ? 0 : Number.MAX_SAFE_INTEGER))
  );
}

function generateUnhandledNodes(
  heightMap: number[][]
): { x: number; y: number }[] {
  return heightMap.flatMap((row, y) => row.map((_, x) => ({ x, y })));
}

function getMinPosition(
  distanceMap: number[][],
  unhandledNodes: { x: number; y: number }[]
): { x: number; y: number } {
  let minValue = Number.MAX_SAFE_INTEGER;
  let miny = 0;
  let minx = 0;
  for (const node of unhandledNodes) {
    if (distanceMap[node.y][node.x] < minValue) {
      minx = node.x;
      miny = node.y;
      minValue = distanceMap[node.y][node.x];
    }
  }
  return { x: minx, y: miny };
}

function getNeighbors({
  x,
  y,
}: {
  x: number;
  y: number;
}): { x: number; y: number }[] {
  return [
    { x: x - 1, y: y },
    { x: x + 1, y: y },
    { x: x, y: y - 1 },
    { x: x, y: y + 1 },
  ];
}

function getHeightValue(
  { x, y }: { x: number; y: number },
  heightMap: number[][]
): number | undefined {
  if (y >= heightMap.length || y < 0) {
    return undefined;
  }
  if (x >= heightMap[y].length || x < 0) {
    return undefined;
  }
  const v = heightMap[y][x];
  if (v === -1) {
    return 0;
  }
  if (v === -2) {
    return 26;
  }
  return v;
}

function setNeighborDistances(
  { x, y }: { x: number; y: number },
  heightMap: number[][],
  distanceMap: number[][],
  allowedNeighborCheck: (source: number, neighbor: number) => boolean
): void {
  const ownHeightValue = getHeightValue({ x, y }, heightMap)!;
  const neighbors = getNeighbors({ x, y });
  for (const neighbor of neighbors) {
    const heightValue = getHeightValue(neighbor, heightMap);
    if (heightValue === undefined) {
      continue;
    }
    //if (ownHeightValue < heightValue - 1) {
    if (!allowedNeighborCheck(ownHeightValue, heightValue)) {
      continue;
    }
    const distanceToNeighbor = distanceMap[y][x] + 1;
    if (distanceMap[neighbor.y][neighbor.x] > distanceToNeighbor) {
      distanceMap[neighbor.y][neighbor.x] = distanceToNeighbor;
    }
  }
}

function calculateDijkstra(
  heightMap: number[][],
  distanceMap: number[][],
  unhandledNodes: { x: number; y: number }[],
  allowedNeighborCheck: (source: number, neighbor: number) => boolean
): void {
  const { x, y } = getMinPosition(distanceMap, unhandledNodes);
  if (heightMap[y][x] === -2) {
    return;
  }
  setNeighborDistances({ x, y }, heightMap, distanceMap, allowedNeighborCheck);

  //printMap(distanceMap);
  calculateDijkstra(
    heightMap,
    distanceMap,
    unhandledNodes.filter((n) => n.x !== x || n.y !== y),
    allowedNeighborCheck
  );
}

function getEnd(heightMap: number[][]): { x: number; y: number } {
  for (let y = 0; y < heightMap.length; y++) {
    for (let x = 0; x < heightMap[y].length; x++) {
      if (heightMap[y][x] === -2) {
        return { x, y };
      }
    }
  }
  throw new Error('end not found');
}

function* getEnds(heightMap: number[][]) {
  for (let y = 0; y < heightMap.length; y++) {
    for (let x = 0; x < heightMap[y].length; x++) {
      if (heightMap[y][x] === -2) {
        yield { x, y };
      }
    }
  }
}

export function part1(lines: string[]): number {
  const heightMap = getHeightMap(lines);
  const distanceMap = getDistanceMap(heightMap);
  const unhandledNodes = generateUnhandledNodes(heightMap);
  calculateDijkstra(
    heightMap,
    distanceMap,
    unhandledNodes,
    (v, n) => v >= n - 1
  );
  const end = getEnd(heightMap);
  return distanceMap[end.y][end.x];
}

function inverseHeightMap(heightMap: number[][]): number[][] {
  return heightMap.map((row) =>
    row.map((c) => (c === 0 ? -2 : c === -1 ? -2 : c === -2 ? -1 : c))
  );
}

export function part2(lines: string[]): number {
  const originalHeightMap = getHeightMap(lines);
  const heightMap = inverseHeightMap(originalHeightMap);
  const distanceMap = getDistanceMap(heightMap);
  const unhandledNodes = generateUnhandledNodes(heightMap);
  calculateDijkstra(
    heightMap,
    distanceMap,
    unhandledNodes,
    (v, n) =>
      (n === 26 && v === 1) ||
      (n !== 26 &&
        ((v === 0 && (n === 25 || n === 26)) ||
          (v !== 0 && v <= n) ||
          v - n === 1))
  );
  const ends = Array.from(getEnds(heightMap));
  const end = getMinPosition(distanceMap, ends);
  return distanceMap[end.y][end.x];
}
