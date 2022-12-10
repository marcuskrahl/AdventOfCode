import { sum } from '@adventofcode2022/util';

function prepareInput(lines: string[]): number[] {
  return lines.flatMap((line) =>
    line === 'noop' ? [0] : [0, parseInt(line.split(' ')[1])]
  );
}

function runCycles(cycles: number[]): number {
  return 1 + sum(cycles);
}

function interestingSignalSum(cycles: number[], signals: number[]): number {
  return sum(
    signals.map((signal) => signal * runCycles(cycles.slice(0, signal - 1)))
  );
}

function generateOutput(cycles: number[]): string[] {
  let result: string[] = [];
  for (let y = 0; y < 6; y++) {
    let line = '';
    for (let x = 0; x < 40; x++) {
      const signal = runCycles(cycles.slice(0, y * 40 + x));
      const isLit = Math.abs(signal - x) <= 1;
      line += isLit ? '█' : ' ';
    }
    result = [...result, line];
  }
  return result;
}

export function part1(lines: string[]): number {
  const cycles = prepareInput(lines);
  const result = interestingSignalSum(cycles, [20, 60, 100, 140, 180, 220]);
  //const result = interestingSignalSum(cycles, [220]);
  return result;
}

export function part2(lines: string[]): number {
  const cycles = prepareInput(lines);
  const output = generateOutput(cycles);
  console.log(output.join('\n'));
  return 0;
}
