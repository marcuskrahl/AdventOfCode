import { part1, part2 } from './day11';

describe('day 00', () => {
  const input = `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`;
  it('should solve part 1', () => {
    expect(part1(input)).toBe(374);
  });

  it('should solve part 2', () => {
    expect(part2(input, 10)).toBe(1030);
    expect(part2(input, 100)).toBe(8410);
  });
});
