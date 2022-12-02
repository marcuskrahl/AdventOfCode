import { sum } from '@adventofcode2022/util';

type Round = {
  opponent: 'rock' | 'paper' | 'scissors';
  own: 'rock' | 'paper' | 'scissors';
};

type Prediction = {
  opponent: 'rock' | 'paper' | 'scissors';
  result: 'win' | 'tie' | 'lose';
};

function createRound(line: string): Round {
  const opponentLetter = line[0];
  const ownLetter = line[2];
  return {
    opponent: opponentLetter === 'A' ? 'rock' : opponentLetter === 'B' ? 'paper' : 'scissors',
    own: ownLetter === 'X' ? 'rock' : ownLetter === 'Y' ? 'paper' : 'scissors',
  };
}

function createPrediction(line: string): Prediction {
  const opponentLetter = line[0];
  const resultLetter = line[2];
  return {
    opponent: opponentLetter === 'A' ? 'rock' : opponentLetter === 'B' ? 'paper' : 'scissors',
    result: resultLetter === 'X' ? 'lose' : resultLetter === 'Y' ? 'tie' : 'win',
  };
}

function calculateRoundResult(round: Round): 'win' | 'tie' | 'lose' { 
  if (round.opponent === round.own) {
    return 'tie';
  }
  if (round.opponent === 'rock' && round.own === 'paper') {
    return 'win';
  }
  if (round.opponent === 'scissors' && round.own === 'paper') {
    return 'lose';
  }
  if (round.opponent === 'scissors' && round.own === 'rock') {
    return 'win';
  }
  if (round.opponent === 'paper' && round.own === 'rock') {
    return 'lose';
  }
  if (round.opponent === 'paper' && round.own === 'scissors') {
    return 'win';
  }
  if (round.opponent === 'rock' && round.own === 'scissors') {
    return 'lose';
  }
  return 'tie';
}

function calculateRound(round: Round): number {
  const shapeScore = round.own === 'rock' ? 1 : round.own === 'paper' ? 2 : 3;
  const roundResult = calculateRoundResult(round);
  const resultScore = roundResult === 'win' ? 6 : roundResult === 'tie' ? 3 : 0; 
  return shapeScore + resultScore;
}

function calculateOwnShapeForPrediction(prediction: Prediction): 'rock' | 'paper' | 'scissors' {
  if (prediction.result === 'win') {
    switch (prediction.opponent) {
      case 'rock': return 'paper';
      case 'scissors': return 'rock';
      case 'paper': return 'scissors';
    }
  }
  if (prediction.result === 'lose') {
    switch (prediction.opponent) {
      case 'rock': return 'scissors';
      case 'scissors': return 'paper';
      case 'paper': return 'rock';
    }
  }

  return prediction.opponent;
}

function calculatePredictionRound(prediction: Prediction): number {
  const ownShape = calculateOwnShapeForPrediction(prediction); 
  const shapeScore = ownShape=== 'rock' ? 1 : ownShape=== 'paper' ? 2 : 3;
  const roundResult = prediction.result;
  const resultScore = roundResult === 'win' ? 6 : roundResult === 'tie' ? 3 : 0; 
  return shapeScore + resultScore;
}

export function part1(lines: string[]): number {
  const rounds = lines.flatMap((l) => l === '' ? [] : [createRound(l)]);
  const roundResults = rounds.map((r) => calculateRound(r));
  return sum(roundResults);
}

export function part2(lines: string[]): number {
  const rounds = lines.flatMap((l) => l === '' ? [] : [createPrediction(l)]);
  const roundResults = rounds.map((r) => calculatePredictionRound(r));
  return sum(roundResults);
}
