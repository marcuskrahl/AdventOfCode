import { assertNotNull, getLines } from './utils';

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
let minE = Number.MAX_SAFE_INTEGER;
function allIntersect(
  hailstones: Hailstone[],
  dx: number,
  dy: number,
): boolean {
  let px: number | undefined = undefined;
  let py: number | undefined = undefined;
  let equations: { [key: number]: Equation } = {};
  let countMatches = 0;
  //console.log(equations);
  for (let e1 = 0; e1 < hailstones.length; e1++) {
    for (let e2 = e1 + 1; e2 < hailstones.length; e2++) {
      const e = 0.5;
      if (
        hailstones[e1].p.x === hailstones[e2].p.x &&
        hailstones[e1].p.y === hailstones[e2].p.y
      ) {
        countMatches++;
        continue;
      }
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
      if (!Number.isFinite(eq1.m) || !Number.isFinite(eq2.m)) {
        countMatches++;
        continue;
      }
      if (Math.abs(eq1.m - eq2.m) < 0.01) {
        countMatches++;
        continue;
      }
      const { x, y } = getIntersection(eq1, eq2);
      //console.log(x, y);
      if (!Number.isFinite(x) || !Number.isFinite(y)) {
        console.log('infinite');
        console.log(eq1, eq2);
        return false;
      }
      {
        countMatches++;
      }
      if (px === undefined) {
        px = x;
      }
      if (py === undefined) {
        py = y;
      }
      if (Math.abs(px - x) > e || Math.abs(py - y) > e) {
        //console.log('mismatch');
        const delta = Math.abs(px - x) + Math.abs(py - y);
        if (delta < minE) {
          //console.log(delta);
          minE = delta;
        }
        if (countMatches > maxMatches) {
          console.log(dx, dy, countMatches);
          //console.log(equations);
          console.log(px, py);
          console.log(e1, e2);
          console.log(eq1, eq2);
          console.log(delta);
          maxMatches = countMatches;
        }
        //console.log(countMatches);
        //return countMatches > hailstones.length * 2;
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
    console.log(dx, dy, countMatches);
    //console.log(equations);
    console.log(px, py);
    maxMatches = countMatches;
  }
  //console.log(countMatches);
  return false;
}

function checkXY(hailstones: Hailstone[], x: number, y: number): boolean {
  return allIntersect(hailstones, x, y);
}

function findCorrectTrajectory(hailstones: Hailstone[]) {
  //console.log(hailstones);
  const minX = Math.min(...hailstones.map((h) => h.v.x));
  const maxX = Math.max(...hailstones.map((h) => h.v.x));
  const minY = Math.min(...hailstones.map((h) => h.v.y));
  const maxY = Math.max(...hailstones.map((h) => h.v.y));
  const endX =
    2 *
    Math.max(Math.abs(minX), Math.abs(maxX), Math.abs(minY), Math.abs(maxY));
  const startX = -endX;
  const endY = endX;
  const startY = -endY;
  //console.log(minX, maxX, minY, maxY);
  for (let i = 0; i < Number.MAX_SAFE_INTEGER; i++) {
    //console.log(i);
    for (let x = 0; x <= i; x++) {
      let y = i;
      if (checkXY(hailstones, x, y)) {
        console.log('can intersect 1', x, y);
        for (let z = 0; z <= 1000; z++) {
          if (
            checkXY(
              hailstones.map((h) => ({
                p: { x: h.p.x, y: h.p.z, z: h.p.y },
                v: { x: h.v.x, y: h.v.z, z: h.v.y },
              })),
              x,
              z,
            )
          ) {
            //console.log('z', z);
          }
        }
        return;
        //return `${x} + ${y}`;
      }
      if (checkXY(hailstones, -x, y)) {
        console.log('can intersect 2', -x, y);
        for (let z = 0; z <= 1000; z++) {
          if (
            checkXY(
              hailstones.map((h) => ({
                p: { x: h.p.x, y: h.p.z, z: h.p.y },
                v: { x: h.v.x, y: h.v.z, z: h.v.y },
              })),
              x,
              z,
            )
          ) {
            console.log('z', z);
          }
        }
        return;
        //return `${x} + ${y}`;
      }
      if (checkXY(hailstones, x, -y)) {
        console.log('can intersect 3', x, -y);
        for (let z = 0; z <= 1000; z++) {
          if (
            checkXY(
              hailstones.map((h) => ({
                p: { x: h.p.x, y: h.p.z, z: h.p.y },
                v: { x: h.v.x, y: h.v.z, z: h.v.y },
              })),
              x,
              z,
            )
          ) {
            console.log('z', z);
          }
        }
        return;
        //return `${x} + ${y}`;
      }
      if (checkXY(hailstones, -x, -y)) {
        console.log('can intersect 4', -x, -y);
        for (let z = 0; z <= 1000; z++) {
          if (
            checkXY(
              hailstones.map((h) => ({
                p: { x: h.p.x, y: h.p.z, z: h.p.y },
                v: { x: h.v.x, y: h.v.z, z: h.v.y },
              })),
              x,
              z,
            )
          ) {
            console.log('z', z);
          }
        }
        return;
        //return `${x} + ${y}`;
      }
    }
    for (let y = 0; y <= i; y++) {
      let x = i;
      if (checkXY(hailstones, x, y)) {
        console.log('can intersect 5', x, y);
        return;
        //return `${x} + ${y}`;
      }
      if (checkXY(hailstones, -x, y)) {
        console.log('can intersect 6', -x, y);
        maxMatches = 0;
        for (let z = -1000; z <= 1000; z++) {
          if (
            checkXY(
              hailstones.map((h) => ({
                p: { x: h.p.x, y: h.p.z, z: h.p.y },
                v: { x: h.v.x, y: h.v.z, z: h.v.y },
              })),
              x,
              z,
            )
          ) {
            console.log('z', z);
          }
        }
        return;
        //return `${x} + ${y}`;
      }
      if (checkXY(hailstones, x, -y)) {
        console.log('can intersect 7', x, -y);
        return;
        //return `${x} + ${y}`;
      }
      if (checkXY(hailstones, -x, -y)) {
        console.log('can intersect 8', -x, -y);
        return;
        //return `${x} + ${y}`;
      }
    }
  }
}

export function part2(input: string) {
  const hailstones = getLines(input).map(parseHailstone);
  return findCorrectTrajectory(hailstones.slice(0, 50));
  //day24bNoExternal(input);
}
let day24bNoExternal = function (input: string) {
  console.log('=========== day 24 part 2 ==========');

  let lines = input
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  let parseTriple = function (trip: string) {
    return trip.split(',').map((x) => +x.trim());
  };
  let parseLine = function (line: string) {
    let args = line.split('@');
    return [parseTriple(args[0]), parseTriple(args[1])];
  };
  let parsed = lines.map(parseLine);

  //particle at solution sx,sy,sz, velocity svx,svy,svz
  //equations are:
  //sx+svx*t[i]==x[i]+vx[i]*t[i] ...same for y,z.
  //sy+svy*t[i]==y[i]+vy[i]*t[i]
  //sz+svz*t[i]==z[i]+vz[i]*t[i]
  //Ok, let's assume svx,svy,svz are fixed and linear solve on that...

  //sx+(svx-vx[0])*t[0]==x[0]
  //sy+(svy-vy[0])*t[0]==y[0]
  //sz+(svz-vz[0])*t[0]==z[0]
  //
  //sx+(svx-vx[1])*t[1]==x[1]
  //sy+(svy-vy[1])*t[1]==y[1]
  //Matrix looks like:
  //[1 0 0 svx-vx[0]     0    ][ sx ]   [x[0]]
  //[0 1 0 svy-vy[0]     0    ][ sy ]   [y[0]]
  //[0 0 1 svz-vz[0]     0    ][ sz ] = [z[0]]
  //[1 0 0    0      svx-vx[1]][t[0]]   [x[1]]
  //[0 1 0    0      svy-vy[1]][t[1]]   [y[1]]
  // the matrix has determinant (svx-vx[1])*(svy-vy[0])-(svx-vx[0])*(svy-vy[1])
  // mvx1 mvy0 - mvx0 mvy1
  let linearSolve = function (
    n: number,
    m: number,
    svx: number,
    svy: number,
    svz: number,
  ) {
    let x0 = parsed[n][0][0];
    let y0 = parsed[n][0][1];
    let z0 = parsed[n][0][2];
    let x1 = parsed[m][0][0];
    let y1 = parsed[m][0][1];
    let x0v = parsed[n][1][0];
    let y0v = parsed[n][1][1];
    let z0v = parsed[n][1][2];
    let x1v = parsed[m][1][0];
    let y1v = parsed[m][1][1];
    let mvx0 = svx - parsed[n][1][0];
    let mvy0 = svy - parsed[n][1][1];
    let mvz0 = svz - parsed[n][1][2];
    let mvx1 = svx - parsed[m][1][0];
    let mvy1 = svy - parsed[m][1][1];
    let det = mvx1 * mvy0 - mvx0 * mvy1;
    if (det != 0) {
      return [
        (mvx1 * mvy0 * x0 - mvx0 * mvy1 * x1 + mvx0 * mvx1 * (-y0 + y1)) / det,
        (mvy0 * mvy1 * (x0 - x1) - mvx0 * mvy1 * y0 + mvx1 * mvy0 * y1) / det,
        (mvy1 * mvz0 * (x0 - x1) + mvx1 * mvz0 * (-y0 + y1)) / det + z0,
        (mvy1 * (-x0 + x1) + mvx1 * (y0 - y1)) / det,
        (mvy0 * (-x0 + x1) + mvx0 * (y0 - y1)) / det,
      ];
    }
    return undefined;
  };
  //error function
  let ef = function (svx: number, svy: number, svz: number): number {
    let nums1 = linearSolve(0, 1, svx, svy, svz);
    let nums2 = linearSolve(2, 1, svx, svy, svz);
    if (!nums1 || !nums2) return undefined as any;
    let dsx = nums1[0] - nums2[0];
    let dsy = nums1[1] - nums2[1];
    let dsz = nums1[2] - nums2[2];
    let dt = nums1[4] - nums2[4];
    return dsx + dsy + dsz + dt;
  };
  let xm = 0,
    ym = 0,
    zm = 0;
  let minimumfound: any = undefined;
  //Let's search in progressively larger shells around the origin.
  //This is just boring ctrl-c ctrl-v code for the six faces of a cube.
  //x,y,z are the velocities of the line, I guess I should have named them svx,svy,svz.
  for (let r = 1; r < 400; r++) {
    for (let x = -r; x < r + 1; x++) {
      for (let y = -r; y < r + 1; y++) {
        for (let z = -r; z < r + 1; z += 2 * r) {
          let e = ef(x, y, z);
          if (!isNaN(e)) {
            if (minimumfound == undefined) {
              xm = x;
              ym = y;
              zm = z;
              minimumfound = Math.abs(e);
            } else if (Math.abs(e) < minimumfound) {
              xm = x;
              ym = y;
              zm = z;
              minimumfound = Math.abs(e);
            }
          }
        }
      }
    }
    for (let x = -r; x < r + 1; x++) {
      for (let y = -r; y < r + 1; y += 2 * r) {
        for (let z = -r; z < r + 1; z += 1) {
          let e = ef(x, y, z);
          if (!isNaN(e)) {
            if (minimumfound == undefined) {
              xm = x;
              ym = y;
              zm = z;
              minimumfound = Math.abs(e);
            } else if (Math.abs(e) < minimumfound) {
              xm = x;
              ym = y;
              zm = z;
              minimumfound = Math.abs(e);
            }
          }
        }
      }
    }
    for (let x = -r; x < r + 1; x += 2 * r) {
      for (let y = -r; y < r + 1; y++) {
        for (let z = -r; z < r + 1; z++) {
          let e = ef(x, y, z);
          if (!isNaN(e)) {
            if (minimumfound == undefined) {
              xm = x;
              ym = y;
              zm = z;
              minimumfound = Math.abs(e);
            } else if (Math.abs(e) < minimumfound) {
              xm = x;
              ym = y;
              zm = z;
              minimumfound = Math.abs(e);
            }
          }
        }
      }
    }
    console.log(
      'Minimum found for r=' +
        r +
        ' is (' +
        xm +
        ',' +
        ym +
        ',' +
        zm +
        ') with e=' +
        minimumfound,
    );
    if (minimumfound < 1) break;
  }
  let nums1 = linearSolve(0, 1, xm, ym, zm)!;
  console.log('Solution found is:');
  console.log(nums1[0] + nums1[1] + nums1[2]);
};
