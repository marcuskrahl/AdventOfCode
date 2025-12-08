import { assertEquals } from 'jsr:@std/assert';
import { getLines, product } from './utils.ts';

type Box  = {x:number, y: number, z: number, id: string};

function parseBoxes(input: string): Box[] {
  return getLines(input).map(l => l.split(',') as [string,string,string]).map(([x,y,z]) => ({x: parseInt(x,10), y: parseInt(y, 10), z: parseInt(z, 10), id:`${x},${y},${z}`}));
}

function boxDistance(box1: Box, box2: Box): number {
  return Math.sqrt(
    Math.pow(box1.x - box2.x, 2)
    + Math.pow(box1.y - box2.y, 2)
    + Math.pow(box1.z - box2.z, 2)
  )
}

function shortestDistances(boxes: Box[]): { distance: number, box1: Box, box2: Box}[] {
  let distances = [];
  for (let i=0; i<boxes.length; i++) {
    for (let j  = i+1; j < boxes.length; j++) {
      const box1 = boxes[i];
      const box2 = boxes[j];
      const distance = boxDistance(box1, box2);
      distances.push({box1, box2, distance});
    }
  }
  return distances.toSorted((d1,d2) => d1.distance - d2.distance);
}

type BoxConnections = {boxToGroup: {[key: string]: number}, groupToBox: {[group: number]: Box[]}};

function initialGrouping(boxes: Box[]): BoxConnections {
  const boxConnections: BoxConnections = { boxToGroup: {}, groupToBox:[]};
  for (let i=0; i< boxes.length; i++) {
    const box = boxes[i];
    boxConnections.boxToGroup[box.id] = i;
    boxConnections.groupToBox[i]= [box];
  }
  return boxConnections;
}

function connect(box1: Box, box2:Box, connections: BoxConnections): boolean {
  const group1 = connections.boxToGroup[box1.id];
  const group2 = connections.boxToGroup[box2.id];

  if (group1 === group2) {
    return false;
  }

  //console.log(`move ${box1.id} with ${box2.id} from ${group2} to ${group1}`);

  const boxesInGroup = connections.groupToBox[group2];
  connections.groupToBox[group1].push(...boxesInGroup);
  connections.groupToBox[group2] = [];
  for (let box of boxesInGroup) {
    connections.boxToGroup[box.id] = group1;
  }
  return true;
}

export function part1(input: string, connections = 1000, onlyValid = false) {
  const boxes = parseBoxes(input);
  const distances = shortestDistances(boxes);
  const grouping = initialGrouping(boxes);
  let madeConnections = 0;
  for(let d of distances) {
    //console.log(d);
    //console.log(grouping);
    
    if (connect(d.box1, d.box2, grouping) || onlyValid === false) {
      madeConnections++;
      if (madeConnections >= connections) {
        break;
      }  
    }
    
  }
  //console.log(grouping);
  return product(Object.values(grouping.groupToBox).toSorted((g1,g2) => g2.length - g1.length).slice(0,3).map(g => g.length || 1));
}

export function part2(input: string) {
  const boxes = parseBoxes(input);
  const distances = shortestDistances(boxes);
  const grouping = initialGrouping(boxes);
  for(let d of distances) {
    
    connect(d.box1, d.box2, grouping);
    if (Object.values(grouping.groupToBox).some(b => b.length === boxes.length)) {
      return d.box1.x * d.box2.x;
    }
  }
  return 0;
}


const sampleInput = `
162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689
`.trim();

Deno.test("part1", async () => {
  assertEquals(part1(sampleInput, 10, true), 50);
});

Deno.test("part2", async () => {
  assertEquals(part2(sampleInput), 25272);
});
