type Monkey = {
  key: string;
  operation: string;
};

function parseMonkeys(lines: string[]): Monkey[] {
  return lines.map((l) => ({
    key: l.split(': ')[0],
    operation: l.split(': ')[1],
  }));
}

function solveMonkeys(monkeys: Monkey[]): number | string {
  const numberRegex = /^-?\d+$/;
  const operationRegex = /^-?\d+(\.\d+)? (\+|-|\*|\/) -?\d+(\.\d+)?$/;
  const monkeyRegex = /[a-z]{4}/g;
  while (true) {
    const monkeyWithNumber = monkeys.find((m) => numberRegex.test(m.operation));
    if (monkeyWithNumber != undefined) {
      monkeys.forEach((m) => {
        if (m.operation.includes(monkeyWithNumber.key)) {
          m.operation = m.operation.replace(
            monkeyWithNumber.key,
            monkeyWithNumber.operation
          );
        }
      });
      monkeys = monkeys.filter((m) => m !== monkeyWithNumber);
      continue;
    }
    const monkeyWithSolvableOperation = monkeys.find((m) =>
      operationRegex.test(m.operation)
    );
    if (monkeyWithSolvableOperation != undefined) {
      monkeyWithSolvableOperation.operation = eval(
        monkeyWithSolvableOperation.operation
      ).toString();
      if (monkeyWithSolvableOperation.key === 'root') {
        return parseInt(monkeyWithSolvableOperation.operation);
      }
      monkeys.forEach((m) => {
        if (m.operation.includes(monkeyWithSolvableOperation.key)) {
          m.operation = m.operation.replace(
            monkeyWithSolvableOperation.key,
            monkeyWithSolvableOperation.operation
          );
        }
      });
      monkeys = monkeys.filter((m) => m !== monkeyWithSolvableOperation);
      continue;
    }

    const isJustHuman = (s: string) =>
      Array.from(s.matchAll(monkeyRegex)).every((a) => a[0] === 'humn');
    const monkeyWithJustHuman = monkeys.find((m) => isJustHuman(m.operation));
    if (monkeyWithJustHuman != undefined) {
      if (monkeyWithJustHuman.key === 'root') {
        return monkeyWithJustHuman.operation;
      }
      monkeys.forEach((m) => {
        if (m.operation.includes(monkeyWithJustHuman.key)) {
          m.operation = m.operation.replace(
            monkeyWithJustHuman.key,
            `(${monkeyWithJustHuman.operation})`
          );
        }
      });
      monkeys = monkeys.filter((m) => m !== monkeyWithJustHuman);
      continue;
    }
    //aggregate for human
    console.log(monkeys);
    throw new Error('should be able to do something');
  }
}

function assertNumber(input: unknown): asserts input is number {
  if (typeof input !== 'number') {
    throw new Error('expected number');
  }
}
function assertString(input: unknown): asserts input is string {
  if (typeof input !== 'string') {
    throw new Error('expected string');
  }
}

function searchSolution(equation: string): number {
  equation = equation.replace('==', '-');
  let lowerBound = 0;
  let upperBound = Number.MAX_SAFE_INTEGER;
  let resultLow = Math.abs(
    eval(equation.replace('humn', lowerBound.toString()))
  );
  let resultUp = Math.abs(
    eval(equation.replace('humn', upperBound.toString()))
  );
  while (true) {
    console.log(`${lowerBound} (${resultLow}) - ${upperBound} (${resultUp})`);
    let middle = lowerBound + Math.round((upperBound - lowerBound) / 2);
    const result = Math.abs(eval(equation.replace('humn', middle.toString())));
    if (result === 0) {
      return middle;
    }
    if (resultLow < resultUp) {
      upperBound = middle;
      resultUp = result;
    } else {
      lowerBound = middle;
      resultLow = result;
    }
  }
}

export function part1(lines: string[]): number {
  const monkeys = parseMonkeys(lines);
  const result = solveMonkeys(monkeys);
  assertNumber(result);
  return result;
}

export function part2(lines: string[]): number {
  const monkeys = parseMonkeys(lines);
  const rootMonkey = monkeys.find((m) => m.key === 'root')!;
  rootMonkey.operation = rootMonkey.operation.replace('+', '==');
  const copiedMonkeys = JSON.parse(JSON.stringify(monkeys)).filter(
    (m: Monkey) => m.key !== 'humn'
  );
  const equation = solveMonkeys(copiedMonkeys);
  assertString(equation);
  console.log(equation);
  return searchSolution(equation);
}
