import { groupLines, sum } from '@adventofcode2022/util';

type Value = number | Value[];

function isValid([left, right]: Value[][]): boolean | undefined {
  if (left.length === 0) {
    return right.length === 0 ? undefined : true;
  }
  if (right.length === 0) {
    return false;
  }
  const headLeft = left[0];
  const headRight = right[0];
  if (typeof headLeft === 'number' && typeof headRight === 'number') {
    if (headLeft < headRight) {
      return true;
    }
    if (headLeft > headRight) {
      return false;
    }
    return isValid([left.slice(1), right.slice(1)]);
  }
  const headLeftAsArray = Array.isArray(headLeft) ? headLeft : [headLeft];
  const headRightAsArray = Array.isArray(headRight) ? headRight : [headRight];
  const subResult = isValid([headLeftAsArray, headRightAsArray]);
  if (subResult == undefined) {
    return isValid([left.slice(1), right.slice(1)]);
  }
  return subResult;
}

function countValidPairs(pairs: Value[][][]): number {
  return sum(pairs.map((pair, i) => (isValid(pair) ? i + 1 : 0)));
}

export function part1(lines: string[]): number {
  const pairs = groupLines(lines).map((pair) =>
    pair.map((p) => JSON.parse(p) as Value[])
  );
  return countValidPairs(pairs);
}

export function part2(lines: string[]): number {
  const pairs = groupLines(lines)
    .map((pair) => pair.map((p) => JSON.parse(p) as Value[]))
    .flat(1)
    .concat([[[2]], [[6]]]);
  pairs.sort((p1, p2) => {
    const sortResult = isValid([p1, p2]);
    return sortResult === true ? -1 : sortResult === false ? 1 : 0;
  });

  const index1 = pairs.findIndex((p) => JSON.stringify(p) === '[[2]]')! + 1;
  const index2 = pairs.findIndex((p) => JSON.stringify(p) === '[[6]]')! + 1;
  return index1 * index2;
}
