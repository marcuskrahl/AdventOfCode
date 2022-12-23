import { min, max } from '@adventofcode2022/util';

type Position = {
  x: number;
  y: number;
};

type MapKey = string;
type ElfPositions = Map<MapKey, Position>;

type Movement = { check: Position[]; move: Position };

function positionToKey(position: Position): MapKey {
  //return (position.y << 32) + position.x;
  return `${position.y}.${position.x}`;
}

function parseElves(lines: readonly string[]): ElfPositions {
  const positions = lines.flatMap((line, y) =>
    line.split('').flatMap((c, x) => (c === '.' ? [] : [{ x, y }]))
  );
  console.log(positions);
  const map = new Map<MapKey, Position>();
  positions.forEach((p) => map.set(positionToKey(p), p));
  console.log(map.values());
  return map;
}

function getMoves(): Movement[] {
  return [
    {
      check: [
        { x: -1, y: -1 },
        { x: 0, y: -1 },
        { x: 1, y: -1 },
      ],
      move: { x: 0, y: -1 },
    },
    {
      check: [
        { x: -1, y: 1 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ],
      move: { x: 0, y: 1 },
    },
    {
      check: [
        { x: -1, y: -1 },
        { x: -1, y: 0 },
        { x: -1, y: 1 },
      ],
      move: { x: -1, y: 0 },
    },
    {
      check: [
        { x: 1, y: -1 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
      ],
      move: { x: 1, y: 0 },
    },
  ];
}

function doRound(elfPositions: ElfPositions, moves: Movement[]): boolean {
  const elves = Array.from(elfPositions.values());
  const movements: [Position, Position][] = [];
  //first half
  for (let elf of elves) {
    if (
      moves
        .flatMap((m) => m.check)
        .every(
          (c) =>
            !elfPositions.has(positionToKey({ x: elf.x + c.x, y: elf.y + c.y }))
        )
    ) {
      //no elf nearby
      continue;
    }
    for (let m of moves) {
      if (
        m.check.some((c) =>
          elfPositions.has(positionToKey({ x: elf.x + c.x, y: elf.y + c.y }))
        )
      ) {
        continue;
      }
      movements.push([elf, { x: elf.x + m.move.x, y: elf.y + m.move.y }]);
      break;
    }
  }
  let didMove: boolean = false;
  //second half
  for (let [elf, destination] of movements) {
    if (
      movements.filter(
        ([_, d]) => d.x === destination.x && d.y === destination.y
      ).length === 1
    ) {
      //move elf
      elfPositions.delete(positionToKey(elf));
      elfPositions.set(positionToKey(destination), destination);
      didMove = true;
    }
  }

  const first = moves.shift()!;
  moves.push(first);
  return didMove;
}

function calculateGround(elfPositions: ElfPositions): number {
  const elves = Array.from(elfPositions.values());
  const minX = min(elves.map((p) => p.x));
  const maxX = max(elves.map((p) => p.x));
  const minY = min(elves.map((p) => p.y));
  const maxY = max(elves.map((p) => p.y));
  return (maxY - minY + 1) * (maxX - minX + 1) - elves.length;
}

function printElves(elfPositions: ElfPositions): void {
  const elves = Array.from(elfPositions.values());
  const minX = min(elves.map((p) => p.x));
  const maxX = max(elves.map((p) => p.x));
  const minY = min(elves.map((p) => p.y));
  const maxY = max(elves.map((p) => p.y));
  let output = '';
  for (let y = minY; y <= maxY; y++) {
    let line = '';
    for (let x = minX; x <= maxX; x++) {
      line += elfPositions.has(positionToKey({ x, y })) ? '#' : '.';
    }
    output += line + '\r\n';
  }
  console.log(output);
}

export function part1(lines: string[]): number {
  const elfPositions = parseElves(lines);
  const moves = getMoves();
  for (let i = 0; i < 10; i++) {
    printElves(elfPositions);
    doRound(elfPositions, moves);
  }
  return calculateGround(elfPositions);
}

export function part2(lines: string[]): number {
  const elfPositions = parseElves(lines);
  const moves = getMoves();
  for (let i = 1; i < Number.MAX_SAFE_INTEGER; i++) {
    //printElves(elfPositions);
    const didMove = doRound(elfPositions, moves);
    if (!didMove) {
      return i;
    }
  }
  throw new Error('should stabilize');
}
