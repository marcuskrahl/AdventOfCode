import { assertEquals } from 'jsr:@std/assert';
import { sum } from './utils.ts';



export function part1(input: string) {
  const regex = /mul\((\d+),(\d+)\)/g;
  const multiplications = Array.from(input.matchAll(regex)).map(([_,d1,d2]) => parseInt(d1,10) * parseInt(d2, 10));
  return sum(multiplications);
}

function prepareInput(input: string):string {
  const indexNot = input.indexOf("don't()");
  if (indexNot === -1) {
    return input;
  }
  const validInput = input.slice(0,indexNot);
  const indexDo = input.indexOf('do()', indexNot + 1);

  if (indexDo === -1) {
    return validInput;
  }
  return validInput + prepareInput(input.slice(indexDo));
}

export function part2(input: string) {
  const preparedInput = prepareInput(input);
  return part1(preparedInput);
}


const sampleInput = `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`.trim();
const sampleInputPart2 = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`;

Deno.test("part1", async () => {
  assertEquals(part1(sampleInput), 161);
});

Deno.test("part2", async () => {
  assertEquals(part2(sampleInputPart2), 48);
});
