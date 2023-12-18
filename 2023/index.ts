import { readFile } from 'node:fs/promises';

const day = '18';

async function run() {
  const input = (
    await readFile(`input/day${day}.txt`, { encoding: 'utf-8' })
  ).trim();
  const { part1, part2 } = await import(`./day${day}`);

  const start1 = performance.now();
  const result1 = part1(input);
  const time1 = performance.now() - start1;

  const start2 = performance.now();
  console.profile('test');
  const result2 = part2(input);
  const time2 = performance.now() - start2;
  console.profileEnd('test');
  console.log(`part 1: ${result1} (time: ${time1.toFixed(2)} ms)`);
  console.log(`part 2: ${result2} (time: ${time2.toFixed(2)} ms)`);
}

run();
