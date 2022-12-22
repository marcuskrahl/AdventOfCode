import { part1, part2 } from './code';

describe('advent of code day', () => {
  const sampleInput: string[] = [
    '        ...#',
    '        .#..',
    '        #...',
    '        ....',
    '...#.......#',
    '........#...',
    '..#....#....',
    '..........#.',
    '        ...#....',
    '        .....#..',
    '        .#......',
    '        ......#.',
    '',
    '10R5L5R10L4R5L5',
  ];

  it('should solve part1', () => {
    expect(part1(sampleInput)).toEqual(6032);
  });

  it('should solve part2', () => {
    expect(part2(sampleInput)).toEqual(0);
  });
});
