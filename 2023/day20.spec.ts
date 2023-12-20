import { part1 } from './day20';

describe('day 20', () => {
  const input1 = `broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a`;

  const input2 = `broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output`;

  it('should solve part 1', () => {
    expect(part1(input1)).toBe(32000000);
    expect(part1(input2)).toBe(11687500);
  });

  it('should solve part 2', () => {});
});
