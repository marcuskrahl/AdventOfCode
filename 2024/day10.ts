import { assertEquals } from 'jsr:@std/assert';
import { transpose, parseGrid, printGrid, mapGrid, tryGetCoordinate, sum, reduceGrid, unique } from './utils.ts'

export function part1(input: string) {
  const grid = transpose(parseGrid(input));
  let mappedGrid = mapGrid(grid, (v,x,y)=> ({value: parseInt(v, 10), routes: [x*100 + y]}));
  for (let i = 8; i>=0; i--) {
    mappedGrid = mapGrid(mappedGrid, (v,x,y) => {

      if (v.value === i) {
        const neighbors = [ 
          tryGetCoordinate(mappedGrid, x-1, y),
          tryGetCoordinate(mappedGrid, x+1, y),
          tryGetCoordinate(mappedGrid, x, y-1),
          tryGetCoordinate(mappedGrid, x, y+1),
        ].filter(n => n !== undefined && n.value === i+1).flatMap(n => n!.routes);
        return {
          value: v.value,
          routes: unique(neighbors)
        }
      } else {
        return v; 
      }
    })
  }
  return reduceGrid(mappedGrid, (acc, x,y, v)=> v.value === 0 ? v.routes.length + acc :  acc ,0);
}

export function part2(input: string) {
  const grid = transpose(parseGrid(input));
  let mappedGrid = mapGrid(grid, (v)=> ({value: parseInt(v, 10), routes: 1}));
  for (let i = 8; i>=0; i--) {
    mappedGrid = mapGrid(mappedGrid, (v,x,y) => {

      if (v.value === i) {
        const neighbors = [ 
          tryGetCoordinate(mappedGrid, x-1, y),
          tryGetCoordinate(mappedGrid, x+1, y),
          tryGetCoordinate(mappedGrid, x, y-1),
          tryGetCoordinate(mappedGrid, x, y+1),
        ].filter(n => n !== undefined && n.value === i+1).map(n => n!.routes);
        return {
          value: v.value,
          routes: sum(neighbors)
        }
      } else {
        return v; 
      }
    })
  }
  return reduceGrid(mappedGrid, (acc, x,y, v)=> v.value === 0 ? v.routes + acc :  acc ,0)
}


const sampleInput = `
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
`.trim();

Deno.test("part1", async () => {
  assertEquals(part1(sampleInput), 36);
});

Deno.test("part2", async () => {
  assertEquals(part2(sampleInput), 81);
});
