type LinkedList = {
  next: LinkedList;
  prev: LinkedList;
  value: number;
  originalIndex: number;
};

function parseNumbers(lines: string[]): number[] {
  return lines.map((l) => parseInt(l));
}

function arrayToLinkedList(arr: number[]): LinkedList {
  const head: LinkedList = {
    next: undefined,
    prev: undefined,
    value: arr[0],
    originalIndex: 0,
  } as unknown as LinkedList;
  let curr: LinkedList = head as unknown as LinkedList;
  for (let i = 1; i < arr.length; i++) {
    const newElem = {
      next: undefined,
      prev: curr,
      value: arr[i],
      originalIndex: i,
    } as unknown as LinkedList;
    curr.next = newElem;
    curr = newElem;
  }
  curr.next = head;
  head.prev = curr;
  return head;
}

function rotate(arr: number[]): number[] {
  return [...arr.slice(1), arr[0]];
}

function findInLinkedList(linkedList: LinkedList, value: number): LinkedList {
  return findInLinkedListPredicate(linkedList, (e) => e.value === value);
}

function findInLinkedListPredicate(
  linkedList: LinkedList,
  predicate: (elem: LinkedList) => boolean
): LinkedList {
  while (!predicate(linkedList)) {
    linkedList = linkedList.next;
  }
  return linkedList;
}

function printList(linkedList: LinkedList): void {
  let elems: number[] = [];
  const head = linkedList;
  let curr = linkedList.next;
  elems.push(head.value);
  while (curr !== head) {
    elems.push(curr.value);
    curr = curr.next;
  }
  console.log(elems.join(', '));
}

function iterateNumbers(
  count: number,
  linkedList: LinkedList,
  nextNumbers: number[]
): LinkedList {
  while (true) {
    //printList(linkedList);
    if (count === 0) {
      return linkedList;
    }
    const numberToShift = nextNumbers[0];

    if (numberToShift !== 0 && numberToShift % (nextNumbers.length - 1) !== 0) {
      const currentElement = findInLinkedListPredicate(
        linkedList,
        (e) => e.originalIndex === nextNumbers.length - count
      );
      const prevElement = currentElement.prev;
      const nextElement = currentElement.next;
      prevElement.next = nextElement;
      nextElement.prev = prevElement;

      if (numberToShift > 0) {
        let iterate = nextElement;
        let movements = numberToShift % (nextNumbers.length - 1);
        for (let m = movements; m > 1; m--) {
          iterate = iterate.next;
        }

        const newNext = iterate.next;
        iterate.next = currentElement;
        currentElement.prev = iterate;
        currentElement.next = newNext;
        newNext.prev = currentElement;
      } else {
        let iterate = prevElement;
        let movements = numberToShift % (nextNumbers.length - 1);
        for (let m = movements; m < -1; m++) {
          iterate = iterate.prev;
        }

        const newPrev = iterate.prev;
        iterate.prev = currentElement;
        currentElement.next = iterate;
        currentElement.prev = newPrev;
        newPrev.next = currentElement;
      }
    }
    count--;
    nextNumbers = rotate(nextNumbers);
  }
}

function numberAfter0(numbers: LinkedList, count: number): number {
  let curr = numbers;
  while (curr.value !== 0) {
    curr = curr.next;
  }
  for (let c = count; c > 0; c--) {
    curr = curr.next;
  }

  return curr.value;
}

export function part1(lines: string[]): number {
  const numbers = parseNumbers(lines);
  const numberList = arrayToLinkedList(numbers);
  const mixed = iterateNumbers(numbers.length, numberList, numbers);
  const n1 = numberAfter0(mixed, 1000);
  const n2 = numberAfter0(mixed, 2000);
  const n3 = numberAfter0(mixed, 3000);
  return n1 + n2 + n3;
}

export function part2(lines: string[]): number {
  const numbers = parseNumbers(lines).map((n) => n * 811589153);
  const numberList = arrayToLinkedList(numbers);
  let mixed = numberList;
  for (let i = 0; i < 10; i++) {
    mixed = iterateNumbers(numbers.length, mixed, numbers);
  }
  const n1 = numberAfter0(mixed, 1000);
  const n2 = numberAfter0(mixed, 2000);
  const n3 = numberAfter0(mixed, 3000);
  return n1 + n2 + n3;
}
