type Position = {
  x: number;
  y: number;
};

function parseInput(lines: string[]): Position[] {
  return lines.flatMap((line) => {
    const [direction, amountString] = line.split(' ');
    const amount = parseInt(amountString);
    let offset: Position;
    switch (direction) {
      case 'R':
        offset = { x: 1, y: 0 };
        break;
      case 'L':
        offset = { x: -1, y: 0 };
        break;
      case 'U':
        offset = { x: 0, y: -1 };
        break;
      case 'D':
        offset = { x: 0, y: 1 };
        break;
    }
    return Array.from({ length: amount }, () => ({ ...offset }));
  });
}

function moveHead(position: Position, offset: Position): Position {
  return {
    x: position.x + offset.x,
    y: position.y + offset.y,
  };
}

function moveTail(ownPosition: Position, headPosition: Position): Position {
  const dx = headPosition.x - ownPosition.x;
  const dy = headPosition.y - ownPosition.y;
  if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
    return {
      ...ownPosition,
    };
  }
  return {
    x: ownPosition.x + Math.sign(dx),
    y: ownPosition.y + Math.sign(dy),
  };
}

export function part1(lines: string[]): number {
  let headPosition = { x: 0, y: 0 };
  let tailPosition = { x: 0, y: 0 };
  let movements = parseInput(lines);
  let uniquePositions = [tailPosition];
  for (let movement of movements) {
    headPosition = moveHead(headPosition, movement);
    tailPosition = moveTail(tailPosition, headPosition);
    if (
      !uniquePositions.some(
        ({ x, y }) => x === tailPosition.x && y === tailPosition.y
      )
    ) {
      uniquePositions = [...uniquePositions, tailPosition];
    }
  }
  return uniquePositions.length;
}

export function part2(lines: string[]): number {
  let knotPositions = Array.from({ length: 10 }, () => ({ x: 0, y: 0 }));
  let movements = parseInput(lines);
  let uniquePositions = [knotPositions[knotPositions.length - 1]];
  for (let movement of movements) {
    knotPositions[0] = moveHead(knotPositions[0], movement);
    for (let i = 1; i < knotPositions.length; i++) {
      knotPositions[i] = moveTail(knotPositions[i], knotPositions[i - 1]);
    }
    const tailPosition = knotPositions[knotPositions.length - 1];
    if (
      !uniquePositions.some(
        ({ x, y }) => x === tailPosition.x && y === tailPosition.y
      )
    ) {
      uniquePositions = [...uniquePositions, tailPosition];
    }
  }
  return uniquePositions.length;
}
