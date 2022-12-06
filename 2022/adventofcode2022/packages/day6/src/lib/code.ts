import { bufferInput, isUnique } from '@adventofcode2022/util';

function getMarkerStart(input: string, bufferSize: number): number {
  for (const [i, segment] of bufferInput(input, bufferSize)) {
    if (isUnique(segment)) {
      return i + bufferSize;
    }
  }
  throw new Error('no marker found');
}
export function part1(lines: string[]): number {
  return getMarkerStart(lines[0], 4);
}

export function part2(lines: string[]): number {
  return getMarkerStart(lines[0], 14);
}
