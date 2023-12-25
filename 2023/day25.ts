import { getLines } from './utils';

type Edge = {
  from: string;
  to: string;
};
function parseGraph(input: string): Edge[] {
  const edges: Edge[] = [];
  const lines = getLines(input);
  for (let line of lines) {
    const [source, nodeString] = line.split(': ');
    const nodes = nodeString.split(' ').filter((n) => n !== '');
    edges.push(...nodes.map((n) => ({ from: source, to: n })));
  }
  return edges;
}

function printGraph(edges: Edge[]): void {
  const output = edges.map((e) => `${e.from} -> ${e.to}`).join('\r\n');
  console.log(output);
}

function getGraphNodeCount(graph: Edge[], startNode: string): number {
  let nodeCount = 1;
  let visitedNodes = [startNode];
  let nodesToVisit = graph.flatMap((e) =>
    e.from === startNode ? [e.to] : e.to === startNode ? [e.from] : [],
  );
  while (nodesToVisit.length > 0) {
    const node = nodesToVisit.shift()!;
    visitedNodes.push(node);
    nodeCount++;
    nodesToVisit.push(
      ...graph
        .flatMap((e) =>
          e.from === node ? [e.to] : e.to === node ? [e.from] : [],
        )
        .filter((n) => !visitedNodes.includes(n))
        .filter((n) => !nodesToVisit.includes(n)),
    );
  }
  return nodeCount;
}

function getEdgesToSplit(edges: Edge[]) {
  /*return edges.filter(
    (n) =>
      (n.from !== 'prk' || n.to !== 'gpz') &&
      (n.from !== 'zhg' || n.to !== 'qdv') &&
      (n.from !== 'rfq' || n.to !== 'lsk'),
  );*/
  for (let x = 0; x < edges.length; x++) {
    console.log(x);
    for (let y = x + 1; y < edges.length; y++) {
      console.log(y);
      for (let z = y + 1; z < edges.length; z++) {
        console.log(z);
        const newEdges = edges.filter((_, i) => i !== x && i !== y && i !== z);
        const c1 = getGraphNodeCount(newEdges, edges[x].from);
        const c2 = getGraphNodeCount(newEdges, edges[x].to);
        if (c1 > 1 && c2 > 1 && c1 !== c2) {
          console.log(c1, c2);
          return c1 * c2;
          //return [edges[x], edges[y], edges[z]];
        }
      }
    }
  }
  throw new Error('not found');
}

export function part1(input: string) {
  const graph = parseGraph(input);
  const edgesToSplit = getEdgesToSplit(graph);
  /*let splitGraph = graph.filter((n) => edgesToSplit.includes(n));
  const c1 = getGraphNodeCount(splitGraph, edgesToSplit[0].from);
  const c2 = getGraphNodeCount(splitGraph, edgesToSplit[0].to);
  console.log(c1, c2);
  return c1 * c2;*/
  return edgesToSplit;
}

export function part2(input: string) {}
