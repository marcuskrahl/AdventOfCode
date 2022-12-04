import { isContainedInOther, isOverlap } from '@adventofcode2022/util';

function mapToRange(line: string): [[number, number], [number, number]] {
  return line
    .split(',')
    .map((s) => s.split('-').map((c) => parseInt(c, 10))) as [
    [number, number],
    [number, number]
  ];
}

export function part1(lines: string[]): number {
  return lines
    .filter((l) => l !== '')
    .map((l) => mapToRange(l))
    .filter(([c1, c2]) => isContainedInOther(c1, c2)).length;
}

export function part2(lines: string[]): number {
  return lines
    .filter((l) => l !== '')
    .map((l) => mapToRange(l))
    .filter(([c1, c2]) => isOverlap(c1, c2)).length;
}
