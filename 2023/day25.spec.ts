import { part1 } from './day25';

describe('day 25', () => {
  const input = `jqt: rhn xhk nvd
rsh: frs pzl lsr
xhk: hfx
cmg: qnr nvd lhk bvb
rhn: xhk bvb hfx
bvb: xhk hfx
pzl: lsr hfx nvd
qnr: nvd
ntq: jqt hfx bvb xhk
nvd: lhk
lsr: lhk
rzs: qnr cmg lsr rsh
frs: qnr lhk lsr`;

  it('should solve part 1', () => {
    expect(part1(input)).toBe(54);
  });

  it('should solve part 2', () => {});
});
