import { sum } from '@adventofcode2022/util';

type Point = {
  x: number;
  y: number;
};

type ScannedArea = {
  source: Point;
  radius: number;
  beacon: Point;
};

type RowSegment = {
  from: number;
  to: number;
};

function parseLine(line: string): ScannedArea {
  const [sensorString, beaconString] = line.split(':');
  const pointRegex = /x=(-?\d+), y=(-?\d+)/;
  const sensorResult = pointRegex.exec(sensorString);
  const beaconResult = pointRegex.exec(beaconString);
  if (sensorResult == null || beaconResult == null) {
    throw new Error('failed parsing line: ' + line);
  }
  const source = { x: parseInt(sensorResult[1]), y: parseInt(sensorResult[2]) };
  const beacon = { x: parseInt(beaconResult[1]), y: parseInt(beaconResult[2]) };
  const radius = Math.abs(source.x - beacon.x) + Math.abs(source.y - beacon.y);
  return {
    source,
    radius,
    beacon,
  };
}

function getRowSegments(
  scannedArea: ScannedArea,
  row: number
): RowSegment | undefined {
  const width = scannedArea.radius - Math.abs(scannedArea.source.y - row);
  if (width <= 0) {
    return undefined;
  }
  const from = scannedArea.source.x - width;
  const to = scannedArea.source.x + width;
  return {
    from,
    to,
  };
}

function mergeRowSegments(
  segment: RowSegment,
  allSegments: RowSegment[]
): RowSegment[] {
  const result = [];
  for (let existingSegment of allSegments) {
    if (segment.to < existingSegment.from) {
      //no overlap
      result.push(existingSegment);
    } else if (existingSegment.to < segment.from) {
      //no overlap
      result.push(existingSegment);
    } else if (
      existingSegment.from <= segment.to &&
      existingSegment.from >= segment.from &&
      existingSegment.to <= segment.to
    ) {
      //contained in other
    } else if (
      segment.from <= existingSegment.to &&
      segment.from >= existingSegment.from &&
      segment.to <= existingSegment.to
    ) {
      //contained in other
      return allSegments;
    } else {
      //overlap
      const newFrom =
        existingSegment.from <= segment.to && existingSegment.to > segment.to
          ? segment.to + 1
          : existingSegment.from;
      const newTo =
        existingSegment.to >= segment.from &&
        existingSegment.from < segment.from
          ? segment.from - 1
          : existingSegment.to;
      const newSegment = { from: newFrom, to: newTo };
      result.push(newSegment);
    }
  }
  result.push(segment);
  return result;
}

function countCells(
  rowSegments: RowSegment[],
  scannedAreas: ScannedArea[],
  row: number
): number {
  const segments = rowSegments.reduce(
    (acc: RowSegment[], curr) => mergeRowSegments(curr, acc),
    []
  );
  const segmentSum = sum(segments.map((s) => s.to - s.from + 1));
  const sensorsAndBeacons = scannedAreas
    .flatMap((a) => [
      ...(a.source.y === row ? [a.source] : []),
      ...(a.beacon.y === row ? [a.beacon] : []),
    ])
    .reduce(
      (acc: Point[], curr) =>
        acc.some((a) => a.x === curr.x && a.y === curr.y)
          ? [...acc]
          : [...acc, curr],
      []
    );

  return segmentSum - sensorsAndBeacons.length;
}

export function part1(lines: string[]): number {
  const row = lines[0].startsWith('Sensor at x=2,') ? 10 : 2_000_000;
  const scannedAreas = lines.map((l) => parseLine(l));
  const rowSegments = scannedAreas.flatMap(
    (area) => getRowSegments(area, row) ?? []
  );
  const cells = countCells(rowSegments, scannedAreas, row);
  return cells;
}

function getDistressBeacon(rowSegments: RowSegment[]): number | undefined {
  for (const segment of rowSegments) {
    const otherSegment = rowSegments.find((r) => r.from === segment.to + 2);
    if (otherSegment != undefined) {
      const candidateGap = segment.to + 1;
      if (
        !rowSegments.some((s) => s.from <= candidateGap && s.to >= candidateGap)
      ) {
        return candidateGap;
      }
    }
  }
  return undefined;
}

export function part2(lines: string[]): number {
  const bound = lines[0].startsWith('Sensor at x=2,') ? 20 : 4_000_000;
  const scannedAreas = lines.map((l) => parseLine(l));
  for (let y = 0; y <= bound; y++) {
    if (y % 10_0000 === 0) {
      console.log((100 * y) / bound + '%');
    }
    const rowSegments = scannedAreas.flatMap(
      (area) => getRowSegments(area, y) ?? []
    );
    const distressX = getDistressBeacon(rowSegments);
    if (distressX != null) {
      return distressX * 4_000_000 + y;
    }
    //const cells = countCells(rowSegments, scannedAreas, row);
  }
  throw new Error('beacon not found');
}
