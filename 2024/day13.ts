import { assertEquals } from 'jsr:@std/assert';
import { getLines, sum } from './utils.ts';

type Machine = {
  A: {x: number, y:number},
  B: {x: number, y:number},
  Prize: {x: number, y:number}
}

function parseInput(input:string[]): Machine[] {
  if(  input.length === 0) {
    return [];
  }
  const [aStr, bStr, prizeStr] = input;
  const a = aStr.split(': ')[1].split(', ').map(i => parseInt(i.slice(2), 10));
  const b = bStr.split(': ')[1].split(', ').map(i => parseInt(i.slice(2), 10));
  const prize = prizeStr.split(': ')[1].split(', ').map(i => parseInt(i.slice(2), 10));

  const machine: Machine = {
  A: { x: a[0], y: a[1]},
  B: {x: b[0], y:b[1]},
  Prize: { x: prize[0], y: prize[1]}
};
 
  return [machine, ...parseInput(input.slice(4))];
}


function getNeededTokens(machine: Machine): number {
  if (machine.A.x * 100 + machine.B.x * 100  < machine.Prize.x)  {
    return 0;
  }
  if (machine.A.y * 100 + machine.B.y * 100 < machine.Prize.y) {
    return 0;
  }
  let min = Number.MAX_SAFE_INTEGER;  
  for (let aPresses = 0; aPresses < 100; aPresses++) {
    const restX = machine.Prize.x - aPresses * machine.A.x;
    const restY = machine.Prize.y - aPresses * machine.A.y;
    
    const bPresses = restX / machine.B.x;

    if (bPresses < 0 || Math.floor(bPresses) != bPresses) {
      continue;
    }

    if (restY != machine.B.y * bPresses) {
      continue;
    }
    const tokens = aPresses * 3 + bPresses;
    if (tokens < min) {
      console.log(aPresses, bPresses);
      min = tokens;
    }
  }
  return min < 1_000_000 ? min: 0;
}

function getNeededTokens2(machine: Machine): number {
  const a =  ((machine.Prize.x / machine.A.x) - (machine.B.x * machine.Prize.y / (machine.A.x * machine.B.y)) ) / (1 - (machine.B.x * machine.A.y) / (machine.A.x * machine.B.y));
  const b = (machine.Prize.y - machine.A.y * a ) / (machine.B.y);

  if (Math.abs(Math.round(a) - a) < 0.01 && Math.abs(Math.round(b) - b) < 0.01) {
    return Math.round(a) * 3 + Math.round(b);
  } else {
    return 0;
  }
}

export function part1(input: string) {
  const machines = parseInput(getLines(input));

  return sum(machines.map(m => getNeededTokens2(m)));
}

export function part2(input: string) {
  //const machines = parseInput(getLines(input));
  const machines = parseInput(getLines(input)).map(m => ({...m, Prize: {x: m.Prize.x + 10000000000000, y: m.Prize.y + 10000000000000}}));

  return sum(machines.map(m => getNeededTokens2(m)));
}


const sampleInput = `
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279
`.trim();

Deno.test("part1", async () => {
  assertEquals(part1(sampleInput), 480);
});

Deno.test("part2", async () => {
  assertEquals(part2(sampleInput), 875318608908);
});
