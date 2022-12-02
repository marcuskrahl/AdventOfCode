import { RunAocExecutorSchema } from './schema';
import { readFileSync } from 'fs';

export default async function runExecutor(
  options: RunAocExecutorSchema,
) {
  const input = readFileSync(options.input, {encoding: 'utf8'}).split('\n');
  const { part1, part2 } = await import(options.code);
  if (options.part === 2) {
    console.log(part2(input));
  } else {
    console.log(part1(input));
  }
  return {
    success: true
  };
}

