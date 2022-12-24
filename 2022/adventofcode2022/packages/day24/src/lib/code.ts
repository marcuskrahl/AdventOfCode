type Pos = { x: number; y: number };
type Blizzard = {
  pos: Pos;
  direction: Pos;
};

type Map = {
  width: number;
  height: number;
  blizzards: Blizzard[];
};

function parseMap(lines: readonly string[]): Map {
  const blizzards = lines.flatMap((line, y) =>
    line.split('').flatMap((c, x) => {
      let direction: Pos;
      switch (c) {
        case '.':
        case '#':
          return [];
        case '<':
          direction = { x: -1, y: 0 };
          break;
        case '>':
          direction = { x: 1, y: 0 };
          break;
        case '^':
          direction = { x: 0, y: -1 };
          break;
        case 'v':
          direction = { x: 0, y: 1 };
          break;
        default:
          throw new Error('unexpected  char ' + c);
      }
      return [
        {
          pos: { x, y },
          direction,
        },
      ];
    })
  );
  const height = lines.length;
  const width = lines[0].length;
  return {
    width,
    height,
    blizzards,
  };
}

function moveBlizzards(map: Map): void {
  for (let blizzard of map.blizzards) {
    const newPos = {
      x: blizzard.pos.x + blizzard.direction.x,
      y: blizzard.pos.y + blizzard.direction.y,
    };
    if (newPos.x <= 0) {
      newPos.x = map.width - 2;
    }
    if (newPos.y <= 0) {
      newPos.y = map.height - 2;
    }
    if (newPos.x >= map.width - 1) {
      newPos.x = 1;
    }
    if (newPos.y >= map.height - 1) {
      newPos.y = 1;
    }
    blizzard.pos = newPos;
  }
}

let directions = [
  { x: 0, y: 1 },
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 0 },
];

function getValidPositions(positions: Pos[], map: Map): Pos[] {
  return positions.filter(
    (p) => !map.blizzards.some((b) => b.pos.x === p.x && b.pos.y === p.y)
  );
}

function isValidPosition(newPos: Pos, map: Map): boolean {
  if (newPos.x === 1 && newPos.y === 0) {
    return true;
  }
  if (newPos.x < 1) {
    return false;
  }
  if (newPos.y < 1) {
    return false;
  }
  if (newPos.x === map.width - 2 && newPos.y === map.height - 1) {
    return true;
  }
  if (newPos.x > map.width - 2) {
    return false;
  }
  if (newPos.y > map.height - 2) {
    return false;
  }
  return true;
}

function stepMap(map: Map, positions: Pos[]): Pos[] {
  const validPositions = getValidPositions(positions, map);
  const newPositions: Pos[] = [];
  for (let pos of validPositions) {
    for (let dir of directions) {
      let newPos = { x: pos.x + dir.x, y: pos.y + dir.y };
      if (
        isValidPosition(newPos, map) &&
        !newPositions.some((p) => p.x === newPos.x && p.y === newPos.y)
      ) {
        newPositions.push(newPos);
      }
    }
  }
  moveBlizzards(map);
  return newPositions;
}

function printGrid(map: Map, positions: Pos[]): void {
  let output = '';
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      if (y === 0 || y === map.height - 1 || x === 0 || x === map.width - 1) {
        output += '#';
        continue;
      }
      if (positions.some((p) => p.x === x && p.y === y)) {
        /*output += 'P';
        continue;*/
      }
      const blizzards = map.blizzards.filter(
        (b) => b.pos.x === x && b.pos.y === y
      );
      if (blizzards.length === 0) {
        output += '.';
        continue;
      }
      if (blizzards.length > 1) {
        output += blizzards.length;
        continue;
      }
      if (blizzards[0].direction.x === -1) {
        output += '<';
        continue;
      } else if (blizzards[0].direction.x === 1) {
        output += '>';
        continue;
      } else if (blizzards[0].direction.y === -1) {
        output += '^';
        continue;
      } else if (blizzards[0].direction.y === 1) {
        output += 'v';
        continue;
      }
      throw new Error('error');
    }
    output += '\r\n';
  }
  console.log(output);
}

export function part1(lines: string[]): number {
  const map = parseMap(lines);
  let positions: Pos[] = [{ x: 1, y: 0 }];
  for (let i = 1; i < Number.MAX_SAFE_INTEGER; i++) {
    console.log(
      'step ' + i,
      'positions ' + getValidPositions(positions, map).length
    );
    positions = stepMap(map, positions);
    if (
      positions.some((p) => p.x === map.width - 2 && p.y === map.height - 1)
    ) {
      return i;
    }
    if (positions.length === 0) {
      throw new Error('no valid positions remaining');
    }
  }
  return 0;
}

export function part2(lines: string[]): number {
  const map = parseMap(lines);
  let positions: Pos[] = [{ x: 1, y: 0 }];
  let steps = 1;
  for (let i = 1; i < Number.MAX_SAFE_INTEGER; i++) {
    console.log(
      'step ' + i,
      'positions ' + getValidPositions(positions, map).length
    );
    positions = stepMap(map, positions);
    if (
      (steps === 1 || steps === 3) &&
      positions.some((p) => p.x === map.width - 2 && p.y === map.height - 1)
    ) {
      if (steps === 3) {
        return i;
      }
      steps++;
      positions = [{ x: map.width - 2, y: map.height - 1 }];
    }
    if (steps === 2 && positions.some((p) => p.x === 1 && p.y === 0)) {
      steps++;
      positions = [{ x: 1, y: 0 }];
    }
    if (positions.length === 0) {
      throw new Error('no valid positions remaining');
    }
  }
  return 0;
}
