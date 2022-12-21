import { part1, part2 } from './code';

describe('advent of code day', () => {
  const sampleInput: string[] = [
    'root: pppw + sjmn',
    'dbpl: 5',
    'cczh: sllz + lgvd',
    'zczc: 2',
    'ptdq: humn - dvpt',
    'dvpt: 3',
    'lfqf: 4',
    'humn: 5',
    'ljgn: 2',
    'sjmn: drzm * dbpl',
    'sllz: 4',
    'pppw: cczh / lfqf',
    'lgvd: ljgn * ptdq',
    'drzm: hmdt - zczc',
    'hmdt: 32',
  ];

  it('should solve part1', () => {
    expect(part1(sampleInput)).toEqual(152);
  });

  it('should solve part2', () => {
    expect(part2(sampleInput)).toEqual(301);
  });
});
