import {
  Grid,
  assertNotNull,
  getLines,
  getNeighbors,
  mapGrid,
  max,
  min,
  newGrid,
  printGrid,
  sum,
  sumGrid,
} from './utils';

interface Instruction {
  direction: 'R' | 'L' | 'U' | 'D';
  color: string;
  steps: number;
}

interface Border {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export function parseInstruction(input: string): Instruction {
  const regex = /^([RLUD]) (\d+) \(#([\w\d]+)\)$/;
  const result = regex.exec(input);
  assertNotNull(result);
  return {
    direction: result[1] as 'R' | 'L' | 'U' | 'D',
    color: result[3],
    steps: parseInt(result[2], 10),
  };
}

function getBorders(instructions: Instruction[]): Border[] {
  let x = 0;
  let y = 0;
  let borders: Border[] = [];
  for (let instruction of instructions) {
    let [xo, yo] = getOffset(instruction.direction);
    let endX = x + instruction.steps * xo;
    let endY = y + instruction.steps * yo;
    borders.push({ startX: x, startY: y, endX, endY });
    x = endX;
    y = endY;
  }
  return borders;
}

function getOffset(direction: 'R' | 'L' | 'U' | 'D'): [number, number] {
  switch (direction) {
    case 'R':
      return [1, 0];
    case 'L':
      return [-1, 0];
    case 'U':
      return [0, -1];
    case 'D':
      return [0, 1];
  }
}

export function getLineArea(
  x: number,
  horizontalLines: Border[],
  verticalLines: Border[],
): number {
  let inside = false;
  let area = 0;
  let oldY = 0;
  //console.log('x', x);
  for (let i = 0; i < horizontalLines.length; i++) {
    const border = horizontalLines[i];
    if (border.endX < x || border.startX > x) {
      //not relevant
      continue;
    }
    //console.log('\tfound border at y=', border.startY);
    if (border.startX !== x && border.endX !== x) {
      //we are in a normal shape, so advance normally
      if (inside === false) {
        //console.log('\tnow inside');
        inside = true;
        oldY = border.endY;
      } else {
        //console.log('\tnow outside');
        inside = false;
        area += border.endY - oldY + 1;
        //console.log('\ttotal area = ', area);
      }
      continue;
    }
    //console.log('\thit a corner');
    //we hit either the start or the end of a line
    const verticalLine = verticalLines.find(
      (v) =>
        v.startX === x &&
        (v.startY === border.endY || v.startY === border.startY),
    );
    //console.log('\t', verticalLine);
    assertNotNull(
      verticalLine,
      'vertical line should be present at this point',
    );
    if (verticalLine.endY === border.endY) {
      //we hit the end of a line
      //this should not be possible because we advance manually through the line
      throw new Error('met end of line');
    }
    if (inside === true) {
      area += border.endY - oldY;
      //console.log('\t was inside; area=', area);
    }
    //advance to next border
    let nextBorder = undefined;
    while (i < horizontalLines.length) {
      i++;
      nextBorder = horizontalLines[i];
      if (nextBorder.startX === x || nextBorder.endX === x) {
        break;
      }
    }
    assertNotNull(nextBorder);
    //console.log('\t', nextBorder);
    if (
      nextBorder.startX != border.startX &&
      nextBorder.endX != border.startX &&
      nextBorder.startX != border.endX &&
      nextBorder.endX != border.endX
    ) {
      throw new Error('next border is not a corner');
    }
    area += nextBorder.endY - border.startY + 1;
    //console.log('\tsave line length; area=', area);
    const switchInside =
      border.startX === nextBorder.endX || border.endX === nextBorder.startX;
    //console.log('\tswitch inside ', switchInside, inside);
    if (switchInside) {
      inside = !inside;
    }
    oldY = nextBorder.startY + 1;
  }
  //console.log('total area ', area);
  return area;
}

type LineDirection = { [key: number]: boolean };

function getArea(borders: Border[]): number {
  const sortedBorders = borders;
  const horizontalLines = sortedBorders
    .filter((b) => b.endY === b.startY)
    .map((b) => {
      if (b.startX > b.endX) {
        return {
          startX: b.endX,
          startY: b.endY,
          endX: b.startX,
          endY: b.endY,
        };
      } else {
        return b;
      }
    })
    .toSorted((b1, b2) => b1.startY - b2.startY);
  const verticalLines = sortedBorders

    .filter((b) => b.endX === b.startX)
    .map((b) => {
      if (b.startY > b.endY) {
        return {
          startY: b.endY,
          startX: b.endX,
          endY: b.startY,
          endX: b.endX,
        };
      } else {
        return b;
      }
    })
    .toSorted((v1, v2) => v1.startY - v2.startY);
  const verticalLineX = Object.fromEntries(
    verticalLines.map((v) => [v.startX, true]),
  );
  const lineDirections: LineDirection = {};
  /*for (let line of horizontalLines) {
    const startLine = verticalLines.find((l) => l.startX === line.startX);
    const endLine = verticalLines.find((l) => l.endX === line.endX);
    assertNotNull(startLine);
    assertNotNull(endLine);
    lineDirections[line.startY] =
      lineDirection(endLine, line) === lineDirection(startLine, line);
  }*/
  const minX = min(horizontalLines, ({ startX }) => startX).startX;
  const maxX = max(horizontalLines, ({ endX }) => endX).endX;
  let area = 0;
  let cachedArea = 0;
  for (let x = minX; x <= maxX; x++) {
    if (verticalLineX === undefined) {
      area += cachedArea;
      continue;
    }
    cachedArea = getLineArea(x, horizontalLines, verticalLines);
    /*xArea += Math.min(
      getLineArea(x + 0.1, horizontalLines, verticalLines),
      getLineArea(x - 0.1, horizontalLines, verticalLines),
    );
    xArea += sum(
      verticalLines
        .filter((v) => v.endX === x)
        .map((v) => Math.abs(v.endY - v.startY) + 1),
    );*/
    /*xArea += sum(
      verticalLines
        .filter((v) => v.endX === x)
        .filter(
          (v) =>
            horizontalLines.filter((h) => h.endX === x && h.endY === v.startY)
              .length > 0,
        )
        .map((v) => Math.abs(v.startY - v.endY) + 1),
    );*/
    //console.log(x, xArea);
    area += cachedArea;
  }
  //console.log(minX, maxX);
  return area;
}

export function part1(input: string) {
  const instructions = getLines(input).map(parseInstruction);
  /*const grid = pathGrid(instructions);
  const filledGrid = fillGrid(grid);
  return sumGrid(filledGrid, (v) => (v === '#' ? 1 : 0));*/
  const borders = getBorders(instructions);
  //console.log(borders);
  return getArea(borders);
}

export function flipInstruction(instruction: Instruction): Instruction {
  const step = parseInt(instruction.color.slice(0, -1), 16);
  const direction = parseInt(instruction.color.slice(-1), 16);
  const directionStr: { [key: number]: 'R' | 'D' | 'U' | 'L' } = {
    0: 'R',
    1: 'D',
    2: 'L',
    3: 'U',
  } as const;
  return {
    ...instruction,
    steps: step,
    direction: directionStr[direction],
  };
}

export function part2(input: string) {
  const instructions = getLines(input)
    .map(parseInstruction)
    .map(flipInstruction);
  /*const grid = pathGrid(instructions);
  const filledGrid = fillGrid(grid);
  return sumGrid(filledGrid, (v) => (v === '#' ? 1 : 0));*/
  const borders = getBorders(instructions);
  //console.log(borders);
  return getArea(borders);
}
