import { part1, part2 } from './day13';

describe('day 13', () => {
  const input = `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`;

  it('should solve part 1', () => {
    expect(part1(input)).toBe(405);
  });

  it('should solve part 2', () => {
    expect(part2(input)).toBe(400);
  });
});
