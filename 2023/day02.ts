import { assertNotNull, getLines, sum } from './utils';

interface Turn {
  red: number;
  green: number;
  blue: number;
}
interface Game {
  id: number;
  turns: Turn[];
}

function parseTurn(turn: string) {
  const redMatch = turn.match(/(\d+) red/);
  const red = redMatch != undefined ? Number.parseInt(redMatch[1], 10) : 0;
  const greenMatch = turn.match(/(\d+) green/);
  const green =
    greenMatch != undefined ? Number.parseInt(greenMatch[1], 10) : 0;
  const blueMatch = turn.match(/(\d+) blue/);
  const blue = blueMatch != undefined ? Number.parseInt(blueMatch[1], 10) : 0;
  return {
    red,
    green,
    blue,
  };
}

function parseGame(line: string): Game {
  const [gameString, turnsString] = line.split(':');
  const gameMatch = gameString.match(/Game (\d+)/);
  assertNotNull(gameMatch);
  const id = Number.parseInt(gameMatch[1], 10);
  const turns = turnsString.split(';').map(parseTurn);
  return {
    id,
    turns,
  };
}

function isPossible(game: Game, red: number, green: number, blue: number) {
  return game.turns.every(
    (t) => t.red <= red && t.green <= green && t.blue <= blue,
  );
}

export function part1(input: string) {
  const lines = getLines(input);
  return sum(
    lines
      .map(parseGame)
      .filter((g) => isPossible(g, 12, 13, 14))
      .map((g) => g.id),
  ).toString();
}

function getMaxPerColor(turns: Turn[]): Turn {
  if (turns.length === 1) {
    return turns[0];
  }
  const rest = getMaxPerColor(turns.slice(1));
  return {
    red: Math.max(turns[0].red, rest.red),
    green: Math.max(turns[0].green, rest.green),
    blue: Math.max(turns[0].blue, rest.blue),
  };
}

function getGamePower(game: Game): number {
  const max = getMaxPerColor(game.turns);
  return max.red * max.green * max.blue;
}

export function part2(input: string) {
  const lines = getLines(input);
  return sum(lines.map(parseGame).map((g) => getGamePower(g))).toString();
}
