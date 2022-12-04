import { part1, part2 } from './code';

describe('advent of code day', () => {
  const sampleInput: string[] = [
    '2-4,6-8',
    '2-3,4-5',
    '5-7,7-9',
    '2-8,3-7',
    '6-6,4-6',
    '2-6,4-8',
  ];

  it('should solve part1', () => {
    expect(part1(sampleInput)).toEqual(2);
  });

  it('should solve part2', () => {
    expect(part2(sampleInput)).toEqual(4);
  });
});
