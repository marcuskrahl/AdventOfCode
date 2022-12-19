import { max, sum } from '@adventofcode2022/util';

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

const memo = new Map<string, number>();

function simulate(state: State): number {
  if (state.minute > 25) {
    const serializedState = JSON.stringify(state);
    const memoResult = memo.get(serializedState);
    if (memoResult != undefined) {
      return memoResult;
    }
  }
  if (state.minute === 25) {
    return state.geodes;
  }
  let results = [];
  const advancedState = advanceState(state);
  if (state.ore >= state.blueprint.oreRobot.ore) {
    //build ore robot
    const newState = {
      ...advancedState,
      ore: advancedState.ore - state.blueprint.oreRobot.ore,
      oreRobots: advancedState.oreRobots + 1,
    };
    results.push(simulate(newState));
  }
  if (state.ore >= state.blueprint.clayRobot.ore) {
    //build clay robot
    const newState = {
      ...advancedState,
      ore: advancedState.ore - state.blueprint.clayRobot.ore,
      clayRobots: advancedState.clayRobots + 1,
    };
    results.push(simulate(newState));
  }
  if (
    state.ore >= state.blueprint.obsidianRobot.ore &&
    state.clay >= state.blueprint.obsidianRobot.clay
  ) {
    //build obsidian robot
    const newState = {
      ...advancedState,
      ore: advancedState.ore - state.blueprint.obsidianRobot.ore,
      clay: advancedState.clay - state.blueprint.obsidianRobot.clay,
      obsidianRobots: advancedState.obsidianRobots + 1,
    };
    results.push(simulate(newState));
  }
  if (
    state.ore >= state.blueprint.geodeRobot.ore &&
    state.obsidian >= state.blueprint.geodeRobot.obsidian
  ) {
    //build geode robot
    const newState = {
      ...advancedState,
      ore: advancedState.ore - state.blueprint.geodeRobot.ore,
      obsidian: advancedState.obsidian - state.blueprint.geodeRobot.obsidian,
      geodeRobots: advancedState.geodeRobots + 1,
    };
    results.push(simulate(newState));
  }
  results.push(simulate(advancedState));
  const result = max(results);
  if (state.minute > 25) {
    const serializedState = JSON.stringify(state);
    memo.set(serializedState, result);
  }
  return result;
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
    blueprints.map((blueprint, i) => (i + 1) * simulate(initState(blueprint)))
  );
  return result;
}

export function part2(lines: string[]): number {
  return 0;
}
