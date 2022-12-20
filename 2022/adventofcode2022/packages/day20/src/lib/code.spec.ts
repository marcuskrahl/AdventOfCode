import { part1, part2 } from './code';

describe('advent of code day', () => {
  const sampleInput: string[] = ['1', '2', '-3', '3', '-2', '0', '4'];

  it('should solve part1', () => {
    expect(part1(sampleInput)).toEqual(3);
  });

  it('should solve part2', () => {
    expect(part2(sampleInput)).toEqual(1623178306);
  });
});
