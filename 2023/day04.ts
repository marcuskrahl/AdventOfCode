import { getLines, sum } from './utils';

interface Card {
  id: number;
  winningNumbers: number[];
  ownNumbers: number[];
}
function parseCard(input: string): Card {
  const id = Number.parseInt(input.split(':')[0].replace('Card ', ''), 10);
  const winningNumbers = input
    .split(':')[1]
    .split(' | ')[0]
    .split(' ')
    .map((n) => parseInt(n, 10))
    .filter((n) => !isNaN(n));
  const ownNumbers = input
    .split(':')[1]
    .split(' | ')[1]
    .split(' ')
    .map((n) => parseInt(n, 10))
    .filter((n) => !isNaN(n));
  return {
    id,
    winningNumbers,
    ownNumbers,
  };
}

function getWinningNumbers(card: Card): number {
  return sum(
    card.winningNumbers.map((w) => (card.ownNumbers.includes(w) ? 1 : 0)),
  );
}

function getScore(card: Card): number {
  const correctWinningNumbers = getWinningNumbers(card);
  if (correctWinningNumbers === 0) {
    return 0;
  }
  return 1 << (correctWinningNumbers - 1);
}

export function part1(input: string) {
  const cards = getLines(input).map(parseCard);
  return sum(cards.map(getScore)).toString();
}

function getCardCopies(cards: Card[]): number[] {
  //start with one of every card
  const result = cards.map(() => 1);
  for (let i = 0; i < result.length; i++) {
    const winningNumbers = getWinningNumbers(cards[i]);
    for (let j = 1; j <= winningNumbers; j++) {
      result[i + j] += result[i];
    }
  }
  return result;
}

export function part2(input: string) {
  const cards = getLines(input).map(parseCard);
  return sum(getCardCopies(cards)).toString();
}
