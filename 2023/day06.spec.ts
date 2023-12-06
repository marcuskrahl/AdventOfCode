import { part1, part2 } from './day06';

describe('day 06', () => {
  const input = `Time:      7  15   30
Distance:  9  40  200`;
  it('should solve part 1', () => {
    expect(part1(input)).toEqual(288);
  });

  it('should solve part 2', () => {
    expect(part2(input)).toEqual(71503);
  });
});
