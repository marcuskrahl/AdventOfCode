import { part1, part2 } from './code';

describe('advent of code day', () => {
  const sampleInput: string[] = [
    '498,4 -> 498,6 -> 496,6',
    '503,4 -> 502,4 -> 502,9 -> 494,9',
  ];

  it('should solve part1', () => {
    expect(part1(sampleInput)).toEqual(24);
  });

  it('should solve part2', () => {
    expect(part2(sampleInput)).toEqual(93);
  });
});
