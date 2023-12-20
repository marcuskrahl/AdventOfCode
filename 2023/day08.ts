import { getLines, lcm, loop, product } from './utils';

type DirectionMap = {
  [key: string]: { left: string; right: string };
};

function parseDirections(lines: string[]): DirectionMap {
  const result: DirectionMap = {};
  for (let line of lines) {
    const source = line.split(' = ')[0];
    const [left, right] = line
      .split(' = ')[1]
      .replace('(', '')
      .replace(')', '')
      .split(', ');
    result[source] = { left, right };
  }
  return result;
}

function getPathLength(
  currentNode: string,
  targetNode: string,
  movements: Generator<string>,
  directions: DirectionMap,
): number {
  let count = 0;
  while (true) {
    const dir = directions[currentNode];
    currentNode = movements.next().value === 'L' ? dir.left : dir.right;
    count += 1;
    if (currentNode === targetNode) {
      return count;
    }
  }
}

export function part1(input: string) {
  const [movementLine, _, ...rest] = getLines(input);
  const movement = movementLine.split('');
  const directions = parseDirections(rest);
  return getPathLength('AAA', 'ZZZ', loop(movement), directions);
}

function getLoopCount(
  startNode: string,
  movement: string[],
  directions: DirectionMap,
): { offset: number; loop: number } {
  let movementIndex = 0;
  let visitedNodes = [{ node: startNode, movementIndex: movementIndex }];
  let currentNode = startNode;
  let visitedNodesDict: { [key: string]: boolean } = {};
  visitedNodesDict[startNode + movementIndex] = true;
  while (true) {
    const dir = directions[currentNode];
    currentNode = movement[movementIndex] === 'L' ? dir.left : dir.right;
    movementIndex =
      movementIndex >= movement.length - 1 ? 0 : movementIndex + 1;
    if (visitedNodesDict[currentNode + movementIndex] === true) {
      const idxLoop = visitedNodes.findIndex(
        (v) => v.node === currentNode && v.movementIndex === movementIndex,
      );
      const endIndex = visitedNodes.findIndex((n) => n.node.endsWith('Z'));
      return { offset: endIndex, loop: visitedNodes.length - idxLoop };
    }
    visitedNodesDict[currentNode + movementIndex] = true;
    visitedNodes.push({ node: currentNode, movementIndex: movementIndex });
  }
}

function getPrimeFactors(n: number): number[] {
  if (n <= 1) {
    return [];
  }
  for (let prime of primes) {
    if (n % prime === 0) {
      return [prime, ...getPrimeFactors(n / prime)];
    }
  }
  return [n];
}

function generatePrimes(): number[] {
  const max = 30_000;
  let grid = [];
  grid[2] = true;
  for (let i = 3; i < 30_000; i += 2) {
    if (grid[i] !== undefined) {
      continue;
    }
    grid[i] = true;
    for (let j = i * 3; j <= max; j += i * 2) {
      grid[j] = false;
    }
  }
  return grid.flatMap((v, i) => (v === true ? [i] : []));
}

const primes = generatePrimes();

function getGhostLength(movement: string[], directions: DirectionMap): number {
  let nodes = Object.keys(directions).filter((d) => d.endsWith('A'));
  let pathLengths = nodes.map((n) => getLoopCount(n, movement, directions));
  const offsets = pathLengths.map((p) => p.offset);
  return offsets.reduce(lcm, 1);
}

export function part2(input: string) {
  const [movementLine, _, ...rest] = getLines(input);
  const movement = movementLine.split('');
  const directions = parseDirections(rest);
  return getGhostLength(movement, directions);
}
