import { assertEquals } from 'jsr:@std/assert';
import { sum } from './utils.ts';

type Block = {
  start: number,
  end: number,
  id: number
}

function parseInput(input: string): Block[] { 
  const blocks = input.split('');
  let start = 0;
  let id = 0;
  let empty = false;
  return blocks.map((b) => {
    const length = parseInt(b, 10);
    const end = start + length;
    const result = {
      start,
      end,
      id: empty ? -1 : id++
    };
    start = end;
    empty = !empty;
    return result;
  })
}

function moveFiles(blocks: Block[]): Block[] {
  let newBlocks: Block[] = [...blocks]; 
  for (let i = 0; i<newBlocks.length; i++) {
    const block = newBlocks[i];
    if (block.id !== -1) {
      continue;
    }
    newBlocks.splice(i, 1);
    let emptySpace = block.end - block.start;
    let start = block.start;
    while (emptySpace > 0) {
      let lastBlock = newBlocks.filter(b => b.start > start && b.id !== -1).at(-1);
      if (lastBlock === undefined) {
        //no more blocks to fill 
        return newBlocks.toSorted((b1,b2) => b1.start - b2.start);
      }
      let length = lastBlock.end - lastBlock.start;
      if (length <= emptySpace) {
        newBlocks.splice(i, 0, { start: start, end: start + length, id: lastBlock.id});
        newBlocks = newBlocks.filter(b => b !== lastBlock);
        i++;
        start += length;
        emptySpace -= length;
      } else {
        i++;
        newBlocks.splice(i, 0, { start: start, end: start + emptySpace, id: lastBlock.id});
        lastBlock.end -= emptySpace;
        start += emptySpace;
        emptySpace = 0;
      }
    }
  }
  throw new Error('should encounter empty end');
}

function moveFiles2(blocks: Block[]): void{
  for (let i = blocks.length - 1; i>= 0; i--) {
    const block = blocks[i];
    if (block.id === -1) {
      continue;
    }
    let length = block.end - block.start;
    let emptyBlockIndex = blocks.findIndex(b => b.id === -1 && b.start < block.start && (b.end - b.start) >= length);
    if (emptyBlockIndex === -1) {
      continue;
    }
    const emptyBlock = blocks[emptyBlockIndex];
    block.start = emptyBlock.start;
    block.end = block.start + length;
    emptyBlock.start = block.end;
  }
}

function calculateChecksum(blocks: Block[]): number {
  return sum(blocks.filter(b => b.id !== -1).map(b => {
    let result = 0;
    for (let i =b.start; i < b.end; i++) {
      result += i * b.id;
    }
    return result;
  }))
}

export function part1(input: string) {
  const blocks = parseInput(input);
  const movedBlocks = moveFiles(blocks);
  return calculateChecksum(movedBlocks);
}

export function part2(input: string) {
  const blocks = parseInput(input);
  moveFiles2(blocks);
  return calculateChecksum(blocks);
}


const sampleInput = `2333133121414131402 `.trim();

Deno.test("part1", async () => {
  assertEquals(part1(sampleInput), 1928);
});

Deno.test("part2", async () => {
  assertEquals(part2(sampleInput), 2858);
});
