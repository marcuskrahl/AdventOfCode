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

function minArr(arr:number[]): number {
  let m = Number.MAX_SAFE_INTEGER;
  for (let v of arr) {
    if (v < m) {
      m = v;
    }
  }
return m;
}

const shortest: {[key: string]: boolean} = {
  '<vA': true,
  '>^^A': false,
  '>^A': true,
  '>vA': false,
  '<^A': true,
  '<<^^A': true
} as const;

function getShortest(m1: Directional[], m2: Directional[]): Directional[] {
  if (m1.length < m2.length) {
    return m1;
  }
  if (m2.length < m1.length) {
    return m2;
  }
  /*const m1len = getMinLayer2Movements(m1);
  const m2len = getMinLayer2Movements(m2);
  if (m1len < m2len) {
    return m1;
  }
  if (m2len < m1len) {
    return m2;
  }*/
  /*const m1r = sum(getAllLayer2Movements(m1).map(p => Math.min(...p.map(pi => getMinLayer2Movements(pi)))));
  const m2r = sum(getAllLayer2Movements(m2).map(p => Math.min(...p.map(pi => getMinLayer2Movements(pi)))));
  if (m1r < m2r) {
    return m1;
  }
  if (m2r < m1r) {
    return m2;
  }*/
  const m1s = m1.join('');
  const m2s = m2.join('');
  if (shortest[m1s] != undefined) {
    return shortest[m1s] ? m1 : m2;
  }
  if (shortest[m2s] != undefined) {
    return shortest[m2s] ? m2 : m1;
  }
  //throw 'cannot determinate';
  console.log(m1s, m2s);
  //throw 'cannot determinte';
  return m1;
}

function getAllLayer2Movements(movements: Directional[]): Directional[][][] {
  const result: Directional[][][] =[];
  let start: Directional = 'A';
  for (let movement of movements) {
    let m = layer2Movements(start, movement);
    if (m === undefined) {
      throw 'no movements found';
    } 
    m = m.filter(d => !isMixed(d));
    result.push(m);
    start = movement;
  }
  return result;
};

function getLayer2Movements(movements: Directional[]): Directional[][] {
  const result: Directional[][] = [];
  let start: Directional = 'A';
  for (let movement of movements) {
    let m = layer2Movements(start, movement);
    if (m === undefined) {
      throw 'no movements found';
    } 
    m = m.filter(d => !isMixed(d));
    if (m.length === 1) {
      result.push(m[0]);
    } else if (m.length === 2) {
      result.push(getShortest(m[0],m[1]));
    }
    start = movement;
  }
  return result;
};

function getMinLayer2Movements(movements: Directional[]): number {
    let from: Directional = 'A'; 
      let inner: Directional[][] = [];
      for (let c of movements) {
        const to  = c as Directional;    
        let m = layer2Movements(from, to);
        if (m === undefined) {
          throw 'no movement found?';
        }
        m = m.filter(d => !isMixed(d));
        //console.log(from ,to ,m![0].join(''));
        if (inner.length === 0 ) {20
          inner = m;
        } else {
          inner = inner.flatMap(mo => m.map(m1 => [...mo, ...m1]),1)
        }
        from = to;
      }
    //console.log(inner);
    const minLen = minArr(inner.map(i => i.length));
    return minLen;
};

function codeMovements(code: string, iterations: number): number{
  const split = code.split('');
  let from :Numerical= 'A';
  let movements: Directional[][] = [];
  for (let c of split) {
    const to  = c as Numerical;    
    let m = layer1Movements(from, to);
    if (m === undefined) {
      throw 'no movement found?';
    }
    m = m.filter(d => !isMixed(d));
    //console.log(m.length);
    if (m.length === 1 ) {
      movements.push(m[0]) ;
    } else {
      console.log(m.length);
      movements.push(getShortest(m[0], m[1]));
    }
    from = to;
  }
  let directionMap: {[key:string]: number} = {};
  movements.forEach(movement => {
    const key = movement.join('');
    directionMap[key] = (directionMap[key] ?? 0) + 1;
  });
  for (let i =0; i< iterations; i++) {
    const codes =Object.keys(directionMap);
    console.log(directionMap);
    let newMap: {[key: string]: number}= {};
    for (let c of codes) {
      const subResult = getLayer2Movements(c.split('') as Directional[]);
      for (let s of subResult) {
        const key = s.join('');
        newMap[key] = (newMap[key] ?? 0) + directionMap[c];
      }
    }
    directionMap = newMap;
  }
  /*for (let i = 0; i<2; i++) {
    //console.log(code, min(movements, m => m.length).join(''));
    //console.log(movements[0].join(''));
    //console.log(movements);
    let from: Directional = 'A';
    movements = movements.flatMap(split => {
      let inner: Directional[][] = [];
      for (let c of split) {
        const to  = c as Directional;    
        let m = layer2Movements(from, to);
        if (m === undefined) {
          throw 'no movement found?';
        }
        m = m.filter(d => !isMixed(d));
        //console.log('- ', m.length);
        //console./log(from ,to ,m![0].join(''));
        if (inner.length === 0 ) {
          inner = m;
        } else {
          inner = inner.flatMap(mo => m.map(m1 => [...mo, ...m1]),1)
        }
        from = to;
      }
      const minLen = minArr(inner.map(i => i.length));
      return inner.filter(i => i.length === minLen);
    }, 1);
    const minLen = minArr(movements.map(i => i.length));
    //console.log(movements.length);
    movements =  movements.filter(i => i.length === minLen);
    //console.log(movements.length);
    //console.log(minArr(movements.map(i => i.length)));
  }
  */
  return sum(Object.entries(directionMap).map(([key, value]) => key.length * value));

}

export function part1(input: string) {
  const codes = getLines(input);
  return sum(codes.map(code => {
    const numeric = parseInt(code.replace('A', ''));
    const codeTargets = codeMovements(code, 2);
    return numeric * codeTargets;
  }));
}

export function part2(input: string) {
  const codes = getLines(input);
  return sum(codes.map(code => {
    const numeric = parseInt(code.replace('A', ''));
    const codeTargets = codeMovements(code, 25);
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
  //assertEquals(part2(sampleInput), 154115708116294);
});
