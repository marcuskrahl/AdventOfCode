import { part1, part2 } from './day24';

describe('day 24', () => {
  const input = `19, 13, 30 @ -2,  1, -2
18, 19, 22 @ -1, -1, -2
20, 25, 34 @ -2, -2, -4
12, 31, 28 @ -1, -2, -1
20, 19, 15 @  1, -5, -3`;

  it('should solve part 1', () => {
    expect(part1(input, 7, 27)).toBe(2);
  });

  it('should solve part 2', () => {
    expect(part2(input)).toBe(47);
  });
});
