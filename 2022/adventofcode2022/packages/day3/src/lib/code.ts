import { sum, group3 } from '@adventofcode2022/util';

function splitCompartments(line: string): [string, string] {
  const middle = line.length / 2;
  return [line.slice(0, middle), line.slice(middle)];
}

function itemInBoth([firstCompartment, secondCompartment]: [
  string,
  string
]): string {
  return firstCompartment
    .split('')
    .find((i) => secondCompartment.split('').includes(i))!;
}

function scoreItem(item: string): number {
  if (item.toLowerCase() === item) {
    return item.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
  }
  return item.charCodeAt(0) - 'A'.charCodeAt(0) + 27;
}

function commonItem([g1,g2,g3]: string[]): string {
  return g1.split('').find(item => g2.split('').some(i => item === i) && g3.split('').some(i => item === i))!;
}

export function part1(lines: string[]): number {
  const scores = lines
    .filter((l) => l !== '')
    .map((l) => splitCompartments(l))
    .map((c) => itemInBoth(c))
    .map((i) => scoreItem(i));
  return sum(scores);
}

export function part2(lines: string[]): number {

  const groups = group3(lines.filter((l) => l !== ''));
  const scores = groups.map(g => commonItem(g)).map(i => scoreItem(i));
  return sum(scores);
}
