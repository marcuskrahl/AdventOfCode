import { part1, part2, snafuToDec, decToSnafu } from './code';

describe('advent of code day', () => {
  const sampleInput: string[] = [
    '1=-0-2',
    '12111',
    '2=0=',
    '21',
    '2=01',
    '111',
    '20012',
    '112',
    '1=-1=',
    '1-12',
    '12',
    '1=',
    '122',
  ];

  it.each`
    snafu              | dec
    ${'1'}             | ${1}
    ${'2'}             | ${2}
    ${'1='}            | ${3}
    ${'1-'}            | ${4}
    ${'10'}            | ${5}
    ${'11'}            | ${6}
    ${'12'}            | ${7}
    ${'2='}            | ${8}
    ${'2-'}            | ${9}
    ${'20'}            | ${10}
    ${'1=0'}           | ${15}
    ${'1-0'}           | ${20}
    ${'1=11-2'}        | ${2022}
    ${'1-0---0'}       | ${12345}
    ${'1121-1110-1=0'} | ${314159265}
  `('should convert number $snafu to $dec', ({ snafu, dec }) => {
    expect(snafuToDec(snafu)).toEqual(dec);
    expect(decToSnafu(dec)).toEqual(snafu);
  });

  it('should solve part1', () => {
    expect(part1(sampleInput)).toEqual('2=-1=0');
  });

  it('should solve part2', () => {
    expect(part2(sampleInput)).toEqual(0);
  });
});
