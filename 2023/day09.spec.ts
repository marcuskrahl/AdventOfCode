import { part1, part2 } from './day09';

describe('day 09', () => {
  const input = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`;

  it('should solve part 1', () => {
    expect(part1(input)).toBe(114);
  });

  it('should solve part 2', () => {
    expect(part2(input)).toBe(2);
  });
});
