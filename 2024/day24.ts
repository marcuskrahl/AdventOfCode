import { assertEquals } from 'jsr:@std/assert';
import { getLines, sum } from './utils.ts';

type Operation = { type: 'AND' | 'OR' | 'XOR', g1: string, g2: string};

type Graph = {[key:string]: number | Operation };

function parseGraph(input: string): Graph {
  const graph: Graph = {};
  const lines = getLines(input);
  const split = lines.indexOf('');
  const initialValues = lines.slice(0,split); 
  const graphOperations = lines.slice(split + 1);

  initialValues.forEach(l => {
    const [k, v] = l.split(': ');
    graph[k] = parseInt(v);
  });

  graphOperations.forEach(o => {
    const [input, key] = o.split(' -> ');
    const [g1, type, g2] = input.split(' ');
    graph[key] = { type: type as ('AND' | "OR" | "XOR"), g1, g2};
  });
  return graph;
}

let cache: {[key: string]: number} =  {};

function getValue(graph: Graph, key: string): number {
  if (cache[key] != undefined) {
    return cache[key];
  }
  const v = graph[key];
  if (typeof v === 'number') {
    cache[key] = v;
    return v;
  }
  const v1 = getValue(graph, v.g1);
  const v2 = getValue(graph, v.g2);
  let result;
  switch(v.type) {
    case 'AND': result=  v1 & v2; break;
    case 'OR': result =  v1 | v2; break;
    case 'XOR': result=  v1 ^ v2; break;
  }
  cache[key] = result;
  return result;
}

export function part1(input: string) {
  const graph = parseGraph(input);
  //console.log(graph);
  return sum(Object.keys(graph).filter(k => k.startsWith('z')).map(k => {
    const v  = BigInt(getValue(graph, k));
    const shift = BigInt(parseInt(k.slice(1), 10));
    return Number(v << shift);
  }));

}

function getNumber(graph: Graph, prefix:string): number {
  let result = 0n;
  for (let i=0; i<=44; i++) {
    let node = prefix + `${i}`.padStart(2,'0');
    const v = graph[node];
    if (typeof v === 'number') {
      result += BigInt(v) << BigInt(i);
    }
  }
  return Number(result);
}

function setRandom(graph: Graph, prefix: string): number {
  const len = BigInt(Object.keys(graph).filter(k => k.startsWith(prefix)).length);
  const target = Math.floor(Math.random() * Number(1n<<len));
  for (let i =0 ; i < len; i++) {
      const bit = (BigInt(target) & (1n << BigInt(i))) > 0n ? 1 : 0;
      graph[`${prefix}${i.toString().padStart(2,'0')}`] = bit;
  }
  return target;
}

function numToBits(r: number): number[] {
  let result: number[] = [];
  for (let i=0; i<= 44; i++) {
    const bit = (BigInt(r) & (1n << BigInt(i))) > 0n ? 1 : 0;
    result.push(bit);
  }
  return result;
}

function checkBits(r1: number, r2: number, bits: number[]): void {
  const b1 = numToBits(r1);
  const b2 = numToBits(r2);
  for (let i=0; i<b1.length; i++) {
    bits[i] = (bits[i] ?? 0) + ((b1[i] == b2[i]) ? 1 : 0);
  }
}

function dotOutput(graph: Graph): void {
  let output = '';
  const swappable =  Object.keys(graph).filter(k => typeof graph[k] !== 'number');
  output += 'digraph foo { \r\n'
  for (let s of swappable) {
    const n = graph[s];
    if (typeof n === 'number') {
      continue;
    }
    const label = `${s} (${n.type})`;
    const color = s.startsWith('z') 
      ? 'lightblue' 
      : (s.startsWith('x') || s.startsWith('y')) 
      ? 'red' 
      : n.type === 'AND' ? 'dimgray' 
      : n.type === 'OR' ? 'gold2' : 'white';
    output += `${s} [label="${label}",style=filled,fillcolor="${color}"];\r\n`;
  }
  output += '\r\n';
  for (let s of swappable) {
    const n = graph[s];
    if (typeof n === 'number') {
      continue;
    }
    output += `${s} -> ${n.g1};\r\n`;
    output += `${s} -> ${n.g2};\r\n`;
  }
  output += '}';
  Deno.writeTextFile('day24_graph.dot', output);
}

function findNodes(graph: Graph, swappable: string[], source1: string, source2: string): string[] {
  return swappable.filter(k => {
    const n = graph[k];
    if (typeof n === 'number') {
      return false;
    }
    return n.g1 === source1 && n.g2 === source2 || n.g2 === source1 && n.g1 === source2;
  });
}

function isType(graph: Graph, node: string, type: string) {
  const n = graph[node];
  return typeof n !== 'number' && n.type === type;
}

function validateSubgraph(graph: Graph, swappable: string[], n: number): string[] {
  const nPadded= n.toString().padStart(2, '0');
  const x ='x' + nPadded ;
  const y = 'y' + nPadded;
  const z = 'z' + nPadded;
  const andXor = findNodes(graph, swappable, x,y);
  if (andXor.length != 2) {
    throw new Error('x and y not mapped correctly');
  }
  const [andNode] = andXor.filter(i => isType(graph, i, 'AND'));
  const [xorNode] = andXor.filter(i => isType(graph, i, 'XOR'));
  if (andNode == undefined) {
    throw new Error('and node not found');
  }
  if (xorNode == undefined) {
    throw new Error( 'xor node not found');
  }
  const zV = graph[z];
  if (typeof zV === 'number') {
    throw new Error('expected number');
  }
  const orNode = zV.g1 === xorNode ? zV.g2 : zV.g1;
  if (!isType(graph, orNode, 'OR')) {
    return ['or node not found']
  }
  const andZ = findNodes(graph, swappable, xorNode, orNode);
  const [and2Node] = andZ.filter(i => isType(graph, i, 'AND'));
  if (and2Node == undefined) {
    return ['??'];
  }
  const [or2Node] = findNodes(graph, swappable, andNode, and2Node); 
  if (or2Node == undefined || !isType(graph, or2Node, 'OR')) {
    return ['??'];
  }
  return [];
}

function lexicographicalSort(graph: Graph): string[] {
  const graphCopy = structuredClone(graph);
  let S: string[] = [];
  for (let i = 0; i <= 45; i++) {
    S.push('z' + (i.toString().padStart(2, '0')));
  }
  let L: string[] = [];
  while (S.length > 0) {
    const n = S.shift()!;
    L.push(n);
    if (typeof graphCopy[n] === 'number') {
      continue;
    }
    const m1 = graphCopy[n].g1;
    graphCopy[n].g1 = '';
    const m2 = graphCopy[n].g2;
    graphCopy[n].g2 = '';
    if (Object.values(graphCopy).every(v => typeof v === 'number' || v.g1 !== m1 && v.g2 !== m1 ))  {
      S.push(m1);
    }
    if (Object.values(graphCopy).every(v => typeof v === 'number' || v.g1 !== m2 && v.g2 !== m2 ))  {
      S.push(m2);
    }
  }
  return L;
}

function splitIntoSubgraphs(graph: Graph) {
  const sortedKeys = lexicographicalSort(graph);
  console.log(sortedKeys);
  let iStart = 0;
  for (let i = 0; i<sortedKeys.length; i++) {
    const n = graph[sortedKeys[i]];
    if (typeof n !== 'number' && n.type === 'OR') {
      console.log(i-iStart);
      iStart = i;
    }
  }
}


export function part2(input: string) {
  const graph = parseGraph(input);
  console.log(Object.values(graph).filter(v => typeof v !== 'number').length);
  const swappable =  Object.keys(graph).filter(k => typeof graph[k] !== 'number');
  //console.log(graph);
  const startNodes = Object.keys(graph).filter(k => k.startsWith('z'));
  /*let correctBits: number[] = [];
  for (let i = 0; i<1_000; i++) {
    cache = {};
    const x = setRandom(graph, 'x');
    const y = setRandom(graph, 'y');
    const result = sum(startNodes.map(k => {
      const v  = BigInt(getValue(graph, k));
      const shift = BigInt(parseInt(k.slice(1), 10));
      return Number(v << shift);
    }));
    checkBits(result, x+y, correctBits);
  }*/
  //splitIntoSubgraphs(graph);
  for (let i = 2; i <= 44; i++) {
    const result = validateSubgraph(graph, swappable, i);
    console.log(result);
  }
  //console.log(correctBits); 
  dotOutput(graph);
  return '';
}


const sampleInput = `
x00: 1
x01: 0
x02: 1
x03: 1
x04: 0
y00: 1
y01: 1
y02: 1
y03: 1
y04: 1

ntg XOR fgs -> mjb
y02 OR x01 -> tnw
kwq OR kpj -> z05
x00 OR x03 -> fst
tgd XOR rvg -> z01
vdt OR tnw -> bfw
bfw AND frj -> z10
ffh OR nrd -> bqk
y00 AND y03 -> djm
y03 OR y00 -> psh
bqk OR frj -> z08
tnw OR fst -> frj
gnj AND tgd -> z11
bfw XOR mjb -> z00
x03 OR x00 -> vdt
gnj AND wpb -> z02
x04 AND y00 -> kjc
djm OR pbm -> qhw
nrd AND vdt -> hwm
kjc AND fst -> rvg
y04 OR y02 -> fgs
y01 AND x02 -> pbm
ntg OR kjc -> kwq
psh XOR fgs -> tgd
qhw XOR tgd -> z09
pbm OR djm -> kpj
x03 XOR y03 -> ffh
x00 XOR y04 -> ntg
bfw OR bqk -> z06
nrd XOR fgs -> wpb
frj XOR qhw -> z04
bqk OR frj -> z07
y03 OR x01 -> nrd
hwm AND bqk -> z03
tgd XOR rvg -> z12
tnw OR pbm -> gnj
`.trim();

Deno.test("part1", async () => {
  assertEquals(part1(sampleInput), 2024);
});

Deno.test("part2", async () => {
  assertEquals(part2(sampleInput), '');
});

