import { groupLines, sum, max, max3 } from '@adventofcode2022/util';

function caloriesPerElf(lines: readonly string[]): number[] {
  return groupLines(lines).map(elf => sum(elf.map(e => parseInt(e))));
}
export function part1(lines: readonly string[]): number {
  const calories = caloriesPerElf(lines);
  return max(calories);
}

export function part2(lines: readonly string[]): number {
  const calories = caloriesPerElf(lines);
  return sum(max3(calories));
}


