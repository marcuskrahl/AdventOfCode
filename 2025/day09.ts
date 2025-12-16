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
  //console.log
  //console.log(areas, maxArea);
  return (Math.abs(maxArea.from.x - maxArea.to.x) + 1) * (Math.abs(maxArea.from.y - maxArea.to.y) + 1);
};

// The coordinates here have to be probably also reversed because we are only expanding every edge in one dimension while we probably need both dimensions.
// But it gets the job done for my input ;)
function cornerExtension(coords: Coord[]): number {

  let dividers = [];
  for (let i = 1; i < coords.length; i++) {
    dividers.push({from: coords[i-1], to: coords[i], horizontal: coords[i-1].y === coords[i].y});
  }
  dividers.push({from: coords.at(-1)!, to: coords[0], horizontal: coords.at(-1)!.y === coords[0].y});
  const horizontalDividers = dividers.filter(d => d.horizontal);
  const verticalDividers = dividers.filter(d => !d.horizontal);

  let maxArea = 0;
    for (let i=1; i < dividers.length; i++) {
      const d1 = dividers[i-1];
      const d2 = dividers[i];



      const from = { x: d1.to.x, y: d1.to.y };
      let x = from.x - Math.sign(d1.to.x - d1.from.x) / 2;
      let y = from.y - Math.sign(d1.to.y - d1.from.y) / 2;

      //find next corner; 
      let dx = Math.sign(d2.to.x - d2.from.x);
      let dy = Math.sign(d2.to.y - d2.from.y);
      let wrongCorner = false;
      while(true) {
        x += dx;
        y += dy;
        if (x <=0) {
          wrongCorner = true;
          break;
        }
        if (x >= 100_000) {
          wrongCorner = true;
          break;
        }
        if (y <= 0) {
          wrongCorner = true;
          break;
        }
        if (y >= 100_000) {
          wrongCorner = true;
          break;
        }
        if (!d1.horizontal && verticalDividers.some(d => d.from.x === x && d.from.y <= y && d.to.y >= y)) {
          //reached edge
          break;
        }
        if (d1.horizontal && horizontalDividers.some(d => d.from.y === y && d.from.x <= x && d.to.x >= x)) {
          //reached edge
          break;
        }
      }
      if (wrongCorner) {
        continue;
      }
      


      x += Math.sign(d1.to.x - d1.from.x) / 2;
      y += Math.sign(d1.to.y - d1.from.y) / 2;

      const ox = x;
      const oy = y;
      //console.log(d1,d2);
      //console.log('opposite corner ', x,y);

      dx = -1 * Math.sign(d1.to.x - d1.from.x);
      dy = -1 * Math.sign(d1.to.y - d1.from.y);

      let rx = 0;
      let ry = 0;

      while(true) {
        x += dx;
        y += dy;
        if (x <=0) {
          wrongCorner = true;
          break;
        }
        if (x >= 100_000) {
          wrongCorner = true;
          break;
        }
        if (y <= 0) {
          wrongCorner = true;
          break;
        }
        if (y >= 100_000) {
          wrongCorner = true;
          break;
        }
        const matchingFrom = coords.find(d => d.x === x && d.y === y || d1.horizontal && d.x === x && d.y === from.y || !d1.horizontal && d.x === from.x && d.y === y);
        if (matchingFrom != undefined) {
          rx = matchingFrom.x;
          ry = matchingFrom.y;
          //console.log('result corner', rx,ry);
        }
        if (!d1.horizontal && horizontalDividers.some(d => d.from.y === y && !(Math.max(d.from.x, d.to.x) <= Math.min(from.x, ox) || Math.min(d.from.x,d.to.x) >= Math.max(from.x, ox)))) {
          break;
        }
         if (d1.horizontal && verticalDividers.some(d => d.from.x === x && !(Math.max(d.from.y, d.to.y) <= Math.min(from.y, oy) ||  Math.min(d.from.y,d.to.y) >= Math.max(from.y, oy)))) {
          break;
        }
        /*if (dividers.some(d => d.from.x === x && d.from.y === y) )
        if (!d1.horizontal && verticalDividers.some(d => d.from.x === x && d.from.y <= y && d.to.y >= y)) {
          //reached edge
          break;
        }
        if (d1.horizontal && horizontalDividers.some(d => d.from.y === y && d.from.x <= x && d.to.x >= x)) {
          //reached edge
          break;
        }*/
      }
      if (wrongCorner) {
        continue;
      }
      if (rx === 0 || ry === 0) {
        continue;
      }
      if (d1.horizontal && ry === from.y) {
        from.y = oy;
      }
      if (!d1.horizontal && rx === from.x) {
        from.x = ox;
      }
      if (!coords.some(c => c.x === from.x && c.y === from.y)) {
        continue;
      }
      if (!coords.some(c => c.x === rx && c.y === ry)) {
        continue;
      }
      const area = (Math.abs (from.x - rx) + 1) * (Math.abs(from.y - ry) + 1);
      if (area > maxArea) {
      console.log(area);
        maxArea = area;
      }
    }
  
  return maxArea;
}

export function part1(input: string) {
  const coords = parseCoords(input);
  return getMaxArea(coords);
}

export function part2(input: string) {
  const coords = parseCoords(input);
  return cornerExtension(coords);
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
