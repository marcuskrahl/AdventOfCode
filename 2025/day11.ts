import { assertEquals } from 'jsr:@std/assert';
import { getLines, sum } from './utils.ts';

type Connections = {[from: string]: string[]}

function parseConnnections(input: string): Connections {
  const connections: Connections = {};
  for (let line of getLines(input)) {
    const [input, output] = line.split(': ');
    connections[input]= output.split(' ');
  }
  return connections;
}

function getConnections(connections: Connections, input: string): number {
  if (input === 'out') {
    return 1;
  }
  const outputs = connections[input];
  return sum(outputs.map(o => getConnections(connections, o)))
}

export function part1(input: string) {
  const connections = parseConnnections(input);
  return getConnections(connections, 'you');
}

export function part2(input: string) {
  return 0;
}


const sampleInput = `
aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out
`.trim();

Deno.test("part1", async () => {
  assertEquals(part1(sampleInput), 5);
});

Deno.test("part2", async () => {
  assertEquals(part2(sampleInput), 0);
});
