import { RunAocExecutorSchema } from './schema';
import { readFileSync } from 'fs';

export default async function runExecutor(options: RunAocExecutorSchema) {
  let input = readFileSync(options.input, { encoding: 'utf8' }).split('\n');
  if (input.at(-1) === '') {
    input = input.slice(0, -1);
  }
  const { part1, part2 } = await import(options.code);
  if (options.part === 2) {
    console.log(part2(input));
  } else {
    console.log(part1(input));
  }
  return {
    success: true,
  };
}
