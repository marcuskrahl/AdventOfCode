import { getLines, min } from './utils';

interface Mapping {
  name: string;
  destinationStart: number;
  sourceStart: number;
  amount: number;
}

function parseInput(input: string): { seeds: number[]; mappings: Mapping[][] } {
  const lines = getLines(input);
  const mappings = [];
  const seeds = lines[0]
    .replace('seeds: ', '')
    .split(' ')
    .map((s) => parseInt(s, 10));

  let currentMapping = [];
  let mappingName = '';
  for (let line of lines.slice(2)) {
    if (line.trim() === '') {
      mappings.push(currentMapping);
      mappingName = '';
      currentMapping = [];
      continue;
    }
    if (line.includes('map')) {
      mappingName = line;
      continue;
    }
    const [destinationStart, sourceStart, amount] = line
      .split(' ')
      .map((s) => parseInt(s, 10));
    currentMapping.push({
      name: mappingName,
      destinationStart,
      sourceStart,
      amount,
    });
  }
  mappings.push(currentMapping);
  return {
    seeds,
    mappings,
  };
}

function applyMapping(seed: number, mappings: Mapping[]): number {
  const mapping = mappings.find(
    (m) => m.sourceStart <= seed && m.sourceStart + m.amount >= seed,
  );
  if (mapping == undefined) {
    return seed;
  }
  return mapping.destinationStart + (seed - mapping.sourceStart);
}

function applyMappings(seed: number, mappings: Mapping[][]): number {
  return mappings.reduce((acc, mapping) => applyMapping(acc, mapping), seed);
}

export function part1(input: string) {
  const { seeds, mappings } = parseInput(input);
  const mappedSeed = seeds.map((s) => applyMappings(s, mappings));
  return min(mappedSeed, (s) => s).toString();
}

interface ExpandedMapping {
  sourceStart: number;
  destinationStart: number;
  amount: number;
}

function expandMapping(
  expandedMapping: ExpandedMapping,
  mapping: Mapping[],
): ExpandedMapping[] {
  const possibleMapping = mapping.find(
    (m) =>
      m.sourceStart <= expandedMapping.destinationStart &&
      m.sourceStart + m.amount > expandedMapping.destinationStart,
  );
  if (possibleMapping != undefined) {
    //console.log('found mapping', possibleMapping);
    //console.log('for', expandedMapping);
    //found mapping for start of range
    //we can map everything in this range up to the end of the found mapping
    const calculatedOffset =
      possibleMapping.sourceStart +
      possibleMapping.amount -
      expandedMapping.destinationStart;

    //console.log('calculated offset', calculatedOffset);
    const mapableAmount = Math.min(calculatedOffset, expandedMapping.amount);
    if (mapableAmount == expandedMapping.amount) {
      //we totally fit into target mapping -> return it as is
      return [
        {
          ...expandedMapping,
          destinationStart:
            expandedMapping.destinationStart -
            possibleMapping.sourceStart +
            possibleMapping.destinationStart,
        },
      ];
    } else {
      //console.log('does not fit - rest: ', mapableAmount);
      const ownMapping = {
        ...expandedMapping,
        destinationStart:
          expandedMapping.destinationStart -
          possibleMapping.sourceStart +
          possibleMapping.destinationStart,
        amount: mapableAmount,
      };
      const restMapping = {
        ...expandedMapping,
        sourceStart: expandedMapping.sourceStart + mapableAmount,
        destinationStart: expandedMapping.destinationStart + mapableAmount,
        amount: expandedMapping.amount - mapableAmount,
      };
      return [ownMapping, ...expandMapping(restMapping, mapping)];
    }
  } else {
    //console.log('before');
    //start is not in any range -> map as is until we find a possible start
    const minStart = min(mapping, (m) => m.sourceStart).sourceStart;
    if (expandedMapping.sourceStart + expandedMapping.amount <= minStart) {
      return [expandedMapping];
    }
    if (expandedMapping.sourceStart < minStart) {
      //we are before, split up to first mapping
      const mapableAmount = minStart - expandedMapping.sourceStart;
      const ownMapping = {
        ...expandedMapping,
        amount: mapableAmount,
      };
      const restMapping = {
        ...expandedMapping,
        sourceStart: expandedMapping.sourceStart + mapableAmount,
        destinationStart: expandedMapping.sourceStart + mapableAmount,
        amount: expandedMapping.amount - mapableAmount,
      };
      return [ownMapping, ...expandMapping(restMapping, mapping)];
    }
    //console.log('after range');
    //we are after every range -> return as is
    return [expandedMapping];
  }
}

export function part2(input: string) {
  const { seeds, mappings } = parseInput(input);

  let startMappings = [];
  for (let i = 0; i < seeds.length; i += 2) {
    startMappings.push({
      sourceStart: seeds[i],
      amount: seeds[i + 1],
      destinationStart: seeds[i],
    });
  }
  for (let m of mappings) {
    //console.log(m[0].name);
    startMappings = startMappings.flatMap((s) => expandMapping(s, m));
    //console.log(startMappings);
  }
  return min(
    startMappings,
    (m) => m.destinationStart,
  ).destinationStart.toString();
}
