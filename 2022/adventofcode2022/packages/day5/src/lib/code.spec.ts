import { part1, part2, splitInput } from './code';

describe('advent of code day', () => {
  const sampleInput: string[] = [
    '    [D]           ',
    '[N] [C]           ',
    '[Z] [M] [P]       ',
    ' 1   2   3        ',
    '',
    'move 1 from 2 to 1',
    'move 3 from 1 to 3',
    'move 2 from 2 to 1',
    'move 1 from 1 to 2',
  ];

  it('should correctly parse input', () => {
    const [crates, operations] = splitInput(sampleInput);

    expect(crates).toEqual([['Z', 'N'], ['M', 'C', 'D'], ['P']]);
    expect(operations).toEqual([
      { amount: 1, from: 2, to: 1 },
      { amount: 3, from: 1, to: 3 },
      { amount: 2, from: 2, to: 1 },
      { amount: 1, from: 1, to: 2 },
    ]);
  });

  it('should solve part1', () => {
    expect(part1(sampleInput)).toEqual('CMZ');
  });

  it('should solve part2', () => {
    expect(part2(sampleInput)).toEqual('MCD');
  });
});
