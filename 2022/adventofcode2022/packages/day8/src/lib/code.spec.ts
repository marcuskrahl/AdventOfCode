import { part1, part2 } from './code';

describe('advent of code day', () => {
  const sampleInput: string[] = ['30373', '25512', '65332', '33549', '35390'];

  it('should solve part1', () => {
    expect(part1(sampleInput)).toEqual(21);
  });

  it('should solve part2', () => {
    expect(part2(sampleInput)).toEqual(8);
  });
});
