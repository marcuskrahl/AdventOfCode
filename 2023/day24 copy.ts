import { assertNotNull, getLines, max } from './utils';

type Coordinate = {
  x: number;
  y: number;
  z: number;
};
type Hailstone = {
  p: Coordinate;
  v: Coordinate;
};

type Equation = {
  m: number;
  n: number;
  min: Coordinate;
  max: Coordinate;
};

function parseHailstone(line: string): Hailstone {
  const regex =
    /^([\d-]+),\s*([\d-]+),\s*([\d-]+)\s*@\s*([\d-]+),\s*([\d-]+),\s*([\d-]+)$/;
  const result = regex.exec(line);
  assertNotNull(result);

  return {
    p: {
      x: parseInt(result[1], 10),
      y: parseInt(result[2], 10),
      z: parseInt(result[3], 10),
    },
    v: {
      x: parseInt(result[4], 10),
      y: parseInt(result[5], 10),
      z: parseInt(result[6], 10),
    },
  };
}

function getEquation(hailstone: Hailstone): Equation {
  const m = hailstone.v.y / hailstone.v.x;
  const n = hailstone.p.y - m * hailstone.p.x;
  const current = hailstone.p;
  const min = {
    x: Number.MIN_SAFE_INTEGER,
    y: Number.MIN_SAFE_INTEGER,
    z: Number.MIN_SAFE_INTEGER,
  };
  const max = {
    x: Number.MAX_SAFE_INTEGER,
    y: Number.MAX_SAFE_INTEGER,
    z: Number.MAX_SAFE_INTEGER,
  };
  if (hailstone.v.x < 0) {
    max.x = current.x;
  } else {
    min.x = current.x;
  }
  if (hailstone.v.y < 0) {
    max.y = current.y;
  } else {
    min.y = current.y;
  }
  return {
    m,
    n,
    min,
    max,
  };
}

function getIntersection(
  eq1: Equation,
  eq2: Equation,
): { x: number; y: number } {
  const x = (eq2.n - eq1.n) / (eq1.m - eq2.m);
  const y = eq1.m * x + eq1.n;
  return {
    x,
    y,
  };
}

function getIntersections(
  equations: Equation[],
  start: number,
  end: number,
): number {
  let count = 0;
  for (let e1 = 0; e1 < equations.length; e1++) {
    for (let e2 = e1 + 1; e2 < equations.length; e2++) {
      const eq1 = equations[e1];
      const eq2 = equations[e2];
      const { x, y } = getIntersection(eq1, eq2);
      //console.log(x, y);
      if (
        x > eq1.max.x ||
        x > eq2.max.x ||
        x < eq1.min.x ||
        x < eq1.min.x ||
        x > eq2.max.x ||
        x > eq2.max.x ||
        x < eq2.min.x ||
        x < eq2.min.x ||
        y > eq1.max.y ||
        y > eq2.max.y ||
        y < eq1.min.y ||
        y < eq1.min.y ||
        y > eq2.max.y ||
        y > eq2.max.y ||
        y < eq2.min.y ||
        y < eq2.min.y
      ) {
        //console.log('outside min/max', x, eq1, eq2);
      } else if (x >= start && x <= end && y >= start && y <= end) {
        count++;
      } else {
        //console.log('outside area');
      }
    }
  }
  return count;
}

export function part1(
  input: string,
  start = 200000000000000,
  end = 400000000000000,
) {
  const hailstones = getLines(input).map(parseHailstone);
  const equations = hailstones.map(getEquation);
  return getIntersections(equations, start, end);
}
let maxMatches = 0;
function allIntersect(
  hailstones: Hailstone[],
  dx: number,
  dy: number,
): Coordinate | undefined {
  let px: number | undefined = undefined;
  let py: number | undefined = undefined;
  let equations: { [key: number]: Equation } = {};
  let countMatches = 0;
  //console.log(equations);
  for (let e1 = 0; e1 < hailstones.length; e1++) {
    for (let e2 = e1 + 1; e2 < hailstones.length; e2++) {
      if (equations[e1] === undefined) {
        const h = hailstones[e1];
        equations[e1] = getEquation({
          ...h,
          v: { x: h.v.x - dx, y: h.v.y - dy, z: h.v.z },
        });
      }
      if (equations[e2] === undefined) {
        const h = hailstones[e2];
        equations[e2] = getEquation({
          ...h,
          v: { x: h.v.x - dx, y: h.v.y - dy, z: h.v.z },
        });
      }
      const eq1 = equations[e1];
      const eq2 = equations[e2];
      const e = 0.001;
      if (Math.abs(eq1.m - eq2.m) < e) {
        countMatches++;

        //return undefined;
        continue;
      }
      const { x, y } = getIntersection(eq1, eq2);
      //console.log(x, y);
      if (!Number.isFinite(x) || !Number.isFinite(y)) {
        //console.log('infinite');
        //return undefined;
        return undefined;
      } else {
        countMatches++;
      }
      if (px === undefined) {
        px = x;
      }
      if (py === undefined) {
        py = y;
      }
      if (Math.abs(px - x) > e || Math.abs(py - y) > e) {
        return undefined;
        //console.log('mismatch');
        //return undefined;
        // console.log(Math.abs(px - x), Math.abs(py - y));
      } else {
        countMatches++;
      }
      //console.log(x, y);
      if (
        x > eq1.max.x ||
        x > eq2.max.x ||
        x < eq1.min.x ||
        x < eq1.min.x ||
        x > eq2.max.x ||
        x > eq2.max.x ||
        x < eq2.min.x ||
        x < eq2.min.x ||
        y > eq1.max.y ||
        y > eq2.max.y ||
        y < eq1.min.y ||
        y < eq1.min.y ||
        y > eq2.max.y ||
        y > eq2.max.y ||
        y < eq2.min.y ||
        y < eq2.min.y
      ) {
        //return false;
      }
    }
  }
  if (countMatches > maxMatches) {
    console.log(countMatches, dx, dy);
    maxMatches = countMatches;
  }
  return countMatches > 100000 ? { x: px!, y: py!, z: 0 } : undefined;
}

function checkXY(
  hailstones: Hailstone[],
  x: number,
  y: number,
): Coordinate | undefined {
  return (
    allIntersect(hailstones, x, y) ??
    allIntersect(hailstones, -x, y) ??
    allIntersect(hailstones, x, -y) ??
    allIntersect(hailstones, -x, -y)
  );
}

function findCorrectTrajectory(hailstones: Hailstone[]): Coordinate {
  /*console.log(checkXY(hailstones, 18, 80));
  if (1 === 2 - 1) {
    return {} as any;
  }*/
  //console.log(minX, maxX, minY, maxY);
  for (let i = 0; i < Number.MAX_SAFE_INTEGER; i++) {
    //console.log(i);
    for (let x = 0; x <= i; x++) {
      //console.log(i);
      let y = i;
      let result = checkXY(hailstones, x, y);
      if (result === undefined) {
        continue;
      }
      console.log('can intersect ', x, y);
      console.log(result);
      return result;
    }
    for (let y = 0; y <= i; y++) {
      let x = i;
      let result = checkXY(hailstones, x, y);
      if (result === undefined) {
        continue;
      }
      console.log('can intersect ', x, y);
      console.log(result);
      return result;
    }
  }
  /*const limit = 100;
  for (let x = -limit; x <= limit; x++) {
    for (let y = -limit; y <= limit; y++) {
      let result = checkXY(hailstones, x, y);
      if (result === undefined) {
        continue;
      }
      console.log('can intersect ', x, y);
      console.log(result);
      return result;
    }
  }*/
  throw new Error('nothing found');
}

export function part2(input: string) {
  const hailstones = getLines(input).map(parseHailstone);
  const velocity = findCorrectTrajectory(hailstones);
  return velocity;
}
