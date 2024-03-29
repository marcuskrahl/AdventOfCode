import { part1, part2 } from './day02';

describe('day 02', () => {
  const input = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;

  it('should solve part 1', () => {
    const result = part1(input);
    expect(result).toBe('8');
  });

  it('should solve part 2', () => {
    const result = part2(input);
    expect(result).toBe('2286');
  });
});
