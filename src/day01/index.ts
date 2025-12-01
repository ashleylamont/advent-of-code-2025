import run from "aocrunner";

const parseInput = (rawInput: string) => {
  return rawInput.split("\n").map(line => ({
    direction: line[0] as 'L' | 'R',
    value: parseInt(line.slice(1), 10),
  }));
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let zeroCount = 0;

  let value = 50;
  for (const instruction of input) {
    const multiplier = instruction.direction === 'L' ? -1 : 1;
    value += instruction.value * multiplier;
    while (value < 0) value += 100;
    while (value >= 100) value -= 100;
    if (value === 0) zeroCount++;
  }

  return zeroCount;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let zeroCount = 0;

  let value = 50;
  for (const instruction of input) {
    const multiplier = instruction.direction === 'L' ? -1 : 1;
    for (let i = 0; i < instruction.value; i++) {
      value += multiplier;
      if (value === -1) value = 99;
      if (value === 100) value = 0;
      if (value === 0) zeroCount += 1;
    }
  }

  return zeroCount;
};

run({
  part1: {
    tests: [
      {
        input: `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`,
        expected: 3,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
