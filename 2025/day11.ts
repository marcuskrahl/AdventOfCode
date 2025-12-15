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

let cache: {[key: string]: number} = {};

function getConnections(connections: Connections, input: string, dac: boolean, fft: boolean): number {
  const cacheKey = `${input}${dac ? '_T': '_F'}${fft ? '_T' : '_F'}`;
  if (cache[cacheKey]!=undefined) {
    return cache[cacheKey];
  }
  if (input === 'out') {
    return dac && fft ? 1: 0;
  }
  const outputs = connections[input];
  const result = sum(outputs.map(o => getConnections(connections, o, dac || input === "dac",fft || input === "fft")))
  cache[cacheKey] = result;
  return result;
}

export function part1(input: string) {
  cache = {};
  const connections = parseConnnections(input);
  return getConnections(connections, 'you', true, true);
}

export function part2(input: string) {
  cache = {};
  const connections = parseConnnections(input);
  const result =  getConnections(connections, 'svr',false, false);
  //console.log(cache);
  return result;
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

const sampleInput2 = `
svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out
`.trim();

Deno.test("part2", async () => {
  assertEquals(part2(sampleInput2), 2);
});
