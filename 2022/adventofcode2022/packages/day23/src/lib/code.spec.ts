import { part1, part2 } from './code';

describe('advent of code day', () => {
  const sampleInput: string[] = [
    '....#..',
    '..###.#',
    '#...#.#',
    '.#...##',
    '#.###..',
    '##.#.##',
    '.#..#..',
  ];

  const sampleInputSmall: string[] = [
    '.....',
    '..##.',
    '..#..',
    '.....',
    '..##.',
    '.....',
  ];

  it('should solve part1', () => {
    //expect(part1(sampleInputSmall)).toEqual(110);
    expect(part1(sampleInput)).toEqual(110);
  });

  it('should solve part2', () => {
    expect(part2(sampleInput)).toEqual(20);
  });
});
