import { assertEquals } from 'jsr:@std/assert';
import { getLines, max } from './utils.ts';

type Coord = {x:number, y:number};

function parseCoords(input:string): Coord[] {
  return getLines(input)
    .map(i => i.split(','))
    .map(([x,y]) => ({x: parseInt(x), y: parseInt(y)}));
}

function getMaxArea(coords: Coord[]): number {
  let maxArea = 0;
  for(let i = 0; i< coords.length; i++) {
    for (let j = i+1; j < coords.length; j++) {
      const c1 = coords[i];
      const c2 = coords[j];
      const area = (Math.abs(c1.x - c2.x) + 1) * (Math.abs(c1.y - c2.y) + 1);
      if (area > maxArea) {
        maxArea = area;
      }
    }
  }
  return maxArea;
}


/*function getMaxRedGreenArea(coords: Coord[]): number {
  let maxArea = 0;
  let dividers = [];
  for (let i = 1; i < coords.length; i++) {
    dividers.push({from: coords[i-1], to: coords[i], horizontal: coords[i-1].y === coords[i].y});
  }
  dividers.push({from: coords.at(-1)!, to: coords[0], horizontal: coords.at(-1)!.y === coords[0].y});
  const horizontalDividers = dividers.filter(d => d.horizontal);
  const verticalDividers = dividers.filter(d => !d.horizontal);
  console.log(horizontalDividers);

  for(let i = 0; i< coords.length; i++) {
    for (let j = i+1; j < coords.length; j++) {
      const c1 = coords[i];
      const c2 = coords[j];
      const minX = Math.min(c1.x,c2.x);
      const maxX = Math.max(c1.x,c2.x);
      const minY = Math.min(c1.y,c2.y);
      const maxY = Math.max(c1.y,c2.y);

      const area = (maxX - minX + 1) * (maxY - minY + 1);
      if (area > maxArea) {
        if (horizontalDividers.some(d => d.from.y > minY && d.from.y < maxY && Math.min(d.from.x, d.to.x) <= minX && Math.max(d.from.x, d.to.x)  >= minX)) {
          continue;        
        }
        if (horizontalDividers.some(d => d.from.y > minY && d.from.y < maxY && Math.min(d.from.x, d.to.x) <= maxX && Math.max(d.from.x, d.to.x) >= maxX)) {
          continue;        
        }
        if (verticalDividers.some(d => d.from.x > minX && d.from.x < maxX && Math.min(d.from.y, d.to.y) <= minY && Math.max(d.from.y, d.to.y) >= minY)) {
          continue;        
        }
        if (verticalDividers.some(d => d.from.x > minX && d.from.x < maxX && Math.min(d.from.y, d.to.y) <= maxY && Math.max(d.from.y, d.to.y) >= maxY)) {
          continue;        
        }
        
        console.log(c1,c2);
        maxArea = area;
      }

      
    }
  }
  return maxArea;
}*/

function subdivideArea(coords: Coord[]): number {
  let areas:{from: Coord, to: Coord}[] = [{from: {x:0, y:0}, to: {x:100_000, y:100_000}}];
  for (let i=1; i<coords.length;i++) {
    let c1 = coords[i-1];
    let c2 = coords[i];
    let horizontal = c1.y === c2.y;
    for (let j =0; j<areas.length; j++) {
      let area = areas[j];
      if (horizontal) {
        const y = c1.y;
        if (y <= area.from.y || y>=area.to.y) {
          continue;
        }
        const minX = Math.min(c1.x, c2.x);
        const maxX = Math.max(c1.x,c2.x);
        if (minX >= area.to.x || maxX <= area.from.x) {
          continue;
        }

        const newArea = {from: {x: area.from.x, y }, to: {x: area.to.x, y: area.to.y}};
        area.to.y = y;
        areas.splice(i,0,newArea);
        j++;
      } else {
        const x = c1.x;
        if (x <= area.from.x|| x>=area.to.x) {
          continue;
        }
        const minY = Math.min(c1.y, c2.y);
        const maxY = Math.max(c1.y,c2.y);
        if (minY >= area.to.y || maxY <= area.from.y) {
          continue;
        }

        const newArea = {from: {x, y: area.from.y }, to: {x: area.to.x, y: area.to.y}};
        area.to.x = x;
        areas.splice(i,0,newArea);
        j++;
      }
    }
  }
  let maxArea = max(areas.filter(({from, to}) => from.x != 0 && from.y != 0 && from.x !== 100_000 && from.y !== 100_000 
  && to.x != 0 && to.y != 0 &&to.x !== 100_000 && to.y !== 100_000 ), 
  ({from ,to}) => (Math.abs(from.x - to.x) + 1) * (Math.abs(from.y - to.y) + 1));
  console.log
  console.log(areas, maxArea);
  return (Math.abs(maxArea.from.x - maxArea.to.x) + 1) * (Math.abs(maxArea.from.y - maxArea.to.y) + 1);
};

export function part1(input: string) {
  const coords = parseCoords(input);
  return getMaxArea(coords);
}

export function part2(input: string) {
  const coords = parseCoords(input);
  return subdivideArea(coords);
}


const sampleInput = `
7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3 
`.trim();

Deno.test("part1", async () => {
  assertEquals(part1(sampleInput), 50);
});

Deno.test("part2", async () => {
  assertEquals(part2(sampleInput), 24);
});
