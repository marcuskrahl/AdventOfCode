import { sum } from '@adventofcode2022/util';

function snafuChar(snafuChar: string): number {
  switch (snafuChar) {
    case '0':
      return 0;
    case '1':
      return 1;
    case '2':
      return 2;
    case '-':
      return -1;
    case '=':
      return -2;
    default:
      throw new Error('unexpected snafu char ' + snafuChar);
  }
}

export function decToSnafu(dec: number): string {
  let nextDigit = 0;
  const remainder = dec % 5;
  const rest = Math.floor(dec / 5);
  if (remainder < 3) {
    if (rest != 0) {
      return decToSnafu(rest) + remainder.toString();
    }
    return remainder.toString();
  }
  if (remainder === 3) {
    return decToSnafu(rest + 1) + '=';
  }
  if (remainder === 4) {
    return decToSnafu(rest + 1) + '-';
  }
  throw new Error('should not be reachable');
}

export function snafuToDec(snafu: string): number {
  return sum(
    snafu
      .split('')
      .reverse()
      .map((c, i) => snafuChar(c) * Math.pow(5, i))
  );
}

export function part1(lines: string[]): string {
  return decToSnafu(sum(lines.map((l) => snafuToDec(l))));
}

export function part2(lines: string[]): number {
  return 0;
}
