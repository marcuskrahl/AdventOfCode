import { assertEquals } from 'jsr:@std/assert';
import { transpose, parseGrid, Grid, pairwise, getLines, sum, min } from './utils.ts';


type Numerical = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'A' | 'F';
type Directional = '<' | '>' | '^' | 'v' | 'A' | 'F';

const layer1Coords: {[key in Numerical]: [number, number]} = {
  '7' : [0,0],
  '8' : [1,0],
  '9' : [2,0],
  '4' : [0,1],
  '5' : [1,1],
  '6' : [2,1],
  '1' : [0,2],
  '2' : [1,2],
  '3' : [2,2],
  'F' : [0,3],
  '0' : [1,3],
  'A' : [2,3],
};

const layer2Coords: {[key in Directional]: [number, number]} = {
  'F' : [0,0],
  '^' : [1,0],
  'A' : [2,0],
  '<' : [0,1],
  'v' : [1,1],
  '>' : [2,1],
};

const reverseLayer1Grid = transpose(parseGrid(`
789
456
123
F0A
`.trim())) as Grid<Numerical>;

const reverseLayer2Grid = transpose(parseGrid(`
F^A
<v>
`.trim())) as Grid<Directional>;

function layer1Movements(from: Numerical, to: Numerical): Directional[][] | undefined {
  if (from === to) {
    return [['A']];
  }
  if (from === 'F') {
    return undefined;
  }
  const [xf ,yf] = layer1Coords[from];
  const [xt ,yt] = layer1Coords[to];
  const xd = Math.sign(xt - xf); 
  const yd = Math.sign(yt - yf); 
  const movements: Directional[][] = [];
  if (xd != 0) {
    const l1m = layer1Movements(reverseLayer1Grid[xf + xd][yf], to);
    if (l1m !== undefined) {
      const directional:Directional = xd > 0 ? '>' : '<';
      movements.push(...l1m.map(l => [directional, ...l]))
    }
  }
  if (yd != 0) {
    const l1m = layer1Movements(reverseLayer1Grid[xf][yf + yd], to);
    if (l1m !== undefined) {
      const directional:Directional = yd > 0 ? 'v' : '^';
      movements.push(...l1m.map(l => [directional, ...l]))
    }
  }
  return movements.length > 0 ? movements : undefined; 
}

const memo: {[key: string]: Directional[][] | undefined } = {}

function layer2Movements(from: Directional, to:Directional): Directional[][] | undefined {
  const key = `${from}${to}`;
  if (memo[key] != undefined) {
    return memo[key];
  }
  if (from === to) {
    memo[key] = [['A']];
    return [['A']];
  }
  if (from === 'F') {
    memo[key] = undefined;
    return undefined;
  }
  const [xf ,yf] = layer2Coords[from];
  const [xt ,yt] = layer2Coords[to];
  const xd = Math.sign(xt - xf); 
  const yd = Math.sign(yt - yf); 
  const movements: Directional[][] = [];
  if (xd != 0) {
    const l1m = layer2Movements(reverseLayer2Grid[xf + xd][yf], to);
    if (l1m !== undefined) {
      const directional:Directional = xd > 0 ? '>' : '<';
      movements.push(...l1m.map(l => [directional, ...l]))
    }
  }
  if (yd != 0) {
    const l1m = layer2Movements(reverseLayer2Grid[xf][yf + yd], to);
    if (l1m !== undefined) {
      const directional:Directional = yd > 0 ? 'v' : '^';
      movements.push(...l1m.map(l => [directional, ...l]))
    }
  }
  const result = movements.length > 0 ? movements : undefined;
  memo[key] = result;
  return  result;
}

function isMixed(d: Directional[]): boolean {
  let changes = 0;
  let previous = '';
  for (let c of d) {
    if (c != previous) {
      changes++;
    } 
    previous = c;
  }
  return changes >3;
}


function movementsRec(code: string[], layer: number): number {
  if (code.length > 2) {
      throw 'expected max 2 possibilities';
    }
  if (code.length === 2) {
    return Math.min(movementsRecSingle(code[0], layer), movementsRecSingle(code[1], layer))
  }
  return movementsRecSingle(code[0], layer);
}

function getAllLayer2String(code: string): string[][] {
  const result: string[][] =[];
  let start: Directional = 'A';
  for (let movement of code.split('') as Directional[]) {
    let m = layer2Movements(start, movement);
    if (m === undefined) {
      throw 'no movements found';
    } 
    m = m.filter(d => !isMixed(d));
    result.push(m.map(s => s.join('')));
    start = movement;
  }
  return result;
}

const memo2: {[key: string]: number} = {};

function movementsRecSingle(code: string, layer: number): number {
  if (layer === 0) {
    return code.length;
  }
  const key = `${code}_${layer}`;
  if (memo2[key] != undefined) {
    return memo2[key];
  }
  const parts = getAllLayer2String(code);
  const result =  sum(parts.map(p => movementsRec(p, layer - 1)))
  memo2[key] = result;
  return result;
}

function codeMovementsTop(code: string, layer: number): number {
  const split = code.split('');
  let from :Numerical= 'A';
  let movements: string[][] = [];
  for (let c of split) {
    const to  = c as Numerical;    
    let m = layer1Movements(from, to);
    if (m === undefined) {
      throw 'no movement found?';
    }
    m = m.filter(d => !isMixed(d));
    movements.push(m.map(s => s.join('')));
    from = to;
  }
  return sum(movements.map(p => movementsRec(p, layer - 1)))
}

export function part1(input: string) {
  const codes = getLines(input);
  return sum(codes.map(code => {
    const numeric = parseInt(code.replace('A', ''));
    const codeTargets = codeMovementsTop(code, 3);
    return numeric * codeTargets;
  }));
}

export function part2(input: string) {
  const codes = getLines(input);
  return sum(codes.map(code => {
    const numeric = parseInt(code.replace('A', ''));
    const codeTargets = codeMovementsTop(code, 26);
    return numeric * codeTargets;
  }));
}


const sampleInput = `
029A
980A
179A
456A
379A
`.trim();

Deno.test("part1", async () => {
  assertEquals(part1(sampleInput), 126384);
});

Deno.test("part2", async () => {
  assertEquals(part2(sampleInput), 154115708116294);
});
