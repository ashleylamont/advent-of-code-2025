import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split('\n').map(line => line.trim().split('').map(Number));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let totalJoltage = 0;
  for (const batteryBank of input) {
    let highestJoltage = 0;
    let startingBattery = 0;
    for (let i = 0; i < batteryBank.length - 1; i++) {
      const currentBattery = batteryBank[i];
      if (currentBattery > highestJoltage) {
        highestJoltage = currentBattery;
        startingBattery = i;
      }
    }
    let nextHighestJoltage = 0;
    let nextBattery = startingBattery + 1;
    for (let j = startingBattery + 1; j < batteryBank.length; j++) {
      const currentBattery = batteryBank[j];
      if (currentBattery > nextHighestJoltage) {
        nextHighestJoltage = currentBattery;
        nextBattery = j;
      }
    }
    totalJoltage += highestJoltage * 10 + nextHighestJoltage;
  }

  return totalJoltage;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let totalJoltage = 0;
  for (const batteryBank of input) {
    const batteries: number[] = [];
    let batteriesFrom = 0;
    for (let i = 0; i < 12; i++) {
      // Find the next highest battery
      let nextHighestJoltage = 0;
      let nextBattery = batteriesFrom;
      for (let j = batteriesFrom; j < batteryBank.length - 11 + i; j++) {
        const currentBattery = batteryBank[j];
        if (currentBattery > nextHighestJoltage) {
          nextHighestJoltage = currentBattery;
          nextBattery = j;
        }
      }
      batteries.push(nextHighestJoltage);
      batteriesFrom = nextBattery + 1;
    }
    // console.log(`batteries: ${batteries.join('')}`);
    totalJoltage += batteries.reduce((acc, curr) => acc * 10 + curr, 0);
  }

  return totalJoltage
};

run({
  part1: {
    tests: [
      {
        input: `987654321111111
811111111111119
234234234234278
818181911112111`,
        expected: 357,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `987654321111111
811111111111119
234234234234278
818181911112111`,
        expected: 3121910778619,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
