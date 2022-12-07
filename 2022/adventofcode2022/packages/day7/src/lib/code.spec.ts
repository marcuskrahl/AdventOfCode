import { part1, part2, parseCommands } from './code';

describe('advent of code day', () => {
  const sampleInput: string[] = [
    '$ cd /',
    '$ ls',
    'dir a',
    '14848514 b.txt',
    '8504156 c.dat',
    'dir d',
    '$ cd a',
    '$ ls',
    'dir e',
    '29116 f',
    '2557 g',
    '62596 h.lst',
    '$ cd e',
    '$ ls',
    '584 i',
    '$ cd ..',
    '$ cd ..',
    '$ cd d',
    '$ ls',
    '4060174 j',
    '8033020 d.log',
    '5626152 d.ext',
    '7214296 k',
  ];

  const sampleInput2: string[] = [
    '$ cd /',
    '$ ls',
    'dir a',
    '$ cd a',
    '$ ls',
    'dir a',
    '2 a.txt',
    '$ cd a',
    '$ ls',
    '99999 a.txt',
  ];

  const sampleInput3: string[] = [
    '$ cd /',
    '$ ls',
    'dir a',
    '99999999999 test.txt',
    '$ cd a',
    '$ ls',
    'dir b',
    '$ cd b',
    '$ ls',
    'dir c',
    '$ cd c',
    '$ ls',
    '99999 a.txt',
  ];

  it('should parse commands into tree', () => {
    expect(parseCommands(sampleInput)).toEqual([
      {
        type: 'directory',
        name: 'a',
        children: [
          {
            type: 'directory',
            name: 'e',
            children: [{ type: 'file', name: 'i', size: 584 }],
          },
          { type: 'file', name: 'f', size: 29116 },
          { type: 'file', name: 'g', size: 2557 },
          { type: 'file', name: 'h.lst', size: 62596 },
        ],
      },
      { type: 'file', name: 'b.txt', size: 14848514 },
      { type: 'file', name: 'c.dat', size: 8504156 },
      {
        type: 'directory',
        name: 'd',
        children: [
          { type: 'file', name: 'j', size: 4060174 },
          { type: 'file', name: 'd.log', size: 8033020 },
          { type: 'file', name: 'd.ext', size: 5626152 },
          { type: 'file', name: 'k', size: 7214296 },
        ],
      },
    ]);
  });

  it('should solve part1', () => {
    expect(part1(sampleInput)).toEqual(95437);
    expect(part1(sampleInput2)).toEqual(99999);
    expect(part1(sampleInput3)).toEqual(3 * 99999);
  });

  it('should solve part2', () => {
    expect(part2(sampleInput)).toEqual(24933642);
  });
});
