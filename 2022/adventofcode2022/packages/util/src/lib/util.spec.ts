import { isContainedInOther, isOverlap, util } from './util';

describe('util', () => {
  it.each`
    range1     | range2    | result
    ${[0, 1]}  | ${[2, 3]} | ${false}
    ${[0, 1]}  | ${[1, 2]} | ${false}
    ${[1, 2]}  | ${[0, 1]} | ${false}
    ${[2, 3]}  | ${[0, 1]} | ${false}
    ${[0, 10]} | ${[4, 5]} | ${true}
    ${[2, 5]}  | ${[2, 3]} | ${true}
  `(
    'should calculate containment between $range1 and $range2 to $result',
    ({ range1, range2, result }) => {
      expect(isContainedInOther(range1, range2)).toBe(result);
    }
  );

  it.each`
    range1     | range2    | result
    ${[0, 1]}  | ${[2, 3]} | ${false}
    ${[0, 1]}  | ${[1, 2]} | ${true}
    ${[1, 2]}  | ${[0, 1]} | ${true}
    ${[2, 3]}  | ${[0, 1]} | ${false}
    ${[0, 10]} | ${[4, 5]} | ${true}
    ${[2, 5]}  | ${[2, 3]} | ${true}
  `(
    'should calculate overlap between $range1 and $range2 to $result',
    ({ range1, range2, result }) => {
      expect(isOverlap(range1, range2)).toBe(result);
    }
  );
});
