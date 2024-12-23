import { assertEquals } from 'jsr:@std/assert';
import { getLines, sum } from './utils.ts';

function parseGraph(input: string[]): {[key: string]: string[]} {
  const result: {[key: string]: string[]} = {};
  for (let i of input) {
    const [src, target] = i.split('-');
    result[src] = [...(result[src] ?? []), target];
    result[target] = [...(result[target] ?? []), src];
  }
  return result;
}

export function part1(input: string) {
  const graph = parseGraph(getLines(input));
  const nodes = Object.keys(graph);
  let result = 0;
  for (let n1 of nodes) {
    for (let n2 of nodes) {
        if (n1 === n2) {
          continue;
        }
        if (!graph[n1].includes(n2)) {
          continue;
        }
        if (n1.localeCompare(n2) > 0) {
          continue;
        }
        for (let n3 of nodes) {
          if (n2 === n3 || n1 === n3) {
            continue;
          }
          if (n1.localeCompare(n3) > 0 || n2.localeCompare(n3)> 0) {
            continue;
          }
          if (!n1.startsWith('t') && !n2.startsWith('t') && !n3.startsWith('t')) {
            continue;
          }
          if (!graph[n1].includes(n2) || !graph[n1].includes(n3)) {
            continue;
          }
          if (!graph[n2].includes(n3)) {
            continue;
          }
          result += 1;
        }
    }
  }
  return result;
}

let max = 0;
let maxNodes: string[] = [];

function clique(graph: {[key: string]: string[]}, vertices: string[], size: number, nodes: string[]): void {
  if (vertices.length === 0) {
      if (size > max) {
        maxNodes = nodes;
        max = size;
      }
      return;
  }
  while (vertices.length > 0) {
    if ((size +vertices.length) <= max) {
      return;
    }
    const next = vertices.shift()!;
    clique(graph, vertices.filter(v => graph[next].includes(v)), size + 1, [...nodes, next]);
  }
}

export function part2(input: string) {
  const graph = parseGraph(getLines(input));
  clique(graph, Object.keys(graph), 0, []);
  return maxNodes.sort().join(',');
}

const sampleInput = `
kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn
`.trim();

Deno.test("part1", async () => {
  assertEquals(part1(sampleInput), 7);
});

Deno.test("part2", async () => {
  assertEquals(part2(sampleInput), 'co,de,ka,ta');
});
