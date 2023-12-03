import { part1, part2 } from './day03';

describe('day 00', () => {
  const input = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;

  it('should solve part 1', () => {
    const result = part1(input);
    expect(result).toEqual('4361');
  });

  it('should solve part 2', () => {
    const result = part2(input);
    expect(result).toEqual('467835');
  });
});
