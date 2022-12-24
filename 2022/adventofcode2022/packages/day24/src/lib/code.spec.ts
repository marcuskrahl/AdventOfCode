import { part1, part2 } from './code';

describe('advent of code day', () => {
  const sampleInput: string[] = [
    '#.######',
    '#>>.<^<#',
    '#.<..<<#',
    '#>v.><>#',
    '#<^v^^>#',
    '######.#',
  ];

  it('should solve part1', () => {
    expect(part1(sampleInput)).toEqual(18);
  });

  it('should solve part2', () => {
    expect(part2(sampleInput)).toEqual(54);
  });
});
