import { Rank, getHandType, getJokerHandType, part1, part2 } from './day07';

describe('day 07', () => {
  const input = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

  it.each`
    cards                        | rank
    ${['1', '1', '1', '1', '1']} | ${Rank.FiveOfAKind}
    ${['1', '1', 'A', '1', '1']} | ${Rank.FourOfAKind}
  `('calculate card rank', ({ cards, rank }) => {
    expect(getHandType(cards)).toBe(rank);
  });
  it('should solve part 1', () => {
    expect(part1(input)).toBe(6440);
  });

  it('should solve part 2', () => {
    expect(part2(input)).toBe(5905);
  });

  it.each`
    cards                        | rank
    ${['1', '1', '1', '1', '1']} | ${Rank.FiveOfAKind}
    ${['1', '1', 'J', '1', '1']} | ${Rank.FiveOfAKind}
    ${['1', '1', '1', '2', '1']} | ${Rank.FourOfAKind}
    ${['1', 'J', '1', '2', '1']} | ${Rank.FourOfAKind}
    ${['1', '1', '1', '2', '2']} | ${Rank.FullHouse}
    ${['1', 'J', '1', '2', '2']} | ${Rank.FullHouse}
    ${['J', 'J', '3', '2', '2']} | ${Rank.FourOfAKind}
    ${['J', 'J', '3', '1', '2']} | ${Rank.ThreeOfAKind}
    ${['J', 'J', 'J', '1', '2']} | ${Rank.FourOfAKind}
    ${['1', 'J', '3', '2', '2']} | ${Rank.ThreeOfAKind}
    ${['1', '2', '3', '4', 'J']} | ${Rank.OnePair}
    ${['1', '2', '3', '4', '5']} | ${Rank.HighCard}
    ${['J', 'J', 'J', 'J', 'J']} | ${Rank.FiveOfAKind}
  `('calculate card rank 2', ({ cards, rank }) => {
    expect(getJokerHandType(cards)).toBe(rank);
  });
});
