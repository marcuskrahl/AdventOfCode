import { getLines, min, sum } from './utils';

export enum Rank {
  FiveOfAKind = 1,
  FourOfAKind = 2,
  FullHouse = 3,
  ThreeOfAKind = 4,
  TwoPair = 5,
  OnePair = 6,
  HighCard = 7,
}

const cardValues: { [key: string]: number } = {
  A: 1,
  K: 2,
  Q: 3,
  J: 4,
  T: 5,
  '9': 6,
  '8': 7,
  '7': 8,
  '6': 9,
  '5': 10,
  '4': 11,
  '3': 12,
  '2': 13,
  '1': 14,
};

interface Hand {
  cards: string[];
  type: Rank;
}

interface HandWithBid {
  hand: Hand;
  bid: number;
}

function getCardLengths(cards: string[]): number[] {
  if (cards.length === 0) {
    return [];
  }
  const v = cards[0];
  const amount = cards.filter((c) => c === v).length;
  return [amount, ...getCardLengths(cards.filter((c) => c !== v))];
}

export function getHandType(cards: string[]): Rank {
  const cardLengths = getCardLengths(cards);
  if (cardLengths[0] === 5) {
    return Rank.FiveOfAKind;
  }
  if (cardLengths.includes(4)) {
    return Rank.FourOfAKind;
  }
  if (cardLengths.includes(3) && cardLengths.includes(2)) {
    return Rank.FullHouse;
  }
  if (cardLengths.includes(3)) {
    return Rank.ThreeOfAKind;
  }
  if (
    cardLengths.includes(2) &&
    cardLengths.indexOf(2) !== cardLengths.lastIndexOf(2)
  ) {
    return Rank.TwoPair;
  }
  if (cardLengths.includes(2)) {
    return Rank.OnePair;
  }
  return Rank.HighCard;
}

function parseHand(
  input: string,
  handType: (cards: string[]) => Rank = getHandType,
): HandWithBid {
  const [cardString, bidString] = input.split(' ');
  const cards = cardString.split('');
  return {
    hand: {
      cards: cards,
      type: handType(cards),
    },
    bid: parseInt(bidString, 10),
  };
}

function sortHands(
  hand1: Hand,
  hand2: Hand,
  values: { [card: string]: number } = cardValues,
): number {
  if (hand1.type === hand2.type) {
    for (let i = 0; i < hand1.cards.length; i++) {
      if (values[hand1.cards[i]] < values[hand2.cards[i]]) {
        return -1;
      }
      if (values[hand1.cards[i]] > values[hand2.cards[i]]) {
        return 1;
      }
    }
    return 0;
  }
  return hand1.type - hand2.type;
}

export function part1(input: string) {
  const hands = getLines(input).map((i) => parseHand(i));
  hands.sort((h1, h2) => -1 * sortHands(h1.hand, h2.hand));
  return sum(hands.map((h, i) => (i + 1) * h.bid));
}

export function getJokerHandType(cards: string[]): Rank {
  const cardLengths = getCardLengths(cards.filter((c) => c !== 'J'));
  const jokerCount = cards.filter((c) => c === 'J').length;
  if (jokerCount === 5) {
    return Rank.FiveOfAKind;
  }
  let maxIndex = 0;
  for (let i = 1; i < cardLengths.length; i++) {
    if (cardLengths[maxIndex] < cardLengths[i]) {
      maxIndex = i;
    }
  }
  cardLengths[maxIndex] += jokerCount;

  if (cardLengths[0] === 5) {
    return Rank.FiveOfAKind;
  }
  if (cardLengths.includes(4)) {
    return Rank.FourOfAKind;
  }
  if (cardLengths.includes(3) && cardLengths.includes(2)) {
    return Rank.FullHouse;
  }
  if (cardLengths.includes(3)) {
    return Rank.ThreeOfAKind;
  }
  if (
    cardLengths.includes(2) &&
    cardLengths.indexOf(2) !== cardLengths.lastIndexOf(2)
  ) {
    return Rank.TwoPair;
  }
  if (cardLengths.includes(2)) {
    return Rank.OnePair;
  }
  return Rank.HighCard;
}

export function part2(input: string) {
  const hands = getLines(input).map((i) => parseHand(i, getJokerHandType));
  const changedValues = {
    ...cardValues,
    J: 99,
  };
  hands.sort((h1, h2) => -1 * sortHands(h1.hand, h2.hand, changedValues));
  return sum(hands.map((h, i) => (i + 1) * h.bid));
}
