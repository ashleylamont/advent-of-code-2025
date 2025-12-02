import run from "aocrunner";

const parseInput = (rawInput: string) => {
  return rawInput.split(",").map(range => {
    const [start, end] = range.split("-").map(Number);
    return { start, end };
  });
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let invalidTotal = 0;

  for (const { start, end } of input) {
    for (let id = start; id <= end; id++) {
      const idStr = id.toString();
      const left = idStr.substring(0, Math.floor(idStr.length / 2));
      const right = idStr.substring(Math.floor(idStr.length / 2));
      if (left === right) {
        invalidTotal += id;
      }
    }
  }

  return invalidTotal;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let invalidTotal = 0;

  for (const { start, end } of input) {
    for (let id = start; id <= end; id++) {
      const idStr = id.toString();
      for (let substringSize = 1; substringSize <= Math.floor(idStr.length / 2); substringSize++) {
        if (idStr.length % substringSize !== 0) continue;
        const substrings: string[] = [];
        for (let i = 0; i <= idStr.length - substringSize; i += substringSize) {
          substrings.push(idStr.substring(i, i + substringSize));
        }
        const allEqual = substrings.every(s => s === substrings[0]);
        if (allEqual) {
          invalidTotal += id;
          break;
        }
      }
    }
  }

  return invalidTotal;
};

run({
  part1: {
    tests: [
      {
        input: `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,
1698522-1698528,446443-446449,38593856-38593862,565653-565659,
824824821-824824827,2121212118-2121212124
`,
        expected: 1227775554,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,
1698522-1698528,446443-446449,38593856-38593862,565653-565659,
824824821-824824827,2121212118-2121212124
`,
        expected: 4174379265,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
