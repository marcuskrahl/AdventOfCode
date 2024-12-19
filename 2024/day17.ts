import { assertEquals } from 'jsr:@std/assert';
import { getLines, min } from './utils.ts';

type Registers = {
  A: bigint,
  B: bigint,
  C: bigint
}

type NumArray = (number | undefined)[];

function parseInput(lines: string[]): [Registers, number[]] {
   const divider = lines.indexOf('');
  const [a,b,c] = lines.slice(0, divider).map(l => BigInt(l.replace(/Register \w: /, '')));

  const program= lines[divider+1].replace('Program: ', '').split(',').map(m => +m);
  return [{A: a, B: b, C:c}, program];
}

function combo(code: bigint, registers: Registers) {
  switch(code) {
    case 0n: return BigInt(0);
    case 1n: return BigInt(1);
    case 2n: return BigInt(2);
    case 3n: return BigInt(3);
    case 4n: return registers.A;
    case 5n: return registers.B;
    case 6n: return registers.C;
  }
  throw new Error('unsupported combo code ' + code);
}

function run(registers: Registers, program: number[], pc: number, output: number[]): number {
  const opCode = program[pc];
  const operand = BigInt(program[pc+1]);
  switch(opCode) {
    case 0:
      registers.A = registers.A >> combo(operand, registers) 
      break;
    case 1:
      registers.B = registers.B ^ operand;
      break;
    case 2: 
      registers.B = combo(operand, registers) % 8n;
      break;
    case 3: 
      if (registers.A != 0n) {
        return Number(operand);
      }
    case 4:
      registers.B = registers.B ^ registers.C;
      break;
    case 5: 
      const o = combo(operand, registers) % 8n;
      output.push(Number(o));
      break;
    case 6: 
      registers.B = registers.A >> combo(operand, registers);
      break;
    case 7:
      registers.C = registers.A >> combo(operand, registers);
  }
  return pc+2;
}

function runToOutput(registers: Registers, program: number[]): string {
  let pc = 0;
  let output: number[] = [];
  do {
    pc = run(registers, program, pc, output);
    if (pc >= program.length) {
      break;
    }
  } while(true);
  return output.join(',');
}

export function part1(input: string) {
  const [registers, program] = parseInput(getLines(input));
  return runToOutput(registers, program);
}



function getInitialValue2(program: number[], a: bigint): bigint  | undefined {
    if (program.length === 0) {
      return a;
    }
    const an = a << 3n;
    const o = BigInt(program[0]);
    for (let ai = 0; ai < 8; ai++) {
      let ar = an + BigInt(ai);
      let b = ar % 8n;
      b = b ^2n;
      let c = ar >> b;
      b = b ^ 3n;
      b = b ^ c;
      if (b % 8n != o) {
        continue;
      }
      const result = getInitialValue2(program.slice(1), ar);
      if (result != undefined) {
        return result;
      }
    }
    return undefined;
}

export function part2(input: string) {
  const [_, program] = parseInput(getLines(input));
  program.reverse();
  return getInitialValue2(program, 0n);
}


const sampleInput = `
Register A: 117440
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0
`.trim();

Deno.test("part1", async () => {
  //assertEquals(part1(sampleInput), '');
});

const sampleInput2 = `
Register A: 117440
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0
`.trim();

Deno.test("part2 - base", async () => {
  assertEquals(part1(sampleInput2), '0,3,5,4,3,0');
});

Deno.test("part2", async () => {
  //assertEquals(part2(sampleInput2), 117440);
});

Deno.test("register runs", () => {
  let registers = {A:0n, B: 0n, C:9n};
  run(registers, [2,6], 0, []);
  assertEquals(registers.B, 1n);

  registers = {A:0n, B: 29n, C:0n};
  run(registers, [1,7], 0, []);
  assertEquals(registers.B, 26n);

  registers = {A:0n, B: 2024n, C: 43690n};
  run(registers, [4,0], 0, []);
  assertEquals(registers.B, 44354n);
});

Deno.test('program runs', ()=> {
  assertEquals(runToOutput({A: 10n, B:0n,C:0n}, [5,0,5,1,5,4]), '0,1,2');
  assertEquals(runToOutput({A: 2024n, B:0n,C:0n}, [0,1,5,4,3,0]), '4,2,5,6,7,7,7,7,3,1,0');
  assertEquals(runToOutput({A: 37222273957364n, B:0n,C:0n}, [2,4,1,2,7,5,1,3,4,4,5,5,0,3,3,0]), '2,4,1,2,7,5,1,3,4,4,5,5,0,3,3,0');
});

