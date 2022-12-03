import { part1, part2 } from './code';

describe('advent of code day', () => {
  const sampleInput: string[] = [
    'vJrwpWtwJgWrhcsFMMfFFhFp',
    'jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL',
    'PmmdzqPrVvPwwTWBwg',
    'wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn',
    'ttgJtRGJQctTZtZT',
    'CrZsJsPPZsGzwwsLwLmpwMDw',
  ];

  it('should solve part1', () => {
    expect(part1(sampleInput)).toEqual(157);
  });

  it('should solve part2', () => {
    expect(part2(sampleInput)).toEqual(70);
  });
});
