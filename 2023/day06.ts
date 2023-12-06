import { getLines, product } from './utils';

interface Race {
  time: number;
  record: number;
}

function parseRaces(input: string): Race[] {
  const [timeLine, recordLine] = getLines(input);
  const times = timeLine
    .replace('Time:', '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((n) => parseInt(n, 10));
  const records = recordLine
    .replace('Distance:', '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((n) => parseInt(n, 10));
  return times.map((t, i) => ({
    time: t,
    record: records[i],
  }));
}

function parseRace(input: string): Race {
  const [timeLine, recordLine] = getLines(input);
  const time = parseInt(
    timeLine.replace('Time:', '').replace(/\s+/g, '').trim(),
    10,
  );

  const record = parseInt(
    recordLine.replace('Distance:', '').replace(/\s+/g, '').trim(),
    10,
  );
  return {
    time,
    record,
  };
}

function canBeatRecord(race: Race): number {
  let countBeat = 0;
  for (let t = 0; t < race.time; t++) {
    const distance = t * (race.time - t);
    if (distance > race.record) {
      countBeat++;
    }
  }
  return countBeat;
}

export function part1(input: string) {
  const races = parseRaces(input);
  return product(races.map((r) => canBeatRecord(r)));
}

function canBeatOptimized(race: Race): number {
  let min = 0;
  let max = race.time;
  while (Math.abs(min - max) > 1) {
    let element = min + Math.floor((max - min) / 2);
    const canBeat = element * (race.time - element) > race.record;
    if (canBeat == true) {
      max = element;
    } else {
      min = element;
    }
  }
  return race.time - 2 * min - 1;
}

export function part2(input: string) {
  const race = parseRace(input);
  return canBeatOptimized(race);
}
