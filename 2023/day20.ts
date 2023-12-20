import { assertNotNull, getLines, lcm } from './utils';

type NodeState = 0 | 1;

type Node = {
  name: string;
  destinations: string[];
  state: NodeState;
} & (
  | {
      type: 'broadcast';
    }
  | {
      type: 'flipflop';
    }
  | {
      type: 'not';
    }
  | {
      type: 'conjunction';
      inputState: { [key: string]: NodeState };
    }
);

type Nodes = { [name: string]: Node };

function parseNode(input: string): Node {
  const regex = /([&%]?\w+) -> ([\w, ]+)/;
  const result = regex.exec(input);
  assertNotNull(result);
  const nodeName = result[1];
  const destinations = result[2].split(', ');
  if (nodeName === 'broadcaster') {
    return {
      destinations,
      name: 'broadcaster',
      state: 0,
      type: 'broadcast',
    };
  } else if (nodeName.startsWith('%')) {
    return {
      destinations,
      name: nodeName.slice(1),
      state: 0,
      type: 'flipflop',
    };
  } else if (nodeName.startsWith('&')) {
    return {
      destinations,
      name: nodeName.slice(1),
      state: 0,
      type: 'conjunction',
      inputState: {},
    };
  }
  throw new Error('unexpected node type');
}

function parseNodes(input: string): Nodes {
  const nodes = getLines(input).map(parseNode);
  const result: Nodes = {};
  nodes.forEach((n) => {
    result[n.name] = n;
    if (n.type === 'conjunction') {
      const sourceNodes = nodes.filter((s) => s.destinations.includes(n.name));
      if (sourceNodes.length === 1) {
        result[n.name] = {
          ...n,
          type: 'not',
        };
      }
      sourceNodes.forEach((s) => (n.inputState[s.name] = 0));
    }
  });
  return result;
}

function emitSignal(
  nodes: Nodes,
  queuedEmits: { node: string; signal: NodeState; source: string }[],
): { low: number; high: number; rx: boolean; conj: string } {
  let countLow = 0;
  let countHigh = 0;
  let conj = '';
  while (true) {
    if (queuedEmits.length === 0) {
      return {
        low: countLow,
        high: countHigh,
        rx: false,
        conj,
      };
    }
    const signal = queuedEmits.shift()!;
    //console.log(queuedEmits);
    //console.log(signal.source, '-> ', signal.signal, ' -> ', signal.node);
    const node = nodes[signal.node];
    if (node !== undefined) {
      if (node.type === 'broadcast') {
        node.state = signal.signal;
        queuedEmits.push(
          ...node.destinations.map((d) => ({
            node: d,
            signal: signal.signal,
            source: node.name,
          })),
        );
      } else if (node.type === 'flipflop') {
        if (signal.signal === 0) {
          node.state = node.state === 1 ? 0 : 1;
          queuedEmits.push(
            ...node.destinations.map((d) => ({
              node: d,
              signal: node.state,
              source: node.name,
            })),
          );
        }
      } else if (node.type === 'not') {
        node.state = signal.signal === 0 ? 1 : 0;
        queuedEmits.push({
          node: node.destinations[0],
          signal: node.state,
          source: node.name,
        });
      } else {
        node.inputState[signal.source] = signal.signal;
        const newSignal: NodeState = Object.values(node.inputState).every(
          (v) => v === 1,
        )
          ? 0
          : 1;
        if (newSignal === 0) {
          conj = node.name;
        }
        node.state = newSignal;
        queuedEmits.push(
          ...node.destinations.map((d) => ({
            node: d,
            signal: newSignal,
            source: node.name,
          })),
        );
      }
    }
    if (signal.signal === 0) {
      countLow += 1;
    } else {
      countHigh += 1;
    }
  }
}

export function part1(input: string) {
  const nodes = parseNodes(input);
  let sumHigh = 0;
  let sumLow = 0;
  for (let i = 0; i < 1000; i++) {
    const { high, low } = emitSignal(nodes, [
      { node: 'broadcaster', signal: 0, source: 'button' },
    ]);
    sumHigh += high;
    sumLow += low;
  }
  return sumHigh * sumLow;
}

const trackedNodes: {
  [node: string]: {
    currentValue: NodeState;
    lastChangeInterval: [number, number];
    lastChangeAt: number;
  };
} = {};

function trackState(nodes: Nodes, count: number): void {
  Object.keys(nodes).forEach((n) => {
    if (trackedNodes[n] === undefined) {
      trackedNodes[n] = {
        currentValue: 0,
        lastChangeInterval: [0, 0],
        lastChangeAt: 0,
      };
    }
    if (trackedNodes[n].currentValue !== nodes[n].state) {
      trackedNodes[n].lastChangeInterval[nodes[n].state] =
        count - trackedNodes[n].lastChangeAt;
      trackedNodes[n].lastChangeAt = count;
      trackedNodes[n].currentValue = nodes[n].state;
    }
  });
  if (count % 100_000 == 0) {
    console.log('');
    console.log(
      Object.entries(trackedNodes)
        .filter(
          ([_, v]) =>
            v.lastChangeInterval[0] > 0 || v.lastChangeInterval[1] > 0,
        )
        .map(([n, v]) => `${n}: ${v.lastChangeInterval.join(' | ')}`)
        .join('\r\n'),
    );
  }
}

function printGraphViz(nodes: Nodes): void {
  let output = '';
  for (let nodeName in nodes) {
    const node = nodes[nodeName];
    output += `\r\n${nodeName}[style=filled,fillcolor=${
      node.type === 'flipflop'
        ? 'green'
        : node.type === 'conjunction' && node.destinations.length === 1
          ? 'red'
          : 'lightblue'
    }]`;
    node.destinations.forEach((d) => (output += `\r\n${nodeName} -> ${d}`));
  }
  console.log(output);
}

function detectCycle(nodes: Nodes, startNode: string): void {
  let count = 0;
  while (true) {
    count++;
    emitSignal(nodes, [{ node: startNode, signal: 0, source: 'broadcaster' }]);
    trackState(nodes, count);
  }
}

export function part2(input: string) {
  const nodes = parseNodes(input);
  let count = 0;
  let interval: { [node: string]: number } = {};
  let takenNodes = [];
  //printGraphViz(nodes);
  while (true) {
    count++;
    const { conj } = emitSignal(nodes, [
      { node: 'broadcaster', signal: 0, source: 'button' },
    ]);
    if (conj !== '' && interval[conj] === undefined) {
      console.log('Conjunction', conj, count);
      interval[conj] = count;
      if (
        Object.values(nodes).filter((n) => n.type === 'conjunction').length ===
        Object.keys(interval).length + 1
      ) {
        //we found all conjunctions;
        break;
      }
    }
  }

  return lcm(...Object.values(interval));
}
