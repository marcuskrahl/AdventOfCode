export function getLines(input: string): string[] {
  return input.split('\n').map((l) => l.trim());
}

export function sum(numbers: number[]): number {
  return numbers.reduce((sum, n) => sum + n, 0);
}

export function first<T>(arr: readonly T[]): T {
  return arr[0];
}
export function last<T>(arr: readonly T[]): T {
  return arr[arr.length - 1];
}

export function min<T>(arr: readonly T[], cmp: (item: T) => number) {
  return arr.reduce((min, curr) => (cmp(min) <= cmp(curr) ? min : curr));
}
export function max<T>(arr: readonly T[], cmp: (item: T) => number) {
  return arr.reduce((max, curr) => (cmp(max) >= cmp(curr) ? max : curr));
}
