import { part1, part2 } from './day1';

describe('day1', () => {
  it('part1', () => {
    const input = [
      '1000',
      '2000',
      '3000',
      '',
      '4000',
      '',
      '5000',
      '6000',
      '',
      '7000',
      '8000',
      '9000',
      '',
      '10000',
    ];
    expect(part1(input)).toEqual(24000);
  });
  it('part2', () => {
    const input = [
      '1000',
      '2000',
      '3000',
      '',
      '4000',
      '',
      '5000',
      '6000',
      '',
      '7000',
      '8000',
      '9000',
      '',
      '10000',
    ];
    expect(part2(input)).toEqual(45000);
  });
});
