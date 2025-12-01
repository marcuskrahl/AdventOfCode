import { assertEquals } from 'jsr:@std/assert';
import { getLines, Grid, parseGrid, printGrid, sum, transpose }from './utils.ts';

type Key  = {type: 'key', heights: number[]};
type Lock = {type: 'lock', heights: number[]}
type KeyOrLock = Key|Lock ;

function parseKeyOrLock(part: Grid<string>): KeyOrLock {
  const type = part[0][0] === '#' ? 'lock' : 'key';
  const heights: number[] =[];
  if (type === 'lock') {
    for (let x = 0; x < part.length; x++) {
      let height = -1;
      for (let y  = 0; y < part[x].length; y++) {
        if (part[x][y] === '.') {
          heights.push(height); 
          break;
        }
        height++;
      }
    }
  }
else { 
    for (let x = 0; x < part.length; x++) {
      let height = -1;
      for (let y  =part[x].length -1; y >= 0; y--) {
        if (part[x][y] === '.') {
          heights.push(height); 
          break;
        }
        height++;
      }
    }
  }
  return {type, heights};
}


function parseKeysAndLocks(input: string): KeyOrLock[] {
  const lines = getLines(input);
  const split = lines.indexOf('');
  const part = split > -1 ? lines.slice(0, split) : lines;
  const grid = transpose(parseGrid(part.join('\r\n')));
  const keyOrLock = parseKeyOrLock(grid);
  if (split === -1) {
    return [keyOrLock]
  } else {
    return [keyOrLock, ...parseKeysAndLocks(lines.slice(split+1).join('\r\n'))];
  }
}

function overlap(key: KeyOrLock, lock: KeyOrLock): boolean {
  for (let x =0; x<key.heights.length; x++) {
    if ((key.heights[x] + lock.heights[x]) > 5) {
      return false;
    }
  }
  return true;
}

export function part1(input: string) {
  const keysAndLocks = parseKeysAndLocks(input);
  //console.log(keysAndLocks);
  const keys = keysAndLocks.filter(k => k.type === 'key');
  const locks = keysAndLocks.filter(k => k.type === 'lock');
  return sum(keys.map(k => locks.filter(l => overlap(k,l)).length));
}

export function part2(input: string) {
  return 0;
}


const sampleInput = `
#####
.####
.####
.####
.#.#.
.#...
.....

#####
##.##
.#.##
...##
...#.
...#.
.....

.....
#....
#....
#...#
#.#.#
#.###
#####

.....
.....
#.#..
###..
###.#
###.#
#####

.....
.....
.....
#....
#.#..
#.#.#
#####
`.trim();

Deno.test("part1", async () => {
  assertEquals(part1(sampleInput), 3);
});

Deno.test("part2", async () => {
  assertEquals(part2(sampleInput), 0);
});
