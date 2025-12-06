import { assertEquals } from 'jsr:@std/assert';
import { getLines, Grid, mapGrid, newGrid, parseGrid, printGrid, sum, transpose } from './utils.ts';

type Equation = { operator: '*' | '+', values: number[]};

function parseEquations(input: string):  Equation[]{
  const lines = getLines(input).map(line => line.split(/\s+/));
  const grid:Grid<number | '*' | '+'> = newGrid(lines[0].length, lines.length, 0);
  const equations: Equation[] = Array.from({length: lines[0].length}, () => ({ operator: '*', values: []}));
  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      if (y === lines.length - 1) {
        //operator
        equations[x].operator = lines[y][x] as '*' | '+';
      } else {
        //value
        equations[x].values.push(parseInt(lines[y][x], 10));
      }
    }
  }
  return equations;
}


function parseCephalodColumns(input: string):  Equation[]{
  //parse grid method body, but do not trim
  const grid = transpose(input.split('\n').map((line) => line.split('')));
  //printGrid(grid);
  let equations: Equation[] = [];
  let equation: Equation = { operator: '+', values: []}
  //parse right to left
  for (let x = grid.length- 1; x >= 0; x--) {
    let isEmpty = true;
    let value = 0;

    for (let y = 0; y<grid[x].length; y++) {
      const v = grid[x][y];
      if (v === ' ') {
        continue;
      }
      else if (v === '*' || v === '+') {
        isEmpty = false;
        equation.operator = v;
      }
      else {
        isEmpty = false;
        value = value * 10 + parseInt(v, 10);
        //console.log(value, v);
      }
    }
    if (isEmpty) {
      equations.push(equation);
      equation = { operator: '+', values: []};
    } else {
      equation.values.push(value);
    }
  }
  equations.push(equation);
  //console.log(equations);
  return equations;
}


function solveEquation(equation: Equation): number {
return equation.values.slice(1).reduce<number>((acc, curr) => equation.operator === '*' ? acc * curr : acc + curr, equation.values[0])
}

export function part1(input: string) {
  const equations = parseEquations(input);
  return sum(equations.map(e => solveEquation(e)));
}

export function part2(input: string) {
  const equations = parseCephalodColumns(input);
  return sum(equations.map(e => solveEquation(e)));
}


const sampleInput = `
123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +
`.trim();

Deno.test("part1", async () => {
  assertEquals(part1(sampleInput), 4277556);
});

Deno.test("part2", async () => {
  assertEquals(part2(sampleInput), 3263827);
});
