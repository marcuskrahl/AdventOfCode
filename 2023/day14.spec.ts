import { part1, part2 } from './day14';

describe('day 14', () => {
  const input = `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`;

  it('should solve part 1', () => {
    expect(part1(input)).toBe(136);
  });

  it('should solve part 2', () => {
    expect(part2(input)).toBe(64);
  });
});
