import { sum, max, min } from '@adventofcode2022/util';

type TreeEntryFile = {
  type: 'file';
  name: string;
  size: number;
};

type TreeEntryDirectory = {
  type: 'directory';
  name: string;
  children: TreeEntry[];
};

type TreeEntry = TreeEntryFile | TreeEntryDirectory;

type ListCommand = {
  type: 'ls';
  path?: string;
  entries: string[];
};
type CdCommand = {
  type: 'cd';
  path: string;
};
type Command = ListCommand | CdCommand;

function preparseCommands(lines: readonly string[]): Command[] {
  if (lines.length === 0) {
    return [];
  }
  const [firstLine, ...rest] = lines;
  if (firstLine.startsWith('$ cd')) {
    return [
      { type: 'cd', path: firstLine.slice(5) },
      ...preparseCommands(rest),
    ];
  } else if (firstLine === '$ ls') {
    const nextCommandIndex = rest.findIndex((r) => r.startsWith('$'));
    const listing = rest.slice(
      0,
      nextCommandIndex >= 0 ? nextCommandIndex : rest.length
    );
    const restAfterListing =
      nextCommandIndex >= 0 ? rest.slice(nextCommandIndex) : [];
    return [
      {
        type: 'ls',
        entries: [...listing],
      },
      ...preparseCommands(restAfterListing),
    ];
  }
  throw new Error('unexpected command ' + firstLine);
}

function mapToAbsolutePath(commands: Command[]): ListCommand[] {
  let cwd: string[] = ['/'];
  let result: ListCommand[] = [];
  //ignore first cd / command
  for (let c of commands.slice(1)) {
    if (c.type === 'ls') {
      result = [...result, { ...c, path: cwd.join('/') }];
    } else {
      if (c.path === '..') {
        cwd = [...cwd.slice(0, -1)];
      } else {
        cwd = [...cwd, c.path];
      }
    }
  }
  return result;
}

function mapDirectoryEntry(
  listCommands: readonly ListCommand[],
  input: string,
  path: string
): TreeEntry {
  if (input.startsWith('dir')) {
    const directoryName = input.slice(4);
    return {
      name: directoryName,
      type: 'directory',
      children: buildTree(listCommands, `${path}/${directoryName}`),
    };
  } else {
    const [size, name] = input.split(' ');
    return {
      name: name,
      size: parseInt(size),
      type: 'file',
    };
  }
}

function buildTree(
  listCommands: readonly ListCommand[],
  path: string
): TreeEntry[] {
  const currentDirectory = listCommands.find((c) => c.path === path);
  if (currentDirectory === undefined) {
    throw new Error('cannot find listing for path ' + path);
  }
  const entries = currentDirectory.entries.map((e) =>
    mapDirectoryEntry(listCommands, e, path)
  );
  return entries;
}

function getDirectorySizes(
  tree: TreeEntry[],
  path: string
): { path: string; sizes: { file: string; size: number }[] }[] {
  const fileSizes = tree.flatMap((e) =>
    e.type === 'file' ? [{ file: `${path}/${e.name}`, size: e.size }] : []
  );

  const subDirectorySizes = tree.flatMap((e) =>
    e.type === 'directory'
      ? getDirectorySizes(e.children, `${path}/${e.name}`)
      : []
  );
  return [
    {
      path,
      sizes: [
        ...fileSizes,
        ...uniqueFiles(subDirectorySizes.flatMap((d) => d.sizes)),
      ],
    },
    ...subDirectorySizes,
  ];
}

function uniqueFiles(
  input: { file: string; size: number }[]
): { file: string; size: number }[] {
  let result: { file: string; size: number }[] = [];
  for (let file of input) {
    if (!result.some((r) => r.file === file.file)) {
      result = [...result, file];
    }
  }
  return result;
}

export function parseCommands(lines: readonly string[]): TreeEntry[] {
  const preparsedCommands = preparseCommands(lines);
  const absoluteListCommands = mapToAbsolutePath(preparsedCommands);
  return buildTree(absoluteListCommands, '/');
}

export function part1(lines: string[]): number {
  const tree = parseCommands(lines);
  const sizes = getDirectorySizes(tree, '/');
  console.log(sizes);
  const result = sum(
    sizes
      .map((s) => sum(s.sizes.map((s) => s.size)))
      .filter((s) => s <= 100_000)
  );
  return result;
}

export function part2(lines: string[]): number {
  const tree = parseCommands(lines);
  const sizes = getDirectorySizes(tree, '/').map((s) =>
    sum(s.sizes.map((si) => si.size))
  );
  const rootSize = max(sizes);
  const unusedSpace = 70_000_000 - rootSize;
  const requiredUnusedSpace = 30_000_000 - unusedSpace;

  console.log(sizes.sort((a, b) => a - b).filter((s) => s >= 10_000_000));
  console.log('required space', requiredUnusedSpace);
  /*console.log(
    'spaces',
    getDirectorySizes(tree, '/').map(
      (t) => `${t.path} ${sum(t.sizes.map((s) => s.size))}`
    )
  );*/
  const result = min(sizes.filter((s) => s >= requiredUnusedSpace));
  return result;
}
