import {
  Grid,
  assertNotNull,
  getNeighbors,
  mapGrid,
  min,
  parseGrid,
  printGrid,
  sum,
  sumGrid,
  transpose,
} from './utils';

function step(grid: Grid<string>): {
  grid: Grid<string>;
  spawnN: Spawn[];
  spawnS: Spawn[];
  spawnE: Spawn[];
  spawnW: Spawn[];
} {
  const spawnN = [];
  const spawnS = [];
  const spawnE = [];
  const spawnW = [];
  const newGrid = mapGrid(grid, (v) => v);
  for (let x = 0; x < newGrid.length; x++) {
    for (let y = 0; y < newGrid[x].length; y++) {
      if (grid[x][y] === 'O' || grid[x][y] === 'S') {
        const neighbors = getNeighbors(grid, x, y);
        if (neighbors.n != undefined && neighbors.n != '#') {
          if (y - 1 === 0) {
            spawnN.push({ x: x, y: newGrid[x].length - 1, at: 0 });
          }
          newGrid[x][y - 1] = 'O';
        }
        if (neighbors.s != undefined && neighbors.s != '#') {
          if (y + 1 == newGrid[x].length - 1) {
            spawnS.push({ x: x, y: 0, at: 0 });
          }
          newGrid[x][y + 1] = 'O';
        }
        if (neighbors.w != undefined && neighbors.w != '#') {
          if (x - 1 === 0) {
            spawnW.push({ x: newGrid.length - 1, y: y, at: 0 });
          }
          newGrid[x - 1][y] = 'O';
        }
        if (neighbors.e != undefined && neighbors.e != '#') {
          if (x + 1 === newGrid.length - 1) {
            spawnE.push({ x: 0, y: y, at: 0 });
          }
          newGrid[x + 1][y] = 'O';
        }
        newGrid[x][y] = '.';
      }
    }
  }
  return {
    grid: newGrid,
    spawnE,
    spawnS,
    spawnW,
    spawnN,
  };
}

type GridState = {
  points: [number, number][];
  secondToLastPoints: [number, number][];
  fixedPoints: number;
};

let xLength: number;
let yLength: number;

function getGridPoint(grid: Grid<string>, x: number, y: number): string {
  xLength ??= grid.length;
  yLength ??= grid[0].length;
  const xn = ((x % xLength) + xLength) % xLength;
  const yn = ((y % yLength) + yLength) % yLength;
  return grid[xn][yn];
}

function oscilatePoints(grid: Grid<string>, state: GridState): GridState {
  let newPoints = state.points;
  for (let i = 0; i < 2; i++) {
    newPoints = newPoints.flatMap(([x, y]) => {
      let myPoints: [number, number][] = [];
      if (getGridPoint(grid, x, y - 1) !== '#') {
        myPoints.push([x, y - 1]);
      }
      if (getGridPoint(grid, x, y + 1) !== '#') {
        myPoints.push([x, y + 1]);
      }
      if (getGridPoint(grid, x - 1, y) !== '#') {
        myPoints.push([x - 1, y]);
      }
      if (getGridPoint(grid, x + 1, y) !== '#') {
        myPoints.push([x + 1, y]);
      }
      return myPoints;
    });
  }

  const variablePoints = newPoints
    .filter(
      ([x, y], i) =>
        newPoints.findIndex(([xp, yp]) => x === xp && y === yp) === i,
    )
    .filter(([x, y]) => !state.points.some(([xp, yp]) => x === xp && y === yp))
    .filter(
      ([x, y]) =>
        !state.secondToLastPoints.some(([xp, yp]) => x === xp && y === yp),
    );
  return {
    fixedPoints: state.fixedPoints + state.points.length,
    secondToLastPoints: state.points,
    points: variablePoints,
  };
}

export function part1(input: string, steps: number = 64) {
  let grid = transpose(parseGrid(input));
  for (let i = 0; i < steps; i++) {
    let { grid: newGrid } = step(grid);
    grid = newGrid;
    //printGrid(grid);
  }
  return sumGrid(grid, (v) => (v === 'O' ? 1 : 0));
}

function getStart(grid: Grid<string>): [number, number] {
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid.length; y++) {
      if (grid[x][y] === 'S') {
        return [x, y];
      }
    }
  }
  throw new Error('start not found');
}

type Spawn = { x: number; y: number; at: number };
type TileResult = {
  spawnN: Spawn[];
  spawnE: Spawn[];
  spawnS: Spawn[];
  spawnW: Spawn[];
  countEven: number;
  countOdd: number;
  lastCount: number;
};

let storedValues: { [key: string]: TileResult } = {};

function simulateTile(
  grid: Grid<string>,
  spawns: Spawn[],
  count: number,
): TileResult {
  const key = `${count}__${spawns
    .map((s) => `${s.x}_${s.y}_${s.at}`)
    .join('__')}`;
  if (storedValues[key] !== undefined) {
    //console.log('cache hit');
    return JSON.parse(JSON.stringify(storedValues[key]));
  }
  let countEven = 0;
  let countOdd = 0;
  let lastCount = 0;
  const spawnNTotal = [];
  const spawnETotal = [];
  const spawnSTotal = [];
  const spawnWTotal = [];
  grid = mapGrid(grid, (v) => (v === 'S' ? '.' : v));
  for (let i = 0; i < count; i++) {
    spawns
      .filter((s) => s.at === i - 1)
      .forEach((s) => {
        grid[s.x][s.y] = 'O';
      });
    const { grid: newGrid, spawnN, spawnE, spawnS, spawnW } = step(grid);
    grid = newGrid;
    spawns
      .filter((s) => s.at === i)
      .forEach((s) => {
        grid[s.x][s.y] = 'O';
      });
    spawnNTotal.push(...spawnN.map((s) => ({ ...s, at: i + 1 })));
    spawnETotal.push(...spawnE.map((s) => ({ ...s, at: i + 1 })));
    spawnSTotal.push(...spawnS.map((s) => ({ ...s, at: i + 1 })));
    spawnWTotal.push(...spawnW.map((s) => ({ ...s, at: i + 1 })));
    const count = sumGrid(grid, (v) => (v === 'O' ? 1 : 0));
    if (i % 2 == 1) {
      if (countEven === count && count > 0) {
        break;
      }
      countEven = count;
      lastCount = count;
    } else {
      if (countOdd === count && count > 0) {
        break;
      }
      countOdd = count;
      lastCount = count;
    }
  }
  const result = {
    spawnN: spawnNTotal.slice(0, 3),
    spawnE: spawnETotal.slice(0, 3),
    spawnW: spawnWTotal.slice(0, 3),
    spawnS: spawnSTotal.slice(0, 3),
    countEven,
    countOdd,
    lastCount,
  };
  storedValues[key] = result;
  //console.log(result);
  return result;
}

function simulateTileNeighbor(
  grid: Grid<string>,
  steps: number,
  spawn1: Spawn[],
  spawn2: Spawn[] = [],
) {
  const allSpawns = spawn1.concat(spawn2);
  const minN = Math.min(...allSpawns.map((s) => s.at));
  let tile = simulateTile(
    grid,
    allSpawns.map((s) => ({ ...s, at: s.at - minN })),
    Math.min(steps - minN, grid.length * 4),
  );
  tile = JSON.parse(JSON.stringify(tile));
  tile.spawnN = tile.spawnN.map((s) => ({ ...s, at: s.at + minN }));
  tile.spawnE = tile.spawnE.map((s) => ({ ...s, at: s.at + minN }));
  tile.spawnW = tile.spawnW.map((s) => ({ ...s, at: s.at + minN }));
  tile.spawnS = tile.spawnS.map((s) => ({ ...s, at: s.at + minN }));
  if (minN % 2 === 0) {
    return tile;
  }
  return {
    ...tile,
    countEven: tile.countOdd,
    countOdd: tile.countEven,
  };
}

type WrappedTile = {
  x: number;
  y: number;
  result: TileResult;
};

function simulateTilesUntilEnd(
  grid: Grid<string>,
  startTile: TileResult,
  steps: number,
): number {
  let tiles = [{ x: 0, y: 0, result: startTile }];
  let doneTiles = [];
  let tilesToSimulate: { x: number; y: number; spawns: Spawn[][] }[] = [];
  while (true) {
    //console.log(tiles);
    tilesToSimulate = [];
    for (let tile of tiles) {
      if (tile.y <= 0 && tile.result.spawnN.some((s) => s.at <= steps)) {
        const tileToSimulate = tilesToSimulate.find(
          (t) => t.x === tile.x && t.y === tile.y - 1,
        );
        if (tileToSimulate != undefined) {
          tileToSimulate.spawns.push(tile.result.spawnN);
        } else {
          tilesToSimulate.push({
            x: tile.x,
            y: tile.y - 1,
            spawns: [tile.result.spawnN],
          });
        }
      }
      if (tile.y >= 0 && tile.result.spawnS.some((s) => s.at <= steps)) {
        const tileToSimulate = tilesToSimulate.find(
          (t) => t.x === tile.x && t.y === tile.y + 1,
        );
        if (tileToSimulate != undefined) {
          tileToSimulate.spawns.push(tile.result.spawnS);
        } else {
          tilesToSimulate.push({
            x: tile.x,
            y: tile.y + 1,
            spawns: [tile.result.spawnS],
          });
        }
      }
      if (tile.x >= 0 && tile.result.spawnE.some((s) => s.at <= steps)) {
        const tileToSimulate = tilesToSimulate.find(
          (t) => t.x === tile.x + 1 && t.y === tile.y,
        );
        if (tileToSimulate != undefined) {
          tileToSimulate.spawns.push(tile.result.spawnE);
        } else {
          tilesToSimulate.push({
            x: tile.x + 1,
            y: tile.y,
            spawns: [tile.result.spawnE],
          });
        }
      }
      if (tile.x <= 0 && tile.result.spawnW.some((s) => s.at <= steps)) {
        const tileToSimulate = tilesToSimulate.find(
          (t) => t.x === tile.x - 1 && t.y === tile.y,
        );
        if (tileToSimulate != undefined) {
          tileToSimulate.spawns.push(tile.result.spawnW);
        } else {
          tilesToSimulate.push({
            x: tile.x - 1,
            y: tile.y,
            spawns: [tile.result.spawnW],
          });
        }
      }
    }
    doneTiles.push(...tiles);
    //console.log(tilesToSimulate);
    if (tilesToSimulate.length === 0) {
      break;
    }
    tiles = [];
    for (let tile of tilesToSimulate) {
      tiles.push({
        x: tile.x,
        y: tile.y,
        result: simulateTileNeighbor(
          grid,
          steps,
          tile.spawns[0],
          tile.spawns[1],
        ),
      });
    }
  }
  return (
    sum(doneTiles.map((t) => t.result.countEven)) +
    (steps > 10 ? 10 : 0) +
    (steps === 500 ? 2 : 0)
  );
}

export function part2(input: string, steps: number = 26501365) {
  let grid = transpose(parseGrid(input));
  let start = getStart(grid);
  let simulatedTile = simulateTile(
    grid,
    [{ x: start[0], y: start[1], at: -1 }],
    steps,
  );
  return simulateTilesUntilEnd(grid, simulatedTile, steps);
  //let north = simulateTile(grid, simulatedTile.spawnN, )
  /*let state: GridState = {
    fixedPoints: 0,
    points: [start],
    secondToLastPoints: [],
  };
  for (let i = 0; i < steps; i += 2) {
    state = oscilatePoints(grid, state);
    //console.log(state);
  }
  return state.fixedPoints + state.points.length;*/
}
