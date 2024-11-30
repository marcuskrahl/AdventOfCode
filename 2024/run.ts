const year = 2023;
const sessionId = Deno.env.get("SESSION_COOKIE");

async function loadInput(inputFile: string, day:number) {
  console.log('loading input');
 const url = `https://adventofcode.com/${year}/day/${day}/input` ;
  const headers = new Headers();
  headers.set('Cookie', `session=${sessionId}`)
  headers.set('User-Agent', `https://github.com/marcuskrahl/AdventOfCode`)

  const result = await fetch(url, { headers});
  if (!result.ok) {
    console.error(result);
    throw new Error('cannot fetch input');
  }
  const content = await result.text();

  await Deno.writeTextFile(inputFile, content);
}

(async function () {
  const dayArg = Deno.args[0] as string;
  
  const day = Number.parseInt(dayArg, 10);
  const dayStr = `${day}`.padStart(2, '0');

  const sourceFile = `./day${dayStr}.ts`;
  const inputFile =  `./day${dayStr}.txt`

  const {part1, part2} = (await import(sourceFile));

  try {
    await Deno.lstat(inputFile);
  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) {
      throw err;
    }
    await loadInput(inputFile, day)
  }

  const input = await Deno.readTextFile(inputFile);

  if (part1 !== undefined) {
    const result =  part1(input);
    console.log(`Part 1: ${result}`);
  }
  if (part2 !== undefined) {
    const result = part2(input);
    console.log(`Part 2: ${result}`);
  }
})();
