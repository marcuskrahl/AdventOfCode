import { windowInput } from '@adventofcode2022/util';

type Monkey = {
  items: bigint[];
  operation: (input: bigint) => bigint;
  testFactor: bigint;
  trueDestination: number;
  falseDestination: number;
  itemInteractions: number;
};

function parseOperation(operation: string): (input: bigint) => bigint {
  if (operation === 'old + old') {
    return (x: bigint) => x + x;
  }
  if (operation === 'old * old') {
    return (x) => x * x;
  }
  const regex = /^old (.) (\d+)$/;
  const result = regex.exec(operation);
  if (result == null) {
    throw new Error('unknown operation ' + operation);
  }
  const amount: bigint = BigInt(result[2]);
  switch (result[1]) {
    case '+':
      return (x) => x + amount;
    case '*':
      return (x) => x * amount;
  }
  throw new Error('unknown oepration ' + operation);
}

function parseMonkeys(lines: readonly string[]): Monkey[] {
  return Array.from(windowInput(lines, 7)).map((monkeyLines) => {
    const items = monkeyLines[1]
      .split(':')[1]
      .split(',')
      .map((i) => BigInt(i));
    const operation = parseOperation(monkeyLines[2].split('=')[1].trim());
    const testFactor = BigInt(monkeyLines[3].split(' by ')[1]);
    const trueDestination = parseInt(monkeyLines[4].split(' monkey ')[1]);
    const falseDestination = parseInt(monkeyLines[5].split(' monkey ')[1]);
    return {
      items,
      operation,
      testFactor,
      trueDestination,
      falseDestination,
      itemInteractions: 0,
    };
  });
}

function simulateMonkey(
  monkey: Monkey,
  monkeys: Monkey[],
  worryFactor: bigint
): void {
  while (monkey.items.length > 0) {
    let item = monkey.items.shift()!;
    monkey.itemInteractions++;
    item = monkey.operation(item);
    if (worryFactor != 1n) {
      item = item / worryFactor;
    }
    if (item % monkey.testFactor === 0n) {
      /*console.log(
        `true: throw item of value ${item} to monkey ${monkey.trueDestination}`
      );*/
      monkeys[monkey.trueDestination].items.push(item);
    } else {
      /*console.log(
        `false: throw item of value ${item} to monkey ${monkey.falseDestination}`
      );*/
      monkeys[monkey.falseDestination].items.push(item);
    }
  }
}

function simulateMonkeys(monkeys: Monkey[], worryFactor: bigint = 3n): void {
  for (let monkey of monkeys) {
    simulateMonkey(monkey, monkeys, worryFactor);
  }
}

export function part1(lines: string[]): number {
  const monkeys = parseMonkeys(lines);
  for (let i = 0; i < 20; i++) {
    simulateMonkeys(monkeys);
    //console.log(monkeys[0].items);
    //console.log(monkeys[1].items);
  }
  const [first, second] = monkeys
    .map((m) => m.itemInteractions)
    .sort((a, b) => b - a);
  return first * second;
}

export function part2(lines: string[]): number {
  const monkeys = parseMonkeys(lines);
  for (let i = 0; i < 10000; i++) {
    simulateMonkeys(monkeys, 1n);
    //console.log(monkeys[0].items);
    //console.log(monkeys[1].items);
  }
  console.log(monkeys.map((m) => m.itemInteractions));
  const [first, second] = monkeys
    .map((m) => m.itemInteractions)
    .sort((a, b) => b - a);
  return first * second;
}
