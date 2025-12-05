import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const [rangesPart, valuesPart] = rawInput.split("\n\n");

  const ranges = rangesPart.split("\n").map(line => {
    const [start, end] = line.split("-").map(Number);
    return { start, end };
  });

  ranges.sort((a, b) => a.start - b.start);

  const orderedRanges: [number, number][] = [];
  let activeRangeStart: number|undefined = undefined;
  const activeRanges: {start: number, end: number}[] = [];

  for (const range of ranges) {
    // Before processing this range, check if any active ranges can be closed
    let lastActiveRangeClose = -1;
    if (activeRanges.length > 0) {
      for (let i = activeRanges.length - 1; i >= 0; i--) {
        const activeRange = activeRanges[i];
        if (range.start > activeRange.end) {
          lastActiveRangeClose = Math.max(lastActiveRangeClose, activeRange.end);
          activeRanges.splice(i, 1);
        }
      }
      // If we closed all active ranges, record the ordered range
      if (activeRanges.length === 0 && activeRangeStart !== undefined) {
        orderedRanges.push([activeRangeStart, lastActiveRangeClose]);
        activeRangeStart = undefined;
      }
    }

    if (activeRanges.length === 0) {
      activeRanges.push(range);
      activeRangeStart = range.start;
    } else {
      activeRanges.push(range);
    }
  }

  if (activeRanges.length > 0 && activeRangeStart !== undefined) {
    let lastActiveRangeClose = -1;
    for (const activeRange of activeRanges) {
      lastActiveRangeClose = Math.max(lastActiveRangeClose, activeRange.end);
    }
    orderedRanges.push([activeRangeStart, lastActiveRangeClose]);
  }

  const values = valuesPart.split("\n").map(Number);

  return { ranges, values, orderedRanges };
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let valuesInRanges = 0;
  for (const value of input.values) {
    for (const [start, end] of input.orderedRanges) {
      if (value >= start && value <= end) {
        valuesInRanges += 1;
        break;
      }
    }
  }

  return valuesInRanges;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.orderedRanges.reduce((acc, [start, end]) => acc + (end - start + 1), 0);
};

run({
  part1: {
    tests: [
      {
        input: `3-5
10-14
16-20
12-18

1
5
8
11
17
32`,
        expected: 3,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `3-5
10-14
16-20
12-18

1
5
8
11
17
32`,
        expected: 14,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
