import { getLines, pairwise, sum } from './utils';

function getNextValue(numbers: number[]): number {
  if (numbers.every((n) => n === 0)) {
    return 0;
  }
  let differences = Array.from(pairwise(numbers)).map(([a, b]) => b - a);
  const nextValue = numbers.slice(-1)[0] + getNextValue(differences);
  return nextValue;
}

export function part1(input: string) {
  return sum(
    getLines(input)
      .map((line) => line.split(' ').map((n) => parseInt(n, 10)))
      .map((numbers) => getNextValue(numbers)),
  );
}

function getPreviousValues(numbers: number[]): number {
  if (numbers.every((n) => n === 0)) {
    return 0;
  }
  let differences = Array.from(pairwise(numbers)).map(([a, b]) => b - a);
  const previousValue = numbers[0] - getPreviousValues(differences);
  return previousValue;
}

export function part2(input: string) {
  return sum(
    getLines(input)
      .map((line) => line.split(' ').map((n) => parseInt(n, 10)))
      .map((numbers) => getPreviousValues(numbers)),
  );
}
