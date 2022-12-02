import { readFileSync } from 'fs';

function caloriesPerElf(lines: readonly string[]): number[] {
  return lines.reduce(
    (acc: number[], curr: string) => {
      if (curr === '') {
        return [...acc, 0];
      } else {
        return [...acc.slice(0, -1), acc.at(-1)! + parseInt(curr)];
      }
    },
    [0]
  );
}

function max(data: readonly number[]): number {
  return data.reduce((acc, curr) => (curr > acc ? curr : acc), 0);
}

function max3(data: readonly number[]): [number, number, number] {
  return data.reduce(
    ([a, b, c], curr) =>
      curr > a
        ? [curr, a, b]
        : curr > b
        ? [a, curr, b]
        : curr > c
        ? [a, b, curr]
        : [a, b, c],
    [0, 0, 0]
  );
}

function sum(data: readonly number[]): number {
  return data.reduce((acc, curr) => acc + curr, 0);
}
export function part1(lines: readonly string[]): number {
  const calories = caloriesPerElf(lines);
  return max(calories);
}

export function part2(lines: readonly string[]): number {
  const calories = caloriesPerElf(lines);
  return sum(max3(calories));
}

function loadInput(): string[] {
  return readFileSync(__dirname + '/input', { encoding: 'utf8' }).split(
    '\n'
  );
}

const result = part2(loadInput());
console.log(result);
