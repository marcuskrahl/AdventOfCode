import { assertNotNull, getLines, sum } from './utils';

type OperationDefinition =
  | {
      operator: '<' | '>';
      prop: keyof Part;
      amount: number;
      destination: string;
    }
  | string;
interface Workflow {
  name: string;
  operations: ((part: Part) => string | undefined)[];
  operationDefinitions: OperationDefinition[];
}

type Workflows = { [name: string]: Workflow };

interface Part {
  x: number;
  m: number;
  a: number;
  s: number;
}

function parseOperation(operationString: string): {
  operationFunction: (part: Part) => string | undefined;
  operationDefinition: OperationDefinition;
} {
  const operationRegex = /([xmas])([<>])(\d+):(\w+)/;
  if (operationString.includes('<')) {
    const result = operationRegex.exec(operationString);
    assertNotNull(result);
    const prop = result[1] as keyof Part;
    const amount = parseInt(result[3], 10);
    const destination = result[4];
    return {
      operationFunction: (part: Part) =>
        part[prop] < amount ? destination : undefined,
      operationDefinition: {
        operator: '<',
        prop,
        amount,
        destination,
      },
    };
  } else if (operationString.includes('>')) {
    const result = operationRegex.exec(operationString);
    assertNotNull(result);
    const prop = result[1] as keyof Part;
    const amount = parseInt(result[3], 10);
    const destination = result[4];
    return {
      operationFunction: (part: Part) =>
        part[prop] > amount ? destination : undefined,
      operationDefinition: {
        operator: '>',
        prop,
        amount,
        destination,
      },
    };
  } else {
    return {
      operationFunction: () => operationString,
      operationDefinition: operationString,
    };
  }
}

function parseWorkflows(workflowLines: string[]): Workflows {
  const workflows: Workflows = {};
  for (let line of workflowLines) {
    const outerRegex = /^(\w+)\{(.*)\}$/.exec(line);
    assertNotNull(outerRegex);
    const name = outerRegex[1];
    const inner = outerRegex[2];
    const operations = inner.split(',').map(parseOperation);
    workflows[name] = {
      name,
      operations: operations.map((o) => o.operationFunction),
      operationDefinitions: operations.map((o) => o.operationDefinition),
    };
  }
  return workflows;
}

function parsePart(part: string): Part {
  const regex = /^\{x=(\d+),m=(\d+),a=(\d+),s=(\d+)\}/;
  const result = regex.exec(part);
  assertNotNull(result);
  return {
    x: parseInt(result[1], 10),
    m: parseInt(result[2], 10),
    a: parseInt(result[3], 10),
    s: parseInt(result[4], 10),
  };
}

function parseInput(input: string): { workflows: Workflows; parts: Part[] } {
  const lines = getLines(input);
  const emptyLineIndex = lines.indexOf('');
  const workflowLines = lines.slice(0, emptyLineIndex);
  const partLines = lines.slice(emptyLineIndex + 1);
  const workflows = parseWorkflows(workflowLines);
  const parts = partLines.map(parsePart);
  return {
    workflows,
    parts,
  };
}

function isAccepted(part: Part, workflows: Workflows): boolean {
  let currentWorkflow = 'in';
  do {
    const workflow = workflows[currentWorkflow];
    const result = workflow.operations.reduce(
      (acc: string | undefined, o) => acc ?? o(part),
      undefined,
    );
    assertNotNull(result);
    currentWorkflow = result;
  } while (currentWorkflow !== 'A' && currentWorkflow !== 'R');
  return currentWorkflow === 'A';
}

export function part1(input: string) {
  const { workflows, parts } = parseInput(input);
  return sum(
    parts
      .filter((p) => isAccepted(p, workflows))
      .map((p) => p.x + p.m + p.a + p.s),
  );
}

type PartRange = {
  min: Part;
  max: Part;
};

function findSimpleNode(workflows: Workflow[]): Workflow | undefined {
  return workflows.find((w) =>
    w.operationDefinitions.every(
      (o) =>
        o === 'A' ||
        o === 'R' ||
        (typeof o === 'object' &&
          (o.destination === 'R' || o.destination === 'A')),
    ),
  );
}

function simplifyNode(node: Workflow): void {
  if (
    node.operationDefinitions.every(
      (o) => o === 'R' || (typeof o === 'object' && o.destination === 'R'),
    )
  ) {
    node.operationDefinitions = ['R'];
    return;
  }
  if (
    node.operationDefinitions.every(
      (o) => o === 'A' || (typeof o === 'object' && o.destination === 'A'),
    )
  ) {
    node.operationDefinitions = ['A'];
    return;
  }
  const min = {
    x: 1,
    m: 1,
    a: 1,
    s: 1,
  };
  const max = {
    x: 4000,
    m: 4000,
    a: 4000,
    s: 4000,
  };
  for (let i = 0; i < node.operationDefinitions.length; i++) {
    const op = node.operationDefinitions[i];
    if (typeof op === 'string') {
      //remove operations not being executed
      node.operationDefinitions.splice(
        i + 1,
        node.operationDefinitions.length - i - 1,
      );
      break;
    }
    if (typeof op !== 'object') {
      throw new Error('we are only working with objects here');
    }
    if (op.operator === '>' && op.amount > max[op.prop]) {
      node.operationDefinitions.splice(
        i,
        node.operationDefinitions.length - i,
        'R',
      );
      break;
    }
    if (op.operator === '<' && op.amount < min[op.prop]) {
      node.operationDefinitions.splice(
        i,
        node.operationDefinitions.length - i,
        'R',
      );
      break;
    }
    if (op.operator === '>' && op.amount < max[op.prop]) {
      max[op.prop] = op.amount;
    }
    if (op.operator === '<' && op.amount > min[op.prop]) {
      min[op.prop] = op.amount;
    }
  }
}
function updateWorkflows(node: Workflow, workflows: Workflow[]): void {
  for (let workflow of workflows) {
    for (let i = 0; i < workflow.operationDefinitions.length; i++) {
      const op = workflow.operationDefinitions[i];
      if (op === node.name) {
        workflow.operationDefinitions.splice(
          i,
          1,
          ...node.operationDefinitions,
        );
        i += node.operationDefinitions.length - 1;
      }
      if (
        typeof op === 'object' &&
        op.destination === node.name &&
        node.operationDefinitions.length === 1 &&
        (node.operationDefinitions[0] === 'A' ||
          node.operationDefinitions[0] === 'R')
      ) {
        workflow.operationDefinitions[i] = node.operationDefinitions[0];
      }
    }
    simplifyNode(workflow);
  }
}

function reduceWorkflows(workflows: Workflows) {
  const visitedWorkflow: string[] = [];
  const workflowArray = Object.values(workflows);
  do {
    const simpleNode = findSimpleNode(
      workflowArray.filter((w) => !visitedWorkflow.includes(w.name)),
    );
    if (simpleNode === undefined) {
      break;
    }
    //console.log('visiting ', simpleNode.name);
    simplifyNode(simpleNode);
    updateWorkflows(simpleNode, workflowArray);
    visitedWorkflow.push(simpleNode.name);
  } while (true);
  /*console.log(
    workflowArray.map(
      (w) =>
        `${w.name} ${w.operationDefinitions.map(
          (o) => `${JSON.stringify(o)}`,
        )}`,
    ),
  );*/
}

function shortenRange(range: PartRange, limit: PartRange): PartRange {
  return {
    min: {
      x: Math.max(range.min.x, limit.min.x),
      m: Math.max(range.min.m, limit.min.m),
      a: Math.max(range.min.a, limit.min.a),
      s: Math.max(range.min.s, limit.min.s),
    },
    max: {
      x: Math.min(range.max.x, limit.max.x),
      m: Math.min(range.max.m, limit.max.m),
      a: Math.min(range.max.a, limit.max.a),
      s: Math.min(range.max.s, limit.max.s),
    },
  };
}

function getDestinationRanges(
  destination: string,
  workflows: Workflows,
  currentLimit: PartRange,
): PartRange[] {
  const nestedRanges = getPossibleParts(workflows[destination], workflows);
  return nestedRanges.map((n) => shortenRange(n, currentLimit));
}

function applyLimit(
  currentLimit: PartRange,
  prop: keyof Part,
  operator: '<' | '>',
  amount: number,
): PartRange {
  let newLimit = {
    min: { ...currentLimit.min },
    max: { ...currentLimit.max },
  };
  if (operator === '<') {
    newLimit.max[prop] = Math.min(amount, newLimit.max[prop]);
  }
  if (operator === '>') {
    newLimit.min[prop] = Math.max(amount, newLimit.min[prop]);
  }
  return newLimit;
}

function getPossibleParts(
  workflow: Workflow,
  workflows: Workflows,
): PartRange[] {
  let currentLimit = {
    min: {
      x: 1,
      m: 1,
      a: 1,
      s: 1,
    },
    max: {
      x: 4000,
      m: 4000,
      a: 4000,
      s: 4000,
    },
  };
  const ranges: PartRange[] = [];
  for (let operation of workflow.operationDefinitions) {
    if (typeof operation === 'string') {
      if (operation === 'A') {
        return [...ranges, currentLimit];
      } else if (operation === 'R') {
        return ranges;
      } else {
        return [
          ...ranges,
          ...getDestinationRanges(operation, workflows, currentLimit),
        ];
      }
    } else if (typeof operation === 'object') {
      const destination = operation.destination;
      const ownLimit = applyLimit(
        currentLimit,
        operation.prop,
        operation.operator,
        operation.amount + (operation.operator === '<' ? -1 : 1),
      );
      currentLimit = applyLimit(
        currentLimit,
        operation.prop,
        operation.operator === '<' ? '>' : '<',
        operation.amount,
      );
      if (destination === 'A') {
        ranges.push(ownLimit);
      } else if (destination === 'R') {
        //nothing
      } else {
        ranges.push(...getDestinationRanges(destination, workflows, ownLimit));
      }
    }
  }
  return ranges;
}

function getPossibilities(parts: PartRange[]): number {
  return sum(
    parts.map(
      (p) =>
        (p.max.x - p.min.x + 1) *
        (p.max.m - p.min.m + 1) *
        (p.max.a - p.min.a + 1) *
        (p.max.s - p.min.s + 1),
    ),
  );
}

export function part2(input: string) {
  const { workflows } = parseInput(input);
  const parts = getPossibleParts(workflows['in'], workflows);
  reduceWorkflows(workflows);
  return getPossibilities(parts);
}
