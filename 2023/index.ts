import { readFile } from 'node:fs/promises';

const day = '03';

async function run() {
  const input = (
    await readFile(`input/day${day}.txt`, { encoding: 'utf-8' })
  ).trim();
  const { part1, part2 } = await import(`./day${day}`);

  console.log('part 1:', part1(input));
  console.log('part 2:', part2(input));
}

run();
