import { max, sum, product } from '@adventofcode2022/util';

type Blueprint = {
  oreRobot: { ore: number };
  clayRobot: { ore: number };
  obsidianRobot: { ore: number; clay: number };
  geodeRobot: { ore: number; obsidian: number };
};

export function parseBlueprint(line: string): Blueprint {
  const robotLines = line.split(':')[1].split('.');
  const costRegex = /(\d+) ore(?: and (\d+))?/;
  const oreResult = costRegex.exec(robotLines[0]);
  const clayResult = costRegex.exec(robotLines[1]);
  const obsidianResult = costRegex.exec(robotLines[2]);
  const geodeResult = costRegex.exec(robotLines[3]);
  if (
    oreResult == null ||
    clayResult == null ||
    obsidianResult == null ||
    geodeResult == null
  ) {
    throw new Error('cannot parse line ' + line);
  }
  return {
    oreRobot: { ore: parseInt(oreResult[1]) },
    clayRobot: { ore: parseInt(clayResult[1]) },
    obsidianRobot: {
      ore: parseInt(obsidianResult[1]),
      clay: parseInt(obsidianResult[2]),
    },
    geodeRobot: {
      ore: parseInt(geodeResult[1]),
      obsidian: parseInt(geodeResult[2]),
    },
  };
}

type State = {
  ore: number;
  clay: number;
  obsidian: number;
  geodes: number;
  blueprint: Blueprint;
  oreRobots: number;
  clayRobots: number;
  obsidianRobots: number;
  geodeRobots: number;
  minute: number;
};

function advanceState(state: State): State {
  return {
    ...state,
    ore: state.ore + state.oreRobots,
    clay: state.clay + state.clayRobots,
    obsidian: state.obsidian + state.obsidianRobots,
    geodes: state.geodes + state.geodeRobots,
    minute: state.minute + 1,
  };
}

/*const ORE_LIMIT = 5;
const CLAY_LIMIT = 5;
const OBSIDIAN_LIMIT = 5;
const ORE_ROBOT_LIMIT = 2;
const CLAY_ROBOT_LIMIT = 3;
const OBSIDIAN_ROBOT_LIMIT = 3;
const GEODE_ROBOT_LIMIT = 3;*/

const ORE_LIMIT = 6;
const CLAY_LIMIT = 6;
const OBSIDIAN_LIMIT = 6;
const ORE_ROBOT_LIMIT = 3;
const CLAY_ROBOT_LIMIT = 4;
const OBSIDIAN_ROBOT_LIMIT = 4;
const GEODE_ROBOT_LIMIT = 4;

let memo = new Map<number, number>();

function simulate(
  minutesLeft: number,
  ore: number,
  clay: number,
  obsidian: number,
  oreRobots: number,
  clayRobots: number,
  obsidianRobots: number,
  geodeRobots: number,
  blueprint: Blueprint
): number {
  if (minutesLeft === 0) {
    return 0;
  }

  if (ore >= 1 << ORE_LIMIT) {
    ore = (1 << ORE_LIMIT) - 1;
  }
  if (clay >= 1 << CLAY_LIMIT) {
    clay = (1 << CLAY_LIMIT) - 1;
  }
  if (obsidian >= 1 << OBSIDIAN_LIMIT) {
    obsidian = (1 << OBSIDIAN_LIMIT) - 1;
  }
  if (oreRobots >= 1 << ORE_ROBOT_LIMIT) {
    oreRobots = (1 << ORE_ROBOT_LIMIT) - 1;
  }
  if (clayRobots >= 1 << CLAY_ROBOT_LIMIT) {
    clayRobots = (1 << CLAY_ROBOT_LIMIT) - 1;
  }
  if (obsidianRobots >= 1 << OBSIDIAN_ROBOT_LIMIT) {
    obsidianRobots = (1 << OBSIDIAN_ROBOT_LIMIT) - 1;
  }
  if (geodeRobots >= 1 << GEODE_ROBOT_LIMIT) {
    geodeRobots = (1 << GEODE_ROBOT_LIMIT) - 1;
  }
  const stateKey =
    (((((((((((((ore << CLAY_LIMIT) | clay) << OBSIDIAN_LIMIT) | obsidian) <<
      ORE_ROBOT_LIMIT) |
      oreRobots) <<
      CLAY_ROBOT_LIMIT) |
      clayRobots) <<
      OBSIDIAN_ROBOT_LIMIT) |
      obsidianRobots) <<
      GEODE_ROBOT_LIMIT) |
      geodeRobots) <<
      5) |
    minutesLeft;
  const memoValue = memo.get(stateKey);
  if (memoValue != undefined) {
    return memoValue;
  }
  let maxResult = 0;
  const newOre = ore + oreRobots;
  const newClay = clay + clayRobots;
  const newObsidian = obsidian + obsidianRobots;
  if (ore >= blueprint.oreRobot.ore) {
    //build ore robot
    maxResult = Math.max(
      maxResult,
      geodeRobots +
        simulate(
          minutesLeft - 1,
          newOre - blueprint.oreRobot.ore,
          newClay,
          newObsidian,
          oreRobots + 1,
          clayRobots,
          obsidianRobots,
          geodeRobots,
          blueprint
        )
    );
  }
  if (ore >= blueprint.clayRobot.ore) {
    //build clay robot
    maxResult = Math.max(
      maxResult,
      geodeRobots +
        simulate(
          minutesLeft - 1,
          newOre - blueprint.clayRobot.ore,
          newClay,
          newObsidian,
          oreRobots,
          clayRobots + 1,
          obsidianRobots,
          geodeRobots,
          blueprint
        )
    );
  }
  if (
    ore >= blueprint.obsidianRobot.ore &&
    clay >= blueprint.obsidianRobot.clay
  ) {
    //build obsidian robot
    maxResult = Math.max(
      maxResult,
      geodeRobots +
        simulate(
          minutesLeft - 1,
          newOre - blueprint.obsidianRobot.ore,
          newClay - blueprint.obsidianRobot.clay,
          newObsidian,
          oreRobots,
          clayRobots,
          obsidianRobots + 1,
          geodeRobots,
          blueprint
        )
    );
  }
  if (
    ore >= blueprint.geodeRobot.ore &&
    obsidian >= blueprint.geodeRobot.obsidian
  ) {
    //build geode robot
    maxResult = Math.max(
      maxResult,
      geodeRobots +
        simulate(
          minutesLeft - 1,
          newOre - blueprint.geodeRobot.ore,
          newClay,
          newObsidian - blueprint.geodeRobot.obsidian,
          oreRobots,
          clayRobots,
          obsidianRobots,
          geodeRobots + 1,
          blueprint
        )
    );
  }
  maxResult = Math.max(
    maxResult,
    geodeRobots +
      simulate(
        minutesLeft - 1,
        newOre,
        newClay,
        newObsidian,
        oreRobots,
        clayRobots,
        obsidianRobots,
        geodeRobots,
        blueprint
      )
  );
  memo.set(stateKey, maxResult);
  return maxResult;
}

function initState(blueprint: Blueprint): State {
  return {
    ore: 0,
    clay: 0,
    obsidian: 0,
    geodes: 0,
    oreRobots: 1,
    clayRobots: 0,
    obsidianRobots: 0,
    geodeRobots: 0,
    blueprint: blueprint,
    minute: 1,
  };
}

export function part1(lines: string[]): number {
  const blueprints = lines.map((l) => parseBlueprint(l));
  const result = sum(
    blueprints.map((blueprint, i) => {
      memo = new Map<number, number>();
      const result = simulate(24, 0, 0, 0, 1, 0, 0, 0, blueprint);
      console.log(result);
      return (i + 1) * result;
    })
  );
  return result;
}

export function part2(lines: string[]): number {
  const blueprints = lines.map((l) => parseBlueprint(l)).slice(0, 3);
  const result = product(
    blueprints.map((blueprint) => {
      memo = new Map<number, number>();
      const result = simulate(32, 0, 0, 0, 1, 0, 0, 0, blueprint);
      console.log(result);
      return result;
    })
  );
  return result;
}
