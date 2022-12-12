import { windowInput } from '@adventofcode2022/util';

type ItemType = number;
//type Item = number[];
type Item = number[];

type Monkey = {
  items: Item[];
  operation: (input: ItemType, modulo: ItemType) => ItemType;
  testFactor: ItemType;
  moduloFactor: ItemType;
  trueDestination: number;
  falseDestination: number;
  itemInteractions: number;
};

function parseOperation(
  operation: string
): (input: ItemType, modulo: ItemType) => ItemType {
  if (operation === 'old + old') {
    return (x: ItemType, m: ItemType) => (x % m) + (x % m);
  }
  if (operation === 'old * old') {
    return (x: ItemType, m: ItemType) => (x % m) * (x % m);
  }
  const regex = /^old (.) (\d+)$/;
  const result = regex.exec(operation);
  if (result == null) {
    throw new Error('unknown operation ' + operation);
  }
  //const amount: ItemType = BigInt(result[2]);
  const amount: ItemType = parseInt(result[2]);
  switch (result[1]) {
    case '+':
      return (x: ItemType, m: ItemType) => (x % m) + (amount % m);
    case '*':
      return (x: ItemType, m: ItemType) => (x % m) * (amount % m);
  }
  throw new Error('unknown oepration ' + operation);
}

function parseItem(monkeyCount: number, item: string): Item {
  //return parseInt(item);
  return Array.from({ length: monkeyCount }, (_) => parseInt(item));
}

function parseMonkeys(
  lines: readonly string[],
  forceModuloFactor?: ItemType
): Monkey[] {
  const monkeySegments = Array.from(windowInput(lines, 7));
  return monkeySegments.map((monkeyLines) => {
    const items = monkeyLines[1]
      .split(':')[1]
      .split(',')
      .map((i) => parseItem(monkeySegments.length, i));
    const operation = parseOperation(monkeyLines[2].split('=')[1].trim());
    const testFactor = parseInt(monkeyLines[3].split(' by ')[1]);
    const trueDestination = parseInt(monkeyLines[4].split(' monkey ')[1]);
    const falseDestination = parseInt(monkeyLines[5].split(' monkey ')[1]);
    return {
      items,
      operation,
      testFactor,
      trueDestination,
      falseDestination,
      itemInteractions: 0,
      moduloFactor: forceModuloFactor ?? testFactor,
    };
  });
}

function performOperation(item: Item, monkey: Monkey, monkeys: Monkey[]): Item {
  return item.map(
    (value, index) =>
      monkey.operation(value, monkeys[index].moduloFactor) %
      monkeys[index].moduloFactor
  );
  //return monkey.operation(item);
}

function worry(item: Item, worryFactor: ItemType, monkeys: Monkey[]): Item {
  if (worryFactor === 1) {
    return item;
  }
  return item.map((value, index) => Math.floor(value / worryFactor));
  //return Math.floor(item / worryFactor);
}

function testFactor(item: Item, monkey: Monkey, monkeyIndex: number): boolean {
  return item[monkeyIndex] % monkey.testFactor === 0;
}

function simulateMonkey(
  monkey: Monkey,
  monkeyIndex: number,
  monkeys: Monkey[],
  worryFactor: ItemType
): void {
  while (monkey.items.length > 0) {
    monkey.itemInteractions++;
    let item = monkey.items.shift()!;
    item = performOperation(item, monkey, monkeys);
    item = worry(item, worryFactor, monkeys);
    if (testFactor(item, monkey, monkeyIndex)) {
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

function simulateMonkeys(monkeys: Monkey[], worryFactor: ItemType = 3): void {
  for (let i = 0; i < monkeys.length; i++) {
    simulateMonkey(monkeys[i], i, monkeys, worryFactor);
  }
}

export function part1(lines: string[]): number {
  const monkeys = parseMonkeys(lines, Number.MAX_SAFE_INTEGER);
  for (let i = 0; i < 20; i++) {
    simulateMonkeys(monkeys);
  }
  const [first, second] = monkeys
    .map((m) => m.itemInteractions)
    .sort((a, b) => b - a);
  return first * second;
}

export function part2(lines: string[]): number {
  const monkeys = parseMonkeys(lines);
  for (let i = 0; i < 10000; i++) {
    simulateMonkeys(monkeys, 1);
  }
  const [first, second] = monkeys
    .map((m) => m.itemInteractions)
    .sort((a, b) => b - a);
  return first * second;
}
