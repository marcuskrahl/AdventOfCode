import { getLines, sum } from './utils';

interface NumberCoords {
  n: number;
  startX: number;
  endX: number;
  y: number;
}

interface Symbol {
  symbol: string;
  x: number;
  y: number;
}

function parseGrid(lines: string[]): [NumberCoords[], Symbol[]] {
  return lines
    .map((line, y) => {
      let n = 0;
      let startX = 0;
      const lineNumbers: NumberCoords[] = [];
      const lineSymbols: Symbol[] = [];
      for (let x = 0; x < line.length; x++) {
        const parsedNumber = Number.parseInt(line[x], 10);
        if (isNaN(parsedNumber)) {
          if (n !== 0) {
            lineNumbers.push({
              n,
              startX,
              endX: x - 1,
              y,
            });
            n = 0;
          }
          if (line[x] !== '.') {
            lineSymbols.push({
              symbol: line[x],
              x,
              y,
            });
          }
        } else {
          if (n === 0) {
            startX = x;
          }
          n *= 10;
          n += parsedNumber;
        }
      }
      if (n != 0) {
        lineNumbers.push({
          n,
          startX,
          endX: line.length - 1,
          y,
        });
      }
      return [lineNumbers, lineSymbols] as const;
    })
    .reduce<[NumberCoords[], Symbol[]]>(
      ([gridNumbers, gridSymbols], [lineNumbers, lineSymbols]) => [
        [...gridNumbers, ...lineNumbers],
        [...gridSymbols, ...lineSymbols],
      ],
      [[], []],
    );
}

function isAdjacent(s: Symbol, n: NumberCoords): boolean {
  return Math.abs(s.y - n.y) <= 1 && s.x >= n.startX - 1 && s.x <= n.endX + 1;
}
function isPartNumber(n: NumberCoords, symbols: Symbol[]): boolean {
  return symbols.some((s) => isAdjacent(s, n));
}

export function part1(input: string) {
  const lines = getLines(input);
  const [numberCoords, symbols] = parseGrid(lines);
  return sum(
    numberCoords.filter((n) => isPartNumber(n, symbols)).map((n) => n.n),
  ).toString();
}

function getGear(s: Symbol, numberCoords: NumberCoords[]): number {
  if (s.symbol !== '*') {
    return 0;
  }
  const adjacentNumbers = numberCoords.filter((n) => isAdjacent(s, n));
  if (adjacentNumbers.length < 2) {
    return 0;
  }
  return adjacentNumbers[0].n * adjacentNumbers[1].n;
}

export function part2(input: string) {
  const lines = getLines(input);
  const [numberCoords, symbols] = parseGrid(lines);
  return sum(symbols.map((s) => getGear(s, numberCoords))).toString();
}
