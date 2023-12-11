import { getLines, max, min, range, sum } from './utils';

interface Galaxy {
  x: number;
  y: number;
}
function getGalaxies(input: string): Galaxy[] {
  return getLines(input)
    .map((line, y) =>
      line.split('').flatMap((c, x) => (c === '#' ? [{ x, y }] : [])),
    )
    .flat();
}

function expandGalaxies(
  galaxies: Galaxy[],
  expandFactor: number = 2,
): Galaxy[] {
  const minX = min(galaxies, (g) => g.x).x;
  const minY = min(galaxies, (g) => g.y).y;
  const maxX = max(galaxies, (g) => g.x).x;
  const maxY = max(galaxies, (g) => g.y).y;
  const emptyX = range(minX, maxX + 1).flatMap((x) =>
    galaxies.some((g) => g.x === x) ? [] : [x],
  );
  const emptyY = range(minY, maxY + 1).flatMap((y) =>
    galaxies.some((g) => g.y === y) ? [] : [y],
  );

  return galaxies.map((g) => ({
    ...g,
    x: g.x + emptyX.filter((x) => x < g.x).length * (expandFactor - 1),
    y: g.y + emptyY.filter((y) => y < g.y).length * (expandFactor - 1),
  }));
}

function getPathLength(g1: Galaxy, g2: Galaxy): number {
  return Math.abs(g1.x - g2.x) + Math.abs(g1.y - g2.y);
}

function getShortestPathSum(galaxies: Galaxy[]): number {
  return sum(
    galaxies.flatMap((g1) =>
      galaxies.flatMap((g2) =>
        g1.x < g2.x || (g1.x == g2.x && g1.y < g2.y)
          ? [getPathLength(g1, g2)]
          : [0],
      ),
    ),
  );
}

export function part1(input: string) {
  const galaxies = getGalaxies(input);
  const expandedGalaxies = expandGalaxies(galaxies);
  return getShortestPathSum(expandedGalaxies);
}

export function part2(input: string, expandFactor: number = 1000000) {
  const galaxies = getGalaxies(input);
  const expandedGalaxies = expandGalaxies(galaxies, expandFactor);
  return getShortestPathSum(expandedGalaxies);
}
