import { part1, part2 } from './code';

describe('advent of code day', () => {
  const sampleInput: string[] = ['mjqjpqmgbljsphdztnvjfqwrcgsmlb'];

  it('should solve part1', () => {
    expect(part1(sampleInput)).toEqual(7);
    expect(part1(['bvwbjplbgvbhsrlpgdmjqwftvncz'])).toBe(5);
    expect(part1(['nppdvjthqldpwncqszvftbrmjlhg'])).toBe(6);
    expect(part1(['nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg'])).toBe(10);
    expect(part1(['zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw'])).toBe(11);
  });

  it('should solve part2', () => {
    expect(part2(sampleInput)).toEqual(19);
    expect(part2(['bvwbjplbgvbhsrlpgdmjqwftvncz'])).toBe(23);
    expect(part2(['nppdvjthqldpwncqszvftbrmjlhg'])).toBe(23);
    expect(part2(['nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg'])).toBe(29);
    expect(part2(['zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw'])).toBe(26);
  });
});
