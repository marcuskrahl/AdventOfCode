import { part1, part2 } from './day16';

describe('day 16', () => {
  const input = `.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`;
  it('should solve part 1', () => {
    expect(part1(input)).toBe(46);
  });

  it('should solve part 2', () => {
    expect(part2(input)).toBe(51);
  });
});
