import { assertEquals } from 'jsr:@std/assert';
import { getLines, sum } from './utils.ts';

type Equation = { result: number, values: number[] }

function parseEquations(line: string): Equation {
  const [resultStr, values] = line.split(': ');
  return {
    result: parseInt(resultStr, 10),
    values: values.split(' ').map(v => parseInt(v, 10))
  };
}

function concat(v1: number, v2: number): number {
  const exp = Math.floor(Math.log(v2) / Math.log(10)) + 1;
  const ten = Math.pow(10, exp);
  return v1 * ten + v2 ; 
}

function isSolvableStep(result: number, runningResult: number, values: number[], withConcat: boolean): boolean {
  if (values.length === 0) {
    return result === runningResult;
  }
  if (runningResult > result) {
    return false;
  }
  const v = values[0];
  return isSolvableStep(result, runningResult + v, values.slice(1), withConcat) 
    || isSolvableStep(result, runningResult * v, values.slice(1), withConcat) 
    || (withConcat && isSolvableStep(result, concat(runningResult, v), values.slice(1), withConcat));
}

const isSolvable = (withConcat: boolean) => (equation: Equation) => {
  return isSolvableStep(equation.result, equation.values[0], equation.values.slice(1), withConcat) ;
}

export function part1(input: string) {
  const equations = getLines(input).map(parseEquations);
  return sum(equations.filter(isSolvable(false)).map(e => e.result));
}

export function part2(input: string) {
  const equations = getLines(input).map(parseEquations);
  return sum(equations.filter(isSolvable(true)).map(e => e.result));
}


const sampleInput = `
190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20
`.trim();

Deno.test("part1", async () => {
  assertEquals(part1(sampleInput), 3749);
});

Deno.test("part2", async () => {
  assertEquals(part2(sampleInput), 11387);
});

Deno.test('concat', async () => {
  assertEquals(concat(1,1), 11);
  assertEquals(concat(123,456), 123456);
  assertEquals(concat(99,999), 99999);
  assertEquals(concat(99,100), 99100);
  assertEquals(concat(17,8), 178);
  assertEquals(concat(15,6), 156);
})
