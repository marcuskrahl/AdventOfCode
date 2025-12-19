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

    //console.log(targetButtons);
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

function press(button: number[], joltages: number[], presses: number = 1) :void{
    for (let i  = 0; i < button.length; i++) {
        joltages[button[i]] -= presses;
    }
}


function minJoltage3(buttons: number[][], joltages: number[], buttonSlice: number = 0): number {
    //let [button, ...rest]= buttons;
    //console.log(button, rest);
    let maxPresses = Math.min(...joltages.filter((_,i) => buttons[buttonSlice].includes(i)));
    //console.log(button, maxPresses, joltages);
    if (buttonSlice >= buttons.length - 1) {
        press(buttons[buttonSlice], joltages, maxPresses);
        const result = joltages.some(j => j > 0) ? Number.MAX_SAFE_INTEGER : maxPresses;
        press(buttons[buttonSlice], joltages, -maxPresses);
        return result;
    }
    for (let j = 0 ; j < joltages.length; j++) {
        if (joltages[j] === 0) {
            continue;
        }
        let found = false
        for (let i =buttonSlice; i<buttons.length; i++) {
            for (let k = 0; k < buttons[i].length; k++) {
                if (buttons[i][k] === j) {
                    found = true;
                    break;
                }
            }
        }
        if (!found) {
            return Number.MAX_SAFE_INTEGER;
        }
    }
    

    let minPresses = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i <= maxPresses; i++) {
        if (buttonSlice === 0) {
            console.log('b', i / maxPresses * 100 );

        }
        press(buttons[buttonSlice], joltages, i);
        const subPresses = i + minJoltage3(buttons, joltages, buttonSlice + 1);
        press(buttons[buttonSlice], joltages, -i);
        if (subPresses < minPresses) {
            //console.log(button, rest, newJoltage, subPresses);
            minPresses = subPresses;
        }
    }
    return minPresses;

}

function optimizeMachine(buttons: number[][], joltages: number[]) : [number[][], number[]] {
    /*let newButtons = [...buttons];
    let newJoltage = [...joltages];
    let joltageDistribution = joltages.map((v, i) => buttons.filter(b => b.includes(i))).filter(d => d.length === 1);
    for (let b of joltageDistribution) {
        console.log(b);
    }*/
   /*let twoButtonCombination: undefined | number[][] = undefined;
   let threeButtonCombination: undefined | number[][] = undefined
   for (let b1 of buttons) {
        if (twoButtonCombination != undefined) {
            break;
        }
        for (let b2 of buttons) {
            if (b1 == b2) {
                continue;
            }
            if (b2.some(b => b1.includes(b))) {
                continue;
            }
            if (b1.length + b2.length === joltages.length) {
                twoButtonCombination = [b1,b2];
                break;
            }
            for (let b3 of buttons) {
                if (b3 == b2 || b3 == b1) {
                    continue;
                }
                if (b3.some( b => b1.includes(b))) {
                    continue;
                }
                if (b3.some( b => b2.includes(b))) {
                    continue;
                }
                if (b1.length + b2.length + b3.length === joltages.length) {
                    threeButtonCombination = [b1,b2, b3];
                    break;
                }
            }
        }
   }
   if (twoButtonCombination != undefined) {
    console.log('two button', twoButtonCombination);
    return [twoButtonCombination, joltages];
   }
   if (threeButtonCombination != undefined) {
    console.log('three button');
    return [threeButtonCombination, joltages];
   }*/

   return [buttons, joltages];
}



function sortButtons(buttons: number[][], joltages: number[]): number[][] {
    const result = buttons.slice(0);
    const cardinality = Object.fromEntries(joltages.map((v,i)=> [i, buttons.filter(b => b.includes(i)).length]))
    return result.toSorted((b1,b2) => {
        const b1Card = Math.min(...b1.map(b => cardinality[b]));
        const b2Card =  Math.min(...b2.map(b => cardinality[b]));
        return b1Card - b2Card;
    });
}

/**
 * Bringt eine erweiterte Matrix in reduzierte Zeilenstufenform (RREF)
 * @param {number[][]} matrix - m x (n+1) erweiterte Matrix
 * @param {number} eps - numerische Toleranz
 * @returns {number[][]} RREF-Matrix
 */
function rref(matrix: number[][], eps = 1e-10) {
  const A = matrix.map(row => row.slice());
  const rows = A.length;
  const cols = A[0].length;

  let lead = 0;

  for (let r = 0; r < rows; r++) {
    if (lead >= cols) break;

    let i = r;
    while (Math.abs(A[i][lead]) < eps) {
      i++;
      if (i === rows) {
        i = r;
        lead++;
        if (lead === cols) return A;
      }
    }

    // Zeilen tauschen
    [A[i], A[r]] = [A[r], A[i]];

    // Pivot normalisieren
    const lv = A[r][lead];
    for (let j = 0; j < cols; j++) {
      A[r][j] /= lv;
    }

    // Spalte eliminieren
    for (let i2 = 0; i2 < rows; i2++) {
      if (i2 !== r) {
        const lv2 = A[i2][lead];
        for (let j = 0; j < cols; j++) {
          A[i2][j] -= lv2 * A[r][j];
        }
      }
    }

    lead++;
  }

  return A;
}

/**
 * Erzeugt eine Parameterlösung aus der RREF
 * @param {number[][]} rrefMatrix
 * @param {number} eps
 * @returns {object} Lösungsbeschreibung
 */
function extractSolution(rrefMatrix: number[][], eps = 1e-10) {
  const rows = rrefMatrix.length;
  const cols = rrefMatrix[0].length;
  const vars = cols - 1;

  const pivotCols = new Set();
  const solution = Array(vars).fill(null);

  // Pivotspalten finden
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < vars; j++) {
      if (Math.abs(rrefMatrix[i][j] - 1) < eps) {
        pivotCols.add(j);

        // rechte Seite
        solution[j] = {
          constant: rrefMatrix[i][vars],
          coeffs: {}
        };

        // freie Variablen einsammeln
        for (let k = 0; k < vars; k++) {
          if (!pivotCols.has(k) && Math.abs(rrefMatrix[i][k]) > eps) {
            solution[j].coeffs[k] = -rrefMatrix[i][k];
          }
        }
        break;
      }
    }
  }

  // freie Variablen markieren
  const freeVars = [];
  for (let i = 0; i < vars; i++) {
    if (!pivotCols.has(i)) {
      solution[i] = { free: true };
      freeVars.push(i);
    }
  }

  return { solution, freeVars };
}

function evaluateSolution(solutionData: ReturnType<typeof extractSolution>, params:{[key: number]: number} = {}) {
  const result:{ [key: number]: number} = [];

  solutionData.solution.forEach((entry, i) => {
    if (entry.free) {
      result[i] = params[i] ?? 0;
    } else {
      let value = entry.constant;
      for (const k in entry.coeffs) {
        value += entry.coeffs[k] * (params[k as unknown as number] ?? 0);
      }
      result[i] = value;
    }
  });

  return result;
}

function calculateResult (matrix:number[][], freeVariables: number[], values: {[key: number]: number}) {
    let sum = 0;
    for (let y= 0; y < matrix.length; y++) {
        let val = 0;
        for (let f = 0; f < freeVariables.length; f++) {
            const x = freeVariables[f];
            val += -1 * matrix[y][x] * values[x];
        }
        val += matrix[y].at(-1)!;
        if (val < -1e-10) {
        //if (val < 0) {
            return Number.MAX_SAFE_INTEGER;
        }
        if (Math.abs(val - Math.round(val)) > 1e-6) {
            return Number.MAX_SAFE_INTEGER;
        }
        sum += val;
    }
    for (let f = 0; f < freeVariables.length; f++) {
        sum += values[freeVariables[f]];
    }
    return sum
}

function findMinFreeVariables(matrix: number[][], freeVariables: number[], unsetVariables: number[], values: {[key: number]: number}, maxPresses: number): number {
    if (freeVariables.length === 0) {
        return calculateResult(matrix, freeVariables, {});
    }
    
    if (unsetVariables.length === 0) {
        let min = Number.MAX_SAFE_INTEGER;
        for (let i=0; i<maxPresses; i++) {
            const res = calculateResult(matrix, freeVariables, values);
            if (res < min) {
                min = res;
            }
        }
        return min;
    } else {
        let [variable, ...rest] = unsetVariables;
        let min = Number.MAX_SAFE_INTEGER;
        for (let i = 0; i < maxPresses; i++) {
            values[variable] = i;
            const result = findMinFreeVariables(matrix, freeVariables, rest, values, maxPresses);
            if (result < min) {
                min = result;
            }
        }
        return min;
    }    
}

function minJoltageLGS(buttons: number[][], joltages: number[]): number {
    const matrix: number[][] = [];
    for (let j = 0; j < joltages.length; j++) {
        matrix[j] = [];
        for (let i =0 ;i < buttons.length; i++) {
            matrix[j][i] = buttons[i].includes(j) ? 1 : 0;
        }
        matrix[j][buttons.length] = joltages[j];
    }

    //console.table(matrix);

    const rrefMatrix = rref(matrix);
    //console.table(rrefMatrix);

    const solutionData = extractSolution(rrefMatrix);
    //console.log("Freie Variablen:", solutionData.freeVars, solutionData.freeVars.length);

    /*const numericSolution = evaluateSolution(solutionData, {
    3: 2, // x4 = s
    5: 1  // x6 = t
    });*/

    //console.log("Konkrete Lösung:", numericSolution);
    let maxPresses = Math.max(...joltages);
    const result =  findMinFreeVariables(rrefMatrix, solutionData.freeVars, [...solutionData.freeVars], {}, maxPresses);
    if (result >= 1000) {
        console.log(solutionData.freeVars);
        console.table(rrefMatrix);
    }
    if (Math.abs(Math.round(result) - result) > 1e-5) {
        console.log('ERROR');
        console.table(solutionData.freeVars);
        console.table(rrefMatrix);
    }
    return Math.round(result);
}




export function part1(input: string) {
    const machines = getLines(input).map(i => parseMachine(i));
    return sum(machines.map(m => minPresses(m)));
}

export function part2(input: string) {
  const machines = getLines(input).map(i => parseMachine(i));
  //console.log(machines.filter(m => m.buttonsExtended.length > m.joltages.length).length, machines.length)
  /*return sum(machines.map((m,i) => {
    let [buttons, joltages] = optimizeMachine(m.buttonsExtended, m.joltages);
    const res = minJoltage3(sortButtons(m.buttonsExtended, m.joltages), m.joltages);
    //const res = minJoltage3(m.buttonsExtended, m.joltages);
    console.log(i + 1, res); 
    return res; 
    }) );*/
     return sum(machines.map((m,i) => {
        const result = minJoltageLGS(m.buttonsExtended, m.joltages);
        if (result >= Number.MAX_SAFE_INTEGER - 1) {
            console.log('invalid result ', i);
        }
        console.log(result);
        return result;
        
}));
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

