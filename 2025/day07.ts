import { assertEquals } from 'jsr:@std/assert';
import { Grid, parseGrid, printGrid, sum, transpose } from './utils.ts';

function stepGrid(grid: Grid<string>, y: number): number {
  let splits = 0;
  for (let x=0; x < grid.length; x++) {
    if (grid[x][y-1] !== '|' && grid[x][y-1] !== 'S') {
      continue;
    }
    if (grid[x][y] === '.') {
      grid[x][y] = '|';
    }
    else if (grid[x][y] === '^') {
      splits++;
      if (grid[x-1][y] === '.') {
        grid[x-1][y] = '|';
      }
      if (grid[x+1][y] === '.') {
        grid[x+1][y] = '|';
      }
    }
  }
  return splits;
}

type Particle = { x: number, amount: number};


function manyWorld(grid: Grid<string>, y: number, particles: Particle[]): Particle[] {
  let newParticles:Particle[] =  [];
  for (let p of particles) {
    if (grid[p.x][y] === '.') {
      newParticles.push(p);
    }
    else if (grid[p.x][y] === '^') {
      let e1 = newParticles.find(np => np.x === (p.x - 1));
      if (e1 == undefined) {
        e1 = { x: p.x - 1, amount: 0};
        newParticles.push(e1);
      }
      let e2 = newParticles.find(np => np.x === (p.x + 1));
      if (e2 == undefined) {
        e2 = { x: p.x + 1, amount: 0};
        newParticles.push(e2);
      }
      e1.amount += p.amount;
      e2.amount += p.amount
    }
  }
  return newParticles;
}


export function part1(input: string) {
  const grid = transpose(parseGrid(input));
  let splits = 0;
  for( let i = 1; i < grid[0].length; i++) {
    splits += stepGrid(grid, i);
  }
  return splits;
}

function getStart(grid: Grid<string>) {
  for (let x = 0; x< grid.length; x++) {
    if (grid[x][0] === 'S') {
      return x;
    }
  }
  throw new Error('start not found');
}


export function part2(input: string) {
  const grid = transpose(parseGrid(input));
  let particles = [ { x: getStart(grid), amount: 1}]
  for( let i = 1; i < grid[0].length; i++) {
    particles = manyWorld(grid, i, particles);
  }
  return sum(particles.map(p => p.amount));
}


const sampleInput = `
.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............
`.trim();

Deno.test("part1", async () => {
  assertEquals(part1(sampleInput), 21);
});

Deno.test("part2", async () => {
  assertEquals(part2(sampleInput), 40);
});
