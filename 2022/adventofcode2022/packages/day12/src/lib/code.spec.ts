import { part1, part2 } from './code';

describe('advent of code day', () => {
  const sampleInput: string[] = [
    'Sabqponm',
    'abcryxxl',
    'accszExk',
    'acctuvwj',
    'abdefghi',
  ];

  it('should solve part1', () => {
    expect(part1(sampleInput)).toEqual(31);
  });

  it('should solve part2', () => {
    expect(part2(sampleInput)).toEqual(29);
  });
});
