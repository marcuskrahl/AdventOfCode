import { assertEquals } from 'jsr:@std/assert';
import { getLines } from './utils.ts';

type Registers = {
  A: number,
  B: number,
  C: number
}

function parseInput(lines: string[]): [Registers, number[]] {
   const divider = lines.indexOf('');
  const [a,b,c] = lines.slice(0, divider).map(l => +(l.replace(/Register \w: /, '')));

  const program= lines[divider+1].replace('Program: ', '').split(',').map(m => +m);
  return [{A: a, B: b, C:c}, program];
}

function combo(code: number, registers: Registers) {
  switch(code) {
    case 0: return 0;
    case 1: return 1;
    case 2: return 2;
    case 3: return 3;
    case 4: return registers.A;
    case 5: return registers.B;
    case 6: return registers.C;
  }
  throw new Error('unsupported combo code ' + code);
}

function run(registers: Registers, program: number[], pc: number, output: number[], expectedOutput?: readonly number[]): number {
  const opCode = program[pc];
  const operand = program[pc+1];
  switch(opCode) {
    case 0:
      registers.A = registers.A >> combo(operand, registers) 
      break;
    case 1:
      registers.B = registers.B ^ operand;
      break;
    case 2: 
      registers.B = combo(operand, registers) % 8;
      break;
    case 3: 
      if (registers.A != 0) {
        return operand;
      }
    case 4:
      registers.B = registers.B ^ registers.C;
      break;
    case 5: 
      const o = combo(operand, registers) % 8;
      if (expectedOutput != undefined && expectedOutput[output.length] != o) {
          //console.log(o, expectedOutput.slice(0, output.length + 1).join(','))
          return 99;
      }
      output.push(o);
      if (expectedOutput != undefined && output.length > expectedOutput.length) {
        //console.log(expectedOutput.length)
        return 99;
      }
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

function getInitialValueRec(program: number[], as: number[], recursion: number): number {
    if (program.length === 0) {
      return as[0];
    }
    const o = program[0];
    console.log('looking for o=' + o);
    let b = o;
    const newAs = [];
    //B = B xor C
    for(let c = 0; c < 8; c++) {
      let b1 = b ^ c;
      let b2 = b1 ^ 3;
      let a =  c << b2;
      let b3 = b2 ^ 2;
      a = a | b3;
      //console.log(o, b, c, b1, b2, a);
      if (a >> b2 != c) {
        c
        continue;
      }

      newAs.push(as.filter(ao => ))
      console.log(o, b, c, b1, b2, a);
    }
    return getInitialValueRec(program.slice(1), as, recursion * 3);
}

function getInitialValue(program: number[]): number {
  //hardcoded for input
  program.reverse(); 
  return getInitialValueRec(program, [0], 0);

  /*if (program.at(-2) !== 3 && program.at(-1) !== 0) {
    throw new Error('expected jump at end');
  }
  let outputSource = -1;
  let outputIndex = -1;
  let toOutput = [...program];
  for (let i =0; i<program.length - 2; i+= 2) {
      if (program[i] === 3) {
        throw new Error('second jump');
      }
      if (program[i] === 5) {
        if (outputSource === -1) {
          outputSource = program[i+1];
          outputIndex = i;
        } else {
          throw new Error('second output source');
        }
      }
  }
  let registers = { A: 0, B: 0, C:0};
  console.log('output source', outputSource);
  console.log('output index', outputIndex);
  return registers;*/
} 

export function part2(input: string) {
  const [_, program] = parseInput(getLines(input));
  return getInitialValue(program);
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
  assertEquals(part2(sampleInput2), 117440);
});

Deno.test("register runs", () => {
  let registers = {A:0, B: 0, C:9};
  run(registers, [2,6], 0, []);
  assertEquals(registers.B, 1);

  registers = {A:0, B: 29, C:0};
  run(registers, [1,7], 0, []);
  assertEquals(registers.B, 26);

  registers = {A:0, B: 2024, C: 43690};
  run(registers, [4,0], 0, []);
  assertEquals(registers.B, 44354);
});

Deno.test('program runs', ()=> {
  assertEquals(runToOutput({A: 10, B:0,C:0}, [5,0,5,1,5,4]), '0,1,2');
  assertEquals(runToOutput({A: 2024, B:0,C:0}, [0,1,5,4,3,0]), '4,2,5,6,7,7,7,7,3,1,0');
});
