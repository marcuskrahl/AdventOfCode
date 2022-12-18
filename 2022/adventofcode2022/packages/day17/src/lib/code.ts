import { max } from '@adventofcode2022/util';

type Offset = { x: number; y: number };

type Shape = Offset[];

type Grid = (number | undefined)[][];

//const shiftWindow = 1_000_000;
//const shiftWindow = 4_000_000;

function* getNextShape() {
  while (true) {
    yield [
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 4, y: 0 },
      { x: 5, y: 0 },
    ];
    yield [
      { x: 3, y: 0 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 3, y: 2 },
    ];
    yield [
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 4, y: 0 },
      { x: 4, y: 1 },
      { x: 4, y: 2 },
    ];
    yield [
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 2, y: 3 },
    ];
    yield [
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
    ];
  }
}

function getMovements(input: string): number[] {
  return input.split('').map((d) => (d === '>' ? 1 : -1));
}

function moveToStart(shape: Shape, startHeight: number): Shape {
  return shape.map((c) => ({ x: c.x, y: c.y + startHeight + 4 }));
}

function canDoMovement(movement: Offset, shape: Shape, grid: Grid): boolean {
  const newPosition = doMovement(movement, shape);
  if (
    newPosition.some(
      (p) => p.x < 0 || p.x > 6 || p.y < 0 || grid[p.x][p.y] !== undefined
    )
  ) {
    return false;
  }
  return true;
}

function doMovement(movement: Offset, shape: Shape): Shape {
  return shape.map((c) => ({ x: c.x + movement.x, y: c.y + movement.y }));
}

function persistShape(shape: Shape, shapeCount: number, grid: Grid): void {
  shape.forEach((c) => (grid[c.x][c.y] = shapeCount));
}

function printGrid(grid: Grid, maxHeight: number): void {
  let result = '';
  for (let y = maxHeight; y >= 0; y--) {
    for (let x = 0; x < 7; x++) {
      result += grid[x][y] !== undefined ? '#' : '.';
    }
    result += '\r\n';
  }
  console.log(result);
}

function clearShiftWindow(grid: Grid, start: number, end: number): void {
  return;
  for (let y = start; y <= end; y++) {
    for (let x = 0; x < 7; x++) {
      grid[x][y] = undefined;
    }
  }
}

function checkRepetition(
  grid: Grid,
  shapeCount: number,
  maxHeight: number
): { row: number; gap: number; shapeCount: number } | undefined {
  let effectiveMaxHeight = maxHeight - 1000;
  //console.log('checking repetition ', maxRow, effectiveMaxHeight);
  for (let y = effectiveMaxHeight - 1; y >= 0; y--) {
    let found = true;
    for (let rowOffset = 0; rowOffset < 2000 && found; rowOffset++) {
      for (let x = 0; x < 7 && found; x++) {
        if (
          (grid[x][y - rowOffset] === undefined) !==
          (grid[x][effectiveMaxHeight - rowOffset] === undefined)
        ) {
          /*console.log(
            grid[x][y - rowOffset],
            grid[x][effectiveMaxHeight - rowOffset]
          );*/
          found = false;
        }
      }
    }
    if (found) {
      let shapeGap = 0;
      for (let x = 0; x < 7; x++) {
        const shapeBottom = grid[x][y];
        const shapeTop = grid[x][effectiveMaxHeight];
        if (shapeBottom !== undefined && shapeTop !== undefined) {
          shapeGap = shapeTop - shapeBottom;
        }
      }
      return {
        row: y,
        gap: effectiveMaxHeight - y,
        shapeCount: shapeGap,
      };
    }
  }
  //console.log('no repetition found');
  return undefined;
}

function simulate(allMovements: number[], runs: number): number {
  let maxHeight = -1;
  let movements = [...allMovements];
  const shapes = getNextShape();
  let grid: Grid = [];
  for (let i = 0; i < 7; i++) {
    grid[i] = [];
  }
  let lastHeight = 0;
  let heights = [];
  let repeatCounter = 0;
  let simulationPoint: number | undefined = undefined;
  let shapeRep: number = 0;
  let heightRep: number = 0;
  let twice = 0;
  for (let i = 0; i < runs; i++) {
    //if (i % (allMovements.length * 5) === 0) {
    // console.log(maxHeight, maxHeight - lastHeight);
    // lastHeight = maxHeight;
    // }
    //if (i % 5 && movements.length === 0) {
    //  const deltaH = maxHeight - lastHeight;
    //  const existingHeight = heights.findIndex((h) => h === deltaH);
    //  if (
    //    existingHeight != undefined &&
    //    heights[existingHeight - 1] === heights.at(-1) &&
    //    heights[existingHeight - 2] === heights.at(-2) &&
    //    heights[existingHeight - 3] === heights.at(-3) &&
    //    heights[existingHeight - 4] === heights.at(-4)
    //  ) {
    //    console.log('candidate: ', i);
    //    console.log(heights.slice(-5));
    //    console.log(heights.slice(existingHeight - 5, existingHeight));
    //    repeatCounter++;
    //    if (repeatCounter > 3) {
    //      break;
    //    }
    //  }
    //  heights.push(deltaH);
    //  lastHeight = maxHeight;
    //}
    //if (i % 1_000_000 === 0 && i > 0) {
    //printGrid(grid, maxHeight);
    if (simulationPoint === undefined || twice < 1000) {
      const repetition = checkRepetition(grid, i, maxHeight);
      if (repetition) {
        twice++;
        simulationPoint =
          repetition.shapeCount * (1 + Math.floor(i / repetition.shapeCount)) +
          (runs % repetition.shapeCount);
        shapeRep = repetition.shapeCount;
        heightRep = repetition.gap;
        console.log(
          'found repetition, simulate up to ',
          repetition,
          simulationPoint,
          i
        );
      }
    }
    //}
    let shape = moveToStart(shapes.next().value!, maxHeight);
    while (true) {
      if (movements.length === 0) {
        movements = [...allMovements];
      }
      let movement = movements.shift()!;
      if (canDoMovement({ x: movement, y: 0 }, shape, grid)) {
        //console.log(movement);
        shape = doMovement({ x: movement, y: 0 }, shape);
      }
      if (canDoMovement({ x: 0, y: -1 }, shape, grid)) {
        shape = doMovement({ x: 0, y: -1 }, shape);
        continue;
      }
      const shapeHeight = max(shape.map((c) => c.y));
      if (shapeHeight > maxHeight) {
        clearShiftWindow(grid, maxHeight + 1, shapeHeight);
        maxHeight = shapeHeight;
      }
      persistShape(shape, i, grid);
      if (i === simulationPoint) {
        const repetitions = (runs - i) / shapeRep;
        console.log(
          repetitions,
          (runs - i) % shapeRep,
          runs % shapeRep,
          i % shapeRep
        );
        return maxHeight + repetitions * heightRep;
      }
      //printGrid(grid, maxHeight);
      break;
    }
  }
  return maxHeight + 1;
}

export function part1(lines: string[]): number {
  const movements = getMovements(lines[0]);
  return simulate(movements, 2022);
}

export function part2(lines: string[]): number {
  const movements = getMovements(lines[0]);
  return simulate(movements, 1000000000000);
  //return simulate(movements, 2022);
}
