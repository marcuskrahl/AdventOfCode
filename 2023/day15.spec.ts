import { part1, part2 } from './day15';

describe('day 15', () => {
  const input = `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`;

  it('should solve part 1', () => {
    expect(part1(input)).toBe(1320);
  });

  it('should solve part 2', () => {
    expect(part2(input)).toBe(145);
  });
});
