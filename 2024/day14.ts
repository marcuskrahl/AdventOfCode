import { assertEquals } from 'jsr:@std/assert';
import { getLines, newGrid, printGrid, sum } from './utils.ts';


type Robot = { x: number, y:number, vx: number, vy: number };

function parseRobot(input: string) : Robot {
  const [p,v] = input.split(' ');
  const [x,y] = p.slice(2).split(",").map(l => parseInt(l, 10));
  const [vx,vy] = v.slice(2).split(",").map(l => parseInt(l, 10));
  return {
    x, y, vx, vy
  }
}

function advanceRobot(robot: Robot,width:number,height:number, steps: number): {x:number, y:number} {
  const x =  ((robot.x + steps * robot.vx) % width + width) % width;
  const y = ((robot.y + steps * robot.vy) % height + height) % height;
  return {x,y};
}

function countQuadrants(pos: {x:number, y:number}[], width: number, height: number): number {
  const w2 = Math.floor(width/2);
  const h2 = Math.floor(height/2);
  const q= pos.reduce((acc, curr) => {
    if (curr.x < w2 && curr.y <h2) {
      return {
        ...acc,
        q1: acc.q1 + 1
      }
    }
    else if (curr.x > w2 && curr.y <h2) {
      return {
        ...acc,
        q2: acc.q2 + 1
      }
    }
    else if (curr.x < w2 && curr.y >h2) {
      return {
        ...acc,
        q3: acc.q3 + 1
      }
    }
    else if (curr.x > w2 && curr.y > h2){
      return {
        ...acc,
        q4: acc.q4 + 1
      }
    } 
    return acc;
  }, {q1: 0, q2: 0, q3: 0, q4: 0});
  //console.log(q);
  return q.q1 * q.q2 * q.q3 * q.q4;
}

export function part1(input: string, width: number = 101, height: number = 103) {
  const robots = getLines(input).map(parseRobot)
  const finalCoords = robots.map(r => advanceRobot(r, width, height, 100));
//console.log(finalCoords);
  return countQuadrants(finalCoords, width, height);
}

function step(robots: Robot[], width:number, height: number): Robot[] {
  return robots.map(r => {
    const {x,y} = advanceRobot(r, width, height, 1);
    return {
      ...r,
      x,
      y
    }
})
}

function printRobots(robots: Robot[], width: number, height: number): void {
  const grid = newGrid(width, height, ' ');
  robots.forEach(r => grid[r.x][r.y] = '#');
  printGrid(grid);
}

let maxR = 0;

function checkTree(robots: Robot[], width:number, height: number): boolean {
  if (width < 20) {
    return true; 
  }
  const avgX = 50;//sum(robots.map(r => r.x)) / robots.length;
  const sameRobots =  robots.filter(r1 => robots.some(r2 => r1.y === r2.y && r1.x != r2.x && Math.abs(r1.x - avgX) === Math.abs(r2.x - avgX)));
  //console.log(avgX, sameRobots.length);
  const valid = sameRobots.length;
  if (valid > maxR) {
    //console.log(valid);
    maxR = valid;
    printRobots(robots, width, height);
  }
  return sameRobots.length === robots.length;
}

export function part2(input: string, width: number = 101, height: number = 103) {
  if (width < 100) {
    return 0;
 }
  const buf = new Uint8Array(100);
  let robots = getLines(input).map(parseRobot)
  let i =48;
  for (let i=0; i<48; i++) {
    robots = step(robots, width, height);
  }
  while(true) {
  //while(!checkTree(robots,width, height)) {
    for (let j = 0; j< 101; j++) {
      robots = step(robots, width, height);
    }
    i+= 101;
    printRobots(robots, width, height);
    console.log(i);
    Deno.stdin.readSync(buf);
  }
  return 0;
}


const sampleInput = `
p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3
`.trim();

Deno.test("part1", async () => {
  assertEquals(part1(sampleInput, 11,7), 12);
});

Deno.test("part2", async () => {
  assertEquals(part2(sampleInput, 11, 7), 0);
});
