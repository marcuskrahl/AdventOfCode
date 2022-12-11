import { part1, part2 } from './code';

describe('advent of code day', () => {
  const sampleInput: string[] = [
    'Monkey 0:',
    '  Starting items: 79, 98',
    '  Operation: new = old * 19',
    '    Test: divisible by 23',
    '      If true: throw to monkey 2',
    '      If false: throw to monkey 3',
    '',
    'Monkey 1:',
    '  Starting items: 54, 65, 75, 74',
    '  Operation: new = old + 6',
    '    Test: divisible by 19',
    '      If true: throw to monkey 2',
    '      If false: throw to monkey 0',
    '',
    'Monkey 2:',
    '  Starting items: 79, 60, 97',
    '  Operation: new = old * old',
    '    Test: divisible by 13',
    '      If true: throw to monkey 1',
    '      If false: throw to monkey 3',
    '',
    'Monkey 3:',
    '  Starting items: 74',
    '  Operation: new = old + 3',
    '    Test: divisible by 17',
    '      If true: throw to monkey 0',
    '      If false: throw to monkey 1',
  ];

  it('should solve part1', () => {
    expect(part1(sampleInput)).toEqual(10605);
  });

  it('should solve part2', () => {
    expect(part2(sampleInput)).toEqual(2713310158);
  });
});
