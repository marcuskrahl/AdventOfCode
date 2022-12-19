type Valve = {
  id: number;
  flow: number;
  originalId: string;
  neighbors: {
    id: number;
    time: number;
    originalId: string;
  }[];
};

function getId(name: string, ids: string[]): number {
  let id = ids.indexOf(name);
  if (id !== -1) {
    return id;
  }
  ids.push(name);
  return ids.indexOf(name);
}

function getNeighbors(
  neighborString: string,
  ids: string[]
): { id: number; time: number; originalId: string }[] {
  return neighborString.split(',').map((n) => {
    const id = getId(n.trim(), ids);
    return {
      id,
      time: 1,
      originalId: n.trim(),
    };
  });
}

function parseValves(lines: string[]): Valve[] {
  const ids: string[] = [];
  return lines.map((line) => {
    const regex =
      /Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? (.*)/;
    const parseResult = regex.exec(line);
    if (parseResult == null) {
      throw new Error('cannot parse line: ' + line);
    }
    const id = getId(parseResult[1], ids);
    const flow = parseInt(parseResult[2]);
    const neighbors = getNeighbors(parseResult[3], ids);
    return {
      id,
      originalId: parseResult[1],
      flow,
      neighbors,
    };
  });
}

function calculateDistanceToOtherValves(
  id: number,
  valves: Valve[]
): { id: number; time: number; originalId: string }[] {
  const visited: number[] = [];
  const distances = valves.map((_) => Number.MAX_SAFE_INTEGER);
  distances[id] = 0;
  const getMinNotProcessed = () => {
    let min = Number.MAX_SAFE_INTEGER;
    let minIndex = undefined;
    for (let i = 0; i < distances.length; i++) {
      if (distances[i] < min && !visited.includes(i)) {
        min = distances[i];
        minIndex = i;
      }
    }
    return minIndex;
  };
  let minIndex: number | undefined = undefined;
  while ((minIndex = getMinNotProcessed()) != undefined) {
    let v = distances[minIndex];
    let neighbors = valves.find((v) => v.id === minIndex)!.neighbors;
    neighbors.forEach((n) => {
      if (v + 1 < distances[n.id]) {
        distances[n.id] = v + 1;
      }
    });
    visited.push(minIndex);
  }
  return valves
    .filter((v) => v.flow > 0 && v.id !== id)
    .map((v) => ({
      id: v.id,
      time: distances[v.id],
      originalId: v.originalId,
    }));
}

function flattenValve(valve: Valve, valves: Valve[]): Valve {
  return {
    ...valve,
    neighbors: calculateDistanceToOtherValves(valve.id, valves),
  };
}

function flattenValves(valves: Valve[]): Valve[] {
  const transformedValves = valves
    .flatMap((v) =>
      v.flow === 0 && v.originalId !== 'AA' ? [] : flattenValve(v, valves)
    )
    .sort((v1, v2) =>
      v1.originalId === 'AA' ? -1 : v2.originalId === 'AA' ? 1 : v1.id - v2.id
    );
  const result: Valve[] = [];
  transformedValves.forEach((v, i) => {
    result[i] = v;
    v.id = i;
  });
  transformedValves.forEach((v) => {
    v.neighbors.forEach(
      (n) =>
        (n.id = transformedValves.findIndex(
          (l) => l.originalId === n.originalId
        )!)
    );
  });
  return result;
}

function buildFlowTable(valves: Valve[]): number[] {
  const table = [];
  let max = 1 << (valves.length + 1);
  for (let i = 0; i < max; i++) {
    let pressure = 0;
    for (let v = 0; v < valves.length; v++) {
      if ((i & (1 << v)) !== 0) {
        pressure += valves[v].flow;
      }
    }
    table[i] = pressure;
  }
  return table;
}

const memo = new Map<number, number>();

function simulate(
  timeLeft: number,
  position: number,
  openedValves: number,
  playerLeft: number,
  valves: Valve[],
  flowTable: number[]
): number {
  if (timeLeft === 0) {
    if (playerLeft === 0) {
      return 0;
    }
    const currentPressure = flowTable[openedValves];
    return (
      simulate(26, 0, openedValves, 0, valves, flowTable) - currentPressure * 26
    );
  }
  if (timeLeft < 0) {
    return 0;
  }
  //timeLeft (0 - 32) | position (0-15) | openedValves (16 bit) | playerLeft (1bit)
  const memoKey =
    (((((openedValves << 4) | position) << 5) | timeLeft) << 1) | playerLeft;
  const memoResult = memo.get(memoKey);
  if (memoResult != undefined) {
    return memoResult;
  }
  let maxResult = 0;
  const currentValve = valves[position];
  const currentPressure = flowTable[openedValves];
  for (let valve of currentValve.neighbors) {
    if (timeLeft - valve.time < 0) {
      continue;
    }
    const subRun =
      currentPressure * valve.time +
      simulate(
        timeLeft - valve.time,
        valve.id,
        openedValves,
        playerLeft,
        valves,
        flowTable
      );
    maxResult = Math.max(maxResult, subRun);
  }
  if (((1 << currentValve.id) & openedValves) === 0) {
    const newOpenedValves = openedValves | (1 << currentValve.id);
    const subRun =
      currentPressure +
      simulate(
        timeLeft - 1,
        position,
        newOpenedValves,
        playerLeft,
        valves,
        flowTable
      );
    maxResult = Math.max(maxResult, subRun);
  }
  //wait
  maxResult = Math.max(
    maxResult,
    currentPressure +
      simulate(
        timeLeft - 1,
        position,
        openedValves,
        playerLeft,
        valves,
        flowTable
      )
  );

  memo.set(memoKey, maxResult);
  return maxResult;
}

export function part1(lines: string[]): number {
  const valves = flattenValves(parseValves(lines));
  const flowTable = buildFlowTable(valves);
  return simulate(30, 0, 1, 0, valves, flowTable);
}

export function part2(lines: string[]): number {
  const valves = flattenValves(parseValves(lines));
  const flowTable = buildFlowTable(valves);
  return simulate(26, 0, 1, 1, valves, flowTable);
}
