import { parseBlueprint, part1, part2 } from './code';

describe('advent of code day', () => {
  const sampleInput: string[] = [
    'Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.',
    'Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.',
  ];

  it('should parse blueprint', () => {
    expect(parseBlueprint(sampleInput[0])).toEqual({
      oreRobot: { ore: 4 },
      clayRobot: { ore: 2 },
      obsidianRobot: { ore: 3, clay: 14 },
      geodeRobot: { ore: 2, obsidian: 7 },
    });
  });

  it('should solve part1', () => {
    expect(part1(sampleInput)).toEqual(33);
  });

  it('should solve part2', () => {
    expect(part2(sampleInput)).toEqual(56 * 62);
  });
});
