import { part1, part2 } from './day01';

const input = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`;

const input_part2 = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`;

describe.only('day 01', () => {
  it('should solve part 1', () => {
    expect(part1(input)).toEqual('142');
  });

  it('should solve part 2', () => {
    expect(part2(input_part2)).toEqual('281');
  });

  it('should handle edge case', () => {
    expect(part2('9twone')).toEqual('91');
  });
});
