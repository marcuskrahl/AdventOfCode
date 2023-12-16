import { assertNotNull, sum } from './utils';

function hash(line: string): number {
  return line.split('').reduce((value, char) => {
    value = value + char.charCodeAt(0);
    value = value * 17;
    value = value % 256;
    return value;
  }, 0);
}

export function part1(input: string) {
  return sum(input.split(',').map((l) => hash(l)));
}

interface Lense {
  focalLength: number;
  label: string;
}

function applyCommand(boxes: Lense[][], command: string): void {
  const values = /^(\w+)([-=])(\d+)?$/.exec(command);
  assertNotNull(values);
  const label = values[1];
  const operation = values[2];
  const focalLength = parseInt(values[3], 10);
  const boxIndex = hash(label);
  if (boxes[boxIndex] === undefined) {
    boxes[boxIndex] = [];
  }
  const box = boxes[boxIndex];
  const lenseIndex = box.findIndex((l) => l.label === label);
  if (operation === '-') {
    if (lenseIndex >= 0) {
      box.splice(lenseIndex, 1);
    }
  }
  if (operation === '=') {
    if (lenseIndex >= 0) {
      box[lenseIndex] = { label, focalLength };
    } else {
      box.push({ label, focalLength });
    }
  }
}

function getFocusingPower(boxes: Lense[][]): number {
  let focusingPower = 0;
  for (let x = 0; x < 256; x++) {
    if (boxes[x] === undefined) {
      continue;
    }
    focusingPower += sum(
      boxes[x].map((lense, i) => (x + 1) * (i + 1) * lense.focalLength),
    );
  }
  return focusingPower;
}

export function part2(input: string) {
  const boxes: Lense[][] = [];
  input.split(',').forEach((command) => applyCommand(boxes, command));
  return getFocusingPower(boxes);
}
