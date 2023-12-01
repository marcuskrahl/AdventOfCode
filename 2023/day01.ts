import { getLines, max, min, sum } from './utils';

function calibrationValue(
  line: string,
  replacements: readonly [string, number][],
): number {
  const replacementPositions = replacements
    .map(([r, d]) => indicesOfReplacement(line, r, d))
    .filter((r) => r.first !== -1);
  if (replacementPositions.length === 0) {
    return 0;
  }
  const minReplacement = min(replacementPositions, (r) => r.first);
  const maxReplacement = max(replacementPositions, (r) => r.last);
  const firstDigit = minReplacement.digit;
  const lastDigit = maxReplacement.digit;
  return firstDigit * 10 + lastDigit;
}

const digitReplacements: [string, number][] = [
  ['1', 1],
  ['2', 2],
  ['3', 3],
  ['4', 4],
  ['5', 5],
  ['6', 6],
  ['7', 7],
  ['8', 8],
  ['9', 9],
];
const wordReplacements: [string, number][] = [
  ['one', 1],
  ['two', 2],
  ['three', 3],
  ['four', 4],
  ['five', 5],
  ['six', 6],
  ['seven', 7],
  ['eight', 8],
  ['nine', 9],
];

function indicesOfReplacement(
  line: string,
  replacement: string,
  digit: number,
) {
  return {
    replacement,
    digit,
    first: line.indexOf(replacement),
    last: line.lastIndexOf(replacement),
  };
}

export function part1(input: string) {
  const lines = getLines(input);
  return sum(
    lines.map((l) => calibrationValue(l, digitReplacements)),
  ).toString();
}

export function part2(input: string) {
  const lines = getLines(input);
  return sum(
    lines.map((l) =>
      calibrationValue(l, [...digitReplacements, ...wordReplacements]),
    ),
  ).toString();
}
