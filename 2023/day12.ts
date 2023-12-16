import { getLines, sum } from './utils';
function iterArrangementsTmp(
  grid: string,
  blocks: number[],
  startX: number = 0,
): string[] {
  //console.log(grid, blocks.join(','));
  if (blocks.length === 0) {
    return grid.includes('#') ? [] : [grid.replace(/./g, '.')];
  }
  const [block, ...rest] = blocks;
  let possiblePlacements = [];
  if (block > grid.length) {
    return [];
  }
  for (let x = startX; x < grid.length; x++) {
    //console.log(x);
    if (x + block > grid.length) {
      continue;
    }
    if (x > 0 && grid[x - 1] === '#') {
      break;
    }
    let isPossible = true;
    for (let xe = 0; xe < block; xe++) {
      if (grid[x + xe] === '.') {
        isPossible = false;
        break;
      }
    }
    if (isPossible === false) {
      continue;
    }
    if (x + block < grid.length && grid[x + block] === '#') {
      continue;
    }
    let nextGrid = grid.slice(x + block);
    if (nextGrid.length > 0) {
      //console.log('with recursion');
      if (nextGrid[0] === '?') {
        nextGrid = '.' + nextGrid.slice(1);
      }
      const nestedPlacements = iterArrangementsTmp(nextGrid, rest, 0);
      /*console.log(
        'nested placements',
        nestedPlacements,
        nextGrid,
        rest.join(','),
      );*/
      possiblePlacements.push(
        ...nestedPlacements.map(
          (p) =>
            grid.slice(0, x).replace(/./g, '.') +
            grid.slice(x, x + block).replace(/./g, '#') +
            p,
        ),
      );
    } else if (rest.length > 0) {
      break;
    } else {
      //console.log('without recursion');
      possiblePlacements.push(
        grid.slice(0, x).replace(/./g, '.') +
          grid.slice(x, x + block).replace(/./g, '#'),
      );
    }
  }
  //console.log('possible placements', possiblePlacements);
  return possiblePlacements;
}

const memo: { [key: string]: number } = {};

function iterArrangements(
  grid: string,
  blocks: number[],
  startX: number = 0,
): number {
  //console.log(grid, blocks.join(','));
  if (blocks.length === 0) {
    return grid.includes('#') ? 0 : 1;
  }
  const [block, ...rest] = blocks;
  let possiblePlacements = 0;
  if (block > grid.length) {
    return 0;
  }
  for (let x = startX; x < grid.length; x++) {
    //console.log(x);
    if (x + block > grid.length) {
      continue;
    }
    if (x > 0 && grid[x - 1] === '#') {
      break;
    }
    let isPossible = true;
    for (let xe = 0; xe < block; xe++) {
      if (grid[x + xe] === '.') {
        isPossible = false;
        break;
      }
    }
    if (isPossible === false) {
      continue;
    }
    if (x + block < grid.length && grid[x + block] === '#') {
      continue;
    }
    //console.log('recursion');
    let nextGrid = grid.slice(x + block);
    if (nextGrid.length > 0) {
      //console.log('with recursion');
      if (nextGrid[0] === '?') {
        nextGrid = '.' + nextGrid.slice(1);
      }
      //console.log(nextGrid);
      const key = nextGrid + rest.join(',');
      if (memo[key] != undefined) {
      }
      const nestedPlacements =
        memo[key] != undefined
          ? memo[key]
          : iterArrangements(nextGrid, rest, 0);
      memo[key] = nestedPlacements;
      /*console.log(
        'nested placements',
        nestedPlacements,
        nextGrid,
        rest.join(','),
      );*/
      possiblePlacements += nestedPlacements;
    } else if (rest.length > 0) {
      break;
    } else {
      //console.log('without recursion');
      possiblePlacements += 1;
    }
  }
  //console.log('possible placements', possiblePlacements);
  return possiblePlacements;
}

function checkPattern(input: string, expectedBlocks: number[]): void {
  let count = 0;
  let actualBlocks = [];
  for (let x = 0; x < input.length; x++) {
    if (input[x] === '.' && count > 0) {
      actualBlocks.push(count);
      count = 0;
    } else if (input[x] === '#') {
      count++;
    }
  }
  if (count > 0) {
    actualBlocks.push(count);
  }
  if (
    actualBlocks.length !== expectedBlocks.length ||
    !actualBlocks.every((b, i) => b === expectedBlocks[i])
  ) {
    throw new Error(
      `block mismatch ${input} ${actualBlocks.join(',')} ${expectedBlocks.join(
        ',',
      )}`,
    );
  }
}

export function getArrangements(input: string): number {
  console.log(input);
  const [grid, blocksString] = input.split(' ');
  const blocks = blocksString.split(',').map((s) => parseInt(s, 10));
  const count = iterArrangements(grid, blocks, 0);
  return count;
}

export function part1(input: string) {
  return sum(getLines(input).map((l) => getArrangements(l)));
}

function unfold(input: string): string {
  const [grid, blocks] = input.split(' ');

  return [
    [grid, grid, grid, grid, grid].join('?'),
    [blocks, blocks, blocks, blocks, blocks].join(','),
  ].join(' ');
}

export function part2(input: string) {
  return sum(getLines(input).map((l) => getArrangements(unfold(l))));
}
