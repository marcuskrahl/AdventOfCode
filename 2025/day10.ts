import { assertEquals } from 'jsr:@std/assert';
import { getLines, min, sum, unique } from './utils.ts';

type Machine = {
    targetPattern: number;
    buttons: number[];
    buttonsExtended: number[][];
    joltages: number[];
}

function parseMachine(input: string): Machine {
    const machineResult = input.match(/\[([.#]+)\]/)![1];
    const buttonsResult = Array.from(input.matchAll(/\(([\d,]+)\)/g)).map(b => b[1]);
    const joltageResult = input.match(/\{([\d,]+)\}/)![1];

    const machine: Machine = {
        targetPattern: machineResult.split('').map(m => m === '#' ? 1 : 0).reverse().reduce((prev:number, curr: number) => (prev << 1) | curr , 0),
        buttons: buttonsResult.map(b => b.split(',').map(d => 1 << +d).reduce((prev, curr) => prev | curr, 0)),
        buttonsExtended: buttonsResult.map(b => b.split(',').map(d => parseInt(d,10))),
        joltages: joltageResult.split(',').map(j => parseInt(j))
    }
    //console.log(machine);
    return machine;
}

function minPresses(machine: Machine): number {
    let presses = 0;
    let state = [0];
    let checked : number[]= [];
    while (true) {
        if (state.some(s => s === machine.targetPattern)) {
            return presses;
        }
        presses++;
        let newState = [];
        for (let button of machine.buttons) {
            newState.push(...state.map(s => s ^ button));
        }
        newState = unique(newState.filter(n => !checked.includes(n)));
        checked.push(...state);
        state = newState;
    }
    return Number.MAX_SAFE_INTEGER;
}

function isSameJoltage(j1: number[], j2: number[]): boolean {
    return j1.every((j,i) => j === j2[i]);
}

function addJoltage(j: number[], buttons: number): number[] {
    return j.map((p, i)=> p + Math.sign(buttons & (1 << i)));
}

function exceedsJoltage(j:number[], target: number[]): boolean {
    return j.some((p,i) => p > target[i]);
}

function minJoltage(machine: Machine): number {
    let presses = 0;
    let state = [machine.joltages.map(j => 0)];
    let checked : number[][]= [];
    while (true) {
        if (state.some(s => isSameJoltage(s, machine.joltages))) {
            console.log(presses);
            return presses;
        }
        presses++;
        let newState = [];
        for (let button of machine.buttons) {
            newState.push(...state.map(s => addJoltage(s, button)));
        }
        newState = unique(newState, isSameJoltage);
        newState = newState.filter(joltage => !exceedsJoltage(joltage, machine.joltages))
        newState = newState.filter(j => !checked.some(c => isSameJoltage(j,c)));

        if (newState.length === 0) {
            throw new Error('impossible');
        }
        checked.push(...state);
        state = newState;
    }
    return Number.MAX_SAFE_INTEGER;
}

function minButton(buttons: number[][]): number {
    const count: number[] = [];

    for (let button of buttons) {
        for (let t of button) {
            count[t] = (count[t] ?? 0) + 1
        }
    }
    const minCount  =Math.min(...count);
    return count.indexOf(minCount);
}

function minJoltage2(machine: Machine): number {

    let target = machine.joltages.slice();
    let buttons = machine.buttonsExtended;
    let targetIndex = minButton(buttons);

    let targetButtons = buttons.filter(b => b.includes(targetIndex));

    console.log(targetButtons);
    const rec = () => {

    }
    /*const matrix: number[][] = [];
    for (let i=0; i<machine.joltages.length; i++) {
        matrix[i] = [];
        matrix[i][machine.joltages.length]= machine.joltages[i];
        for (let j =0; j < but)
    }*/
    
    return 0;
}

export function part1(input: string) {
    const machines = getLines(input).map(i => parseMachine(i));
    return sum(machines.map(m => minPresses(m)));
}

export function part2(input: string) {
  const machines = getLines(input).map(i => parseMachine(i));
  return sum(machines.map(m => minJoltage2(m)));
}


const sampleInput = `
[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}
`.trim();

Deno.test("part1", async () => {
  assertEquals(part1(sampleInput), 7);
});

Deno.test("part2", async () => {
  assertEquals(part2(sampleInput), 33);
});

