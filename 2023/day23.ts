import {
  Grid,
  assertNotNull,
  getLines,
  getNeighbors,
  parseGrid,
  transpose,
} from './utils';

type Node = {
  from: {
    x: number;
    y: number;
  };
  to: {
    x: number;
    y: number;
  };
  steps: number;
};

function traverseGrid(
  grid: Grid<string>,
  start: { x: number; y: number },
  offset: { x: number; y: number },
): Node[] {
  let ox = offset.x;
  let oy = offset.y;
  let steps = 0;
  let x = start.x + offset.x;
  let y = start.y + offset.y;
  while (true) {
    steps++;
    if (x === grid.length - 2 && y === grid.length - 1) {
      //found exit
      return [{ from: start, to: { x, y }, steps }];
    }
    const neighbors = getNeighbors(grid, x, y);
    let nextSteps = [];
    if (neighbors.n === '.' || neighbors.n === '^') {
      nextSteps.push([0, -1]);
    }
    if (neighbors.e === '.' || neighbors.e === '>') {
      nextSteps.push([1, 0]);
    }
    if (neighbors.s === '.' || neighbors.s === 'v') {
      nextSteps.push([0, 1]);
    }
    if (neighbors.w === '.' || neighbors.w === '<') {
      nextSteps.push([-1, 0]);
    }
    let junctionEndCounter = 0;
    if (neighbors.n === 'v') {
      junctionEndCounter++;
    }
    if (neighbors.e === '<') {
      junctionEndCounter++;
    }
    if (neighbors.s === '^') {
      junctionEndCounter++;
    }
    if (neighbors.w === '>') {
      junctionEndCounter++;
    }
    nextSteps = nextSteps.filter(
      ([dx, dy]) => dx !== -1 * ox || dy !== -1 * oy,
    );
    if (nextSteps.length > 1) {
      //junction
      const ownNode = {
        from: start,
        to: {
          x,
          y,
        },
        steps,
      };
      return [
        ownNode,
        ...nextSteps.flatMap(([ox, oy]) => {
          return traverseGrid(grid, { x: x, y: y }, { x: ox, y: oy });
        }),
      ];
    }
    if (nextSteps.length === 0) {
      throw new Error(`no path at ${x} ${y}???`);
    }
    if (junctionEndCounter > 1) {
      const ownNode = {
        from: start,
        to: {
          x,
          y,
        },
        steps,
      };
      return [
        ownNode,
        ...traverseGrid(
          grid,
          { x, y },
          { x: nextSteps[0][0], y: nextSteps[0][1] },
        ),
      ];
    }
    ox = nextSteps[0][0];
    oy = nextSteps[0][1];
    x += ox;
    y += oy;
  }
}

function filterNodes(nodes: Node[]): Node[] {
  return nodes.filter(
    (n, i) =>
      nodes.findIndex(
        (n2) =>
          n2.from.x === n.from.x &&
          n2.from.y === n.from.y &&
          n2.to.x === n.to.x &&
          n2.to.y === n.to.y &&
          n2.steps === n.steps,
      ) === i,
  );
}

export function part1(input: string) {
  const grid = transpose(parseGrid(input));
  let nodes = traverseGrid(grid, { x: 1, y: 0 }, { x: 0, y: 1 });
  nodes = filterNodes(nodes);
  const junctions = nodesToJunctions(nodes, {
    x: grid.length - 2,
    y: grid[0].length - 1,
  });
  return getLongestPathJunctions(
    Object.values(junctions).find((j) => j.type === 'start')!,
    junctions,
    new Array(Object.keys(junctions).length + 1).fill(false),
  );
}

type Junction = {
  id: number;
  x: number;
  y: number;
  type: 'start' | 'end' | 'normal';
  next: { id: number; steps: number }[];
};

type Junctions = { [id: number]: Junction };

function nodesToJunctions(
  nodes: Node[],
  end: { x: number; y: number },
  backPath: boolean = false,
): Junctions {
  const junctionArray: Junction[] = [];
  const junctions: Junctions = {};
  let id = 0;
  for (let node of nodes) {
    let type: Junction['type'] = 'normal';
    if (node.from.x === 1 && node.from.y === 0) {
      type = 'start';
    }
    if (node.to.x === end.x && node.to.y === end.y) {
      type = 'end';
    }

    if (!junctionArray.some((j) => j.x == node.from.x && j.y === node.from.y)) {
      const junction: Junction = {
        id: ++id,
        x: node.from.x,
        y: node.from.y,
        next: [],
        type: type === 'start' ? 'start' : 'normal',
      };
      junctionArray.push(junction);
      junctions[junction.id] = junction;
    }
    if (!junctionArray.some((j) => j.x == node.to.x && j.y === node.to.y)) {
      const junction: Junction = {
        id: ++id,
        x: node.to.x,
        y: node.to.y,
        next: [],
        type: type === 'end' ? 'end' : 'normal',
      };
      junctionArray.push(junction);
      junctions[junction.id] = junction;
    }
    const sourceJunction = junctionArray.find(
      (j) => j.x === node.from.x && j.y === node.from.y,
    );
    const targetJunction = junctionArray.find(
      (j) => j.x === node.to.x && j.y === node.to.y,
    );
    assertNotNull(sourceJunction);
    assertNotNull(targetJunction);
    if (sourceJunction.type !== 'end') {
      sourceJunction.next.push({ id: targetJunction.id, steps: node.steps });
    }
    if (
      backPath &&
      sourceJunction.type !== 'start' &&
      targetJunction.type !== 'end'
    ) {
      targetJunction.next.push({ id: sourceJunction.id, steps: node.steps });
    }
  }
  return junctions;
}

function getLongestPathJunctions(
  junction: Junction,
  junctions: Junctions,
  visitedJunctions: boolean[],
): number {
  if (junction.type === 'end') {
    return 0;
  }
  const next = junction.next.filter((n) => visitedJunctions[n.id] !== true);
  if (next.length === 0) {
    return Number.MIN_SAFE_INTEGER;
  }
  visitedJunctions = visitedJunctions.slice(0);
  visitedJunctions[junction.id] = true;
  const steps = Math.max(
    ...next.map(
      (n) =>
        n.steps +
        getLongestPathJunctions(junctions[n.id], junctions, visitedJunctions),
    ),
  );

  return steps;
}

export function part2(input: string) {
  const grid = transpose(parseGrid(input));
  let nodes = traverseGrid(grid, { x: 1, y: 0 }, { x: 0, y: 1 });
  nodes = filterNodes(nodes);
  const junctions = nodesToJunctions(
    nodes,
    {
      x: grid.length - 2,
      y: grid[0].length - 1,
    },
    true,
  );
  return getLongestPathJunctions(
    Object.values(junctions).find((j) => j.type === 'start')!,
    junctions,
    new Array(Object.keys(junctions).length + 1).fill(false),
  );
}
