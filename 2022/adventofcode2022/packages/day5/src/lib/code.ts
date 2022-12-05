type CrateStack = string[];
type Operation = { amount: number; from: number; to: number };

function parseCrateStacks(lines: readonly string[]): CrateStack[] {
  const [indexLine, ...reversedLines] = [...lines].reverse();
  const stackIndices = indexLine.split(' ').filter((i) => i !== '');
  const stacks = stackIndices.map((i) => {
    const index = indexLine.indexOf(i);
    return reversedLines
      .map((l) => (l.at(index) ?? '').trim())
      .filter((s) => s !== '');
  });
  return stacks;
}

function parseOperations(lines: readonly string[]): Operation[] {
  return lines.map((l) => {
    const result = /move (\d+) from (\d+) to (\d+)/.exec(l);
    if (result == null) {
      throw new Error('regex mismatch: ' + l);
    }
    return {
      amount: parseInt(result[1]),
      from: parseInt(result[2]),
      to: parseInt(result[3]),
    };
  });
}

function performMovement(
  stacks: CrateStack[],
  operation: Operation
): CrateStack[] {
  const cratesToMove = stacks[operation.from - 1]
    .slice(-operation.amount)
    .reverse();
  return stacks.map((stack, i) => {
    if (i === operation.from - 1) {
      return stack.slice(0, -operation.amount);
    } else if (i === operation.to - 1) {
      return [...stack, ...cratesToMove];
    } else {
      return stack;
    }
  });
}

function performMovementMultiple(
  stacks: CrateStack[],
  operation: Operation
): CrateStack[] {
  const cratesToMove = stacks[operation.from - 1].slice(-operation.amount);
  return stacks.map((stack, i) => {
    if (i === operation.from - 1) {
      return stack.slice(0, -operation.amount);
    } else if (i === operation.to - 1) {
      return [...stack, ...cratesToMove];
    } else {
      return stack;
    }
  });
}

function getTopCrates(stacks: CrateStack[]): string {
  return stacks.map((s) => s.at(-1) ?? '').join('');
}

export function splitInput(
  lines: readonly string[]
): [CrateStack[], Operation[]] {
  const divider = lines.indexOf('');
  const crateLines = lines.slice(0, divider);
  const operationLines = lines.slice(divider + 1);
  return [parseCrateStacks(crateLines), parseOperations(operationLines)];
}

export function part1(lines: string[]): string {
  const [stacks, operations] = splitInput(lines);
  const result = operations.reduce(
    (s, operation) => performMovement(s, operation),
    stacks
  );
  return getTopCrates(result);
}

export function part2(lines: string[]): string {
  const [stacks, operations] = splitInput(lines);
  const result = operations.reduce(
    (s, operation) => performMovementMultiple(s, operation),
    stacks
  );
  return getTopCrates(result);
}
