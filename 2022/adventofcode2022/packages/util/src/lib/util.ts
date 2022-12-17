export function* bufferInput(input: string, bufferSize: number) {
  for (let i = 0; i <= input.length - bufferSize; i++) {
    yield [i, input.slice(i, i + bufferSize)] as const;
  }
}
export function* bufferArray<T>(input: T[], bufferSize: number) {
  for (let i = 0; i <= input.length - bufferSize; i++) {
    yield [i, input.slice(i, i + bufferSize)] as const;
  }
}

export function* windowInput<T>(input: readonly T[], windowSize: number) {
  for (let i = 0; i <= input.length; i += windowSize) {
    yield input.slice(i, i + windowSize);
  }
}

export function isUnique(segment: string): boolean {
  return segment.split('').every((s, i) => segment.indexOf(s) === i);
}

export function util(): string {
  return 'util';
}

export function groupLines(lines: readonly string[]): string[][] {
  return lines.reduce(
    (acc: string[][], curr: string) => {
      if (curr === '') {
        return [...acc, []];
      } else {
        return [...acc.slice(0, -1), [...acc.at(-1)!, curr]];
      }
    },
    [[]]
  );
}

export function max(data: readonly number[]): number {
  return data.reduce((acc, curr) => (curr > acc ? curr : acc), 0);
}

export function min(data: readonly number[]): number {
  return data.reduce(
    (acc, curr) => (curr < acc ? curr : acc),
    Number.MAX_SAFE_INTEGER
  );
}

export function max3(data: readonly number[]): [number, number, number] {
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

export function sum(data: readonly number[]): number {
  return data.reduce((acc, curr) => acc + curr, 0);
}

export function group3(data: readonly string[]): string[][] {
  return data.reduce(
    (acc: string[][], curr) => {
      const currentArray = acc.at(-1)!;
      if (currentArray.length === 3) {
        return [...acc, [curr]];
      }
      return [...acc.slice(0, -1), [...currentArray, curr]];
    },
    [[]]
  );
}

export function isContainedInOther(
  [a1, a2]: [number, number],
  [b1, b2]: [number, number]
): boolean {
  return (a1 <= b1 && a2 >= b2) || (b1 <= a1 && b2 >= a2);
}

export function isOverlap(
  [a1, a2]: [number, number],
  [b1, b2]: [number, number]
): boolean {
  if (a2 < b1 && a1 < b1) {
    return false;
  }
  if (b2 < a1 && b1 < a1) {
    return false;
  }
  return true;
}
