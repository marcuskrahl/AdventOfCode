import { part1, part2 } from './day21';

describe('day 21', () => {
  const input = `...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`;

  it('should solve part 1', () => {
    expect(part1(input, 6)).toBe(16);
  });

  it('should solve part 2', () => {
    expect(part2(input, 6)).toBe(16);
    expect(part2(input, 10)).toBe(50);
    expect(part2(input, 50)).toBe(1594);
    expect(part2(input, 100)).toBe(6536);
    expect(part2(input, 500)).toBe(167004);
    expect(part2(input, 1000)).toBe(668697);
    expect(part2(input, 5000)).toBe(16733044);
    /*
     */
  });
});
