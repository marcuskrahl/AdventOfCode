import { assertEquals } from 'jsr:@std/assert';
import { getLines, sum } from './utils.ts';

type OrderRules = {[key: number]: number[]}
type Update = number[];

function parseInput(input: string): [OrderRules, Update[]] {
  const lines = getLines(input);
  const divider = lines.indexOf('');
  if (divider === -1) throw new Error('divider not found'); 
  const orderRules = lines.slice(0,divider).reduce((acc, curr) => {
    const [before, after] = curr.split('|').map(n => parseInt(n, 10));  
    return {
      ...acc,
      [before]: (acc[before] ?? []).concat([after])
  }
  }, {} as OrderRules)
  const updates = lines.slice(divider+1).map(l => l.split(',').map(n => parseInt(n,10)));
  return [orderRules, updates];
  
}

function isValidUpdate(update: Update, rules: OrderRules): boolean {
  return update.every((u,i) => {
    const rule = rules[u];
    if (rule === undefined) {
      return true;
    }
    return rule.every(r => {
      const ri = update.indexOf(r) 
      if (ri === -1) {
        return true;
      }
      return ri > i;
    })
  });
}

export function part1(input: string) {
  const [rules, updates] = parseInput(input);
  return sum(updates.filter(u => isValidUpdate(u, rules)).map(u => u[(u.length - 1) / 2]));
}

//not working because solution graph has cycles
function topologicalSort(rules: OrderRules): Update {
  rules = structuredClone(rules);
  const list: Update = [];
  const allValues = Object.values(rules).flat();
  const rootNodes = Object.keys(rules).map(r=> +r).filter(r => !allValues.includes(r));
  while(rootNodes.length > 0) {
    const n = rootNodes.shift()!;
    list.push(n);
    const ms = rules[n];
    if (ms === undefined) {
      continue;
    }
    //console.log(ms);
    for (let m of ms) {
      rules[n] = rules[n].filter(v => v !== m);
      //console.log(Object.values(rules).flat());
      if (!Object.values(rules).flat().includes(m)) {
        rootNodes.push(m);
      }
    }
  }
  return list;
}

function fixUpdate(update: Update, rules: OrderRules): Update {
  let i1 = -1;
  let i2 = -1;
  for (let before in rules) {
    const ri = update.indexOf(+before);
    if (ri === -1) {
      continue;
    }
    const rule = rules[before];
    for (let after of rule) {
      const i = update.indexOf(after);
      if (i === -1) {
        continue; 
      }
      if (ri < i) {
        continue;
      }
      i1 = ri;
      i2 = i;
      break;
    }
    if (i1 !== -1) {
      break;
    }
  }
  if (i1 === -1) {
    //console.log('fixed', update.join(','))
    return update;
  }
  const newUpdate = [...update];
  newUpdate[i2] = update[i1];
  newUpdate[i1] = update[i2];
  return fixUpdate(newUpdate, rules);
  
}

function fixUpdate2(update: Update, sortedRules: Update): Update {
  return sortedRules.filter(s => update.includes(s));
};

export function part2(input: string) {
  const [rules, updates] = parseInput(input);
  const sortedRules = topologicalSort(rules);

  return sum(updates.filter(u => !isValidUpdate(u, rules)).map(u => fixUpdate(u, rules)).map(u => u[(u.length - 1) / 2]));
  //return sum(updates.filter(u => !isValidUpdate(u, rules)).map(u => fixUpdate2(u, sortedRules)).map(u => u[(u.length - 1) / 2]));
}


const sampleInput = `
47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47
`.trim();

Deno.test("part1", async () => {
  assertEquals(part1(sampleInput), 143);
});

Deno.test("part2", async () => {
  assertEquals(part2(sampleInput), 123);
});
