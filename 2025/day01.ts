import { assertEquals } from 'jsr:@std/assert';
import {getLines } from './utils.ts';

function parseInstruction(line: string) {
    return {
        direction: line[0] === 'L' ? 'left' : 'right',
        distance: parseInt(line.slice(1), 10)
    }
}
export function part1(input: string) {
   const instructions = getLines(input).map(l => parseInstruction(l));
   let pos = 50;
   let password = 0;
   for (const instr of instructions) {
    if (instr.direction === 'left') {
        pos = (pos - instr.distance) % 100;
    } else {
        pos = (pos + instr.distance) % 100;
    }
    if (pos === 0) {
        password++;
    }
  }
  return password;
}

function advanceInstructionDumb(instruction: ReturnType<typeof parseInstruction>, pos: number) {
    let newPos = pos;
    let password = 0;
    for (let i =0; i< Math.abs(instruction.distance); i++) {
        newPos = instruction.direction === 'left' ? newPos - 1 : newPos + 1;
        if (newPos < 0) {
            newPos += 100;
        } else if (newPos > 99) {
            newPos -= 100;
        }
        if (newPos === 0) {
            password++;
        }
    }
    return [newPos, password];
}

function advanceInstructionSmart(instruction: ReturnType<typeof parseInstruction>, pos: number) {
    let password = Math.floor(instruction.distance / 100);
    let amount = instruction.distance % 100;
    let newPos = instruction.direction === 'left' ? pos - amount : pos + amount;

    if (newPos >= 100) {
        password += 1;
    } else if (newPos <= 0 && pos != 0) {
        password += 1;
    }
     if (newPos < 0) {
        newPos += 100;
     }
     newPos = newPos % 100;
     return [newPos, password];
}

export function part2(input: string) {
   const instructions = getLines(input).map(l => parseInstruction(l));
   let pos = 50;
   let pos2= 50;
   let password = 0;
   let password2 = 0;
   for (const instr of instructions) {
        const [newPos, pw] = advanceInstructionDumb(instr, pos);
        const [newPos2, pw2] = advanceInstructionSmart(instr, pos);
        pos = newPos;
        password += pw;
        pos2 += newPos2;
        password2 += pw2;
        //console.log (instr.direction.slice(0,1) + instr.distance, pos, password, pos2,password2);

  }
  return password2;
}



const sampleInput = `
L68
L30
R48
L5
R60
L55
L1
L99
R14
L82
`.trim();

Deno.test("part1", async () => {
  assertEquals(part1(sampleInput), 3);
});

Deno.test("part2", async () => {
  assertEquals(part2('R1000'), 10);
  assertEquals(part2(sampleInput), 6);
});
