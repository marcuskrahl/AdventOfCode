import { assertEquals } from 'jsr:@std/assert';
import { findGrid, getLines, Grid, mapGrid, newGrid, printGrid, sumGrid, transpose, tryGetCoordinate } from './utils.ts';

function parseInput(input: string[]): [Grid<string>, string[]] {
  const divider = input.findIndex(l => l.trim() === '');
  const gridStr = transpose(input.slice(0,divider).map(l => l.split('')));
  const movements = input.slice(divider + 1).flatMap(l => l.split(''));
  return [gridStr, movements];
}

function nextAffected(x: number,y: number, dx: number, dy: number, grid: Grid<string>): [number,number][] {
      if (dy != 0) {
        const xn = x + dx;
        const yn = y + dy;
        const v = grid[xn][yn];
        let r: [number, number][] = [[xn, yn]];
        if (v === '[') {
          r.push([xn +1, yn]);
        } else if (v === ']') {
          r.push([xn -1, yn]);
        }
        return r;
      } else {
        return [[x + dx, y +dy]];
      }
}

function moveInGrid(grid: Grid<string>, [x,y]: [number,number], movement: string): [number, number] {
  let dx = 0;
  let dy = 0;
  if (movement === '^') {
    dy = -1;
  } else if (movement === '<') {
    dx = -1;
  } else if (movement === '>') {
    dx = 1;
  } else if (movement === 'v') {
    dy = 1;
  } else {
    throw new Error('unexpected movement: ' + movement);
  }
  
  let affectedCoords: [number, number][] = nextAffected(x, y, dx, dy, grid);
  let allAffectedCoords: [number,number][]= [];
  while (true) {
    allAffectedCoords.push(...affectedCoords);
    if (affectedCoords.every(([xa, ya]) => grid[xa][ya] === '.')) {
      break;
    }
    if (affectedCoords.some(([xa, ya]) => grid[xa][ya] === '#' )) {
      return [x, y];
    }
    affectedCoords = affectedCoords.filter(([xa,ya]) => grid[xa][ya] !== '.').flatMap(([xa, ya]) => nextAffected(xa, ya, dx, dy, grid))
  }
  allAffectedCoords.reverse(); 
  allAffectedCoords.forEach(([xa, ya]) => {
    const xn = xa -dx;
    const yn = ya - dy;
    grid[xa][ya] = (x === xn && y === yn || allAffectedCoords.some(([xo, yo]) => xo === xn && yo === yn )) ? grid[xn][yn] : '.';
  });
  grid[x][y] = '.';
  return [x+dx, y+dy];
}

export function part1(input: string) {
  const [grid, movements] = parseInput(getLines(input));
  let pos = findGrid(grid, (v) => v === '@');
  movements.forEach(m => {
    pos = moveInGrid(grid, pos, m);
  });
  return sumGrid(grid, (v,x,y) => v === 'O' ? 100 * y + x : 0);
}

function enlargeGrid(grid: Grid<string>): Grid<string> {
  let ng = mapGrid(newGrid(grid.length * 2, grid.length, '.'), (_, x,y) => {
      const original = grid[Math.floor(x/2)][y];
      if (original === '@') {
        return x % 2 === 1 ? '.' : '@';
      }
      if (original === 'O') {
        return x % 2 === 1 ? ']' : '[';
      }
      return original;
  });
  return ng;
}

export function part2(input: string) {
  let [grid, movements] = parseInput(getLines(input));
  grid =enlargeGrid(grid);
  let pos = findGrid(grid, (v) => v === '@');
  movements.forEach(m => {
    pos = moveInGrid(grid, pos, m);
  });
    //printGrid(grid);
  return sumGrid(grid, (v,x,y) => v === '[' ? 100 * y + x : 0);
}


const sampleInput = `
##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^
`.trim();

const sample2 = `
#######
#...#.#
#.....#
#..OO@#
#..O..#
#.....#
#######

<vv<<^^<<^^
`.trim()

Deno.test("part1", async () => {
  assertEquals(part1(sampleInput), 10092);
});

Deno.test("part2", async () => {
  assertEquals(part2(sampleInput), 9021);
});
