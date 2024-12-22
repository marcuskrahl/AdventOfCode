import { assertEquals } from 'jsr:@std/assert';
import { getLines, sum } from './utils.ts';

function mixAndPrune(v: bigint, s: bigint): bigint {
  const mix = v ^ s;
 // 4096 * 4096
  const prune = mix % 16777216n;
  return prune;
}


function round(secret: bigint, rounds: number): bigint {
  if (rounds === 0) {
    return secret;
  }
  const m = secret * 64n;
  secret = mixAndPrune(m, secret); 
  const d = secret >> 5n;
  secret = mixAndPrune(d, secret);
  const  v = secret  << 11n;
  return round(mixAndPrune(v, secret), rounds - 1);
}

export function part1(input: string) {
  const secrets = getLines(input).map(s => BigInt(s));
  return sum(secrets.map(s => Number(round(s, 2000))));
}


export function part2(input: string) {
  const prices: {[key: number]: number} = {}; 
  const secrets = getLines(input).map(s => BigInt(s));
  for (let secret of secrets) {
    const monkeyPrices: {[key: number]: number} = {};
    const s1 = round(secret, 1);
    const s2 = round(s1, 1);
    const s3 = round(s2, 1);
  
    let s = s3;
    let sr = (s3 % 10n);
    
    const d1 = Number(s1 % 10n - secret % 10n) + 10;
    const d2 = Number(s2 % 10n - s1 % 10n) + 10;
    const d3 = Number(s3 % 10n - s2 % 10n) + 10;

    let d = d1 * 100 * 100 + d2 * 100 + d3

    for (let i = 3; i < 2000; i++) {
      d = d * 100;
      d = d % ( 100 * 100 * 100 * 100);
      let sn = round(s, 1);
      let b = (sn % 10n);
      let snr = b - sr;

      d = d + Number(snr + 10n);
      if (monkeyPrices[d] == undefined) {
        monkeyPrices[d] = Number(b);
      }
      s = sn;
      sr = b;
    }
    Object.entries(monkeyPrices).forEach(([k, v]) => prices[+k] = (prices[+k] ?? 0) + v);
  }
  let max = 0;
  Object.values(prices).forEach(p => max = p > max ? p : max);
  //console.log(prices);
  return max;
}


const sampleInput = `
1
10
100
2024
`.trim();

const sampleInput2 = `
1
2
3
2024`.trim()

Deno.test('round', () => {
  assertEquals(round(123n, 1), 15887950n);
  assertEquals(round(123n, 2), 16495136n);
});

Deno.test("part1", async () => {
  assertEquals(part1(sampleInput), 37327623);
});

Deno.test("part2", async () => {
  //assertEquals(part2('123'),0); 
  assertEquals(part2(sampleInput2), 23);
});
