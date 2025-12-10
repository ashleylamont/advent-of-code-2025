import run from "aocrunner";
import * as yalps from "yalps";

interface Machine {
  indicatorLights: string;
  indicatorLightsBinary: number;
  buttonWiringSchematics: number[][];
  buttonWiringSchematicsBinary: number[];
  joltageRequirements: number[];
}

function recursiveCombinations<T>(arr: T[], k: number): T[][] {
  if (k <= 0) {
    return [];
  }
  const results: T[][] = [];
  for (let i = 0; i <= arr.length - k; i++) {
    const remaining = [...arr];
    remaining.splice(i, 1);
    if (k === 1) {
      results.push([arr[i]]);
    } else {
      const smallerCombinations = recursiveCombinations(remaining, k - 1);
      for (const combination of smallerCombinations) {
        results.push([arr[i], ...combination]);
      }
    }
  }
  return results;
}

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n").map((line) => line.trim());
  const machines: Machine[] = [];
  for (const line of lines) {
    const parts = line.split(" ");
    const indicatorLights = parts.shift()!.replace("[", "").replace("]", "");
    const joltageRequirements = parts
      .pop()!
      .replace("{", "")
      .replace("}", "")
      .split(",")
      .map(Number);
    const mappedParts = parts.map((part) =>
      part.replace("(", "").replace(")", "").split(",").map(Number),
    );
    machines.push({
      indicatorLights: indicatorLights,
      indicatorLightsBinary: indicatorLights
        .replaceAll(".", "0")
        .replaceAll("#", "1")
        .split("")
        .reduce((acc, curr) => acc * 2 + Number(curr), 0),
      buttonWiringSchematics: mappedParts,
      buttonWiringSchematicsBinary: mappedParts.map((schematic) =>
        schematic
          .map((value) => 1 << (indicatorLights.length - 1 - value))
          .reduce((acc, curr) => acc | curr, 0),
      ),
      joltageRequirements: joltageRequirements,
    });
  }
  return machines;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let stepCount = 0;

  machineLoop: for (const machine of input) {
    // Find the smallest subset of button wiring schematics that can produce the indicator lights through XOR operations
    for (
      let subsetSize = 1;
      subsetSize <= machine.buttonWiringSchematicsBinary.length;
      subsetSize++
    ) {
      for (const combination of recursiveCombinations(
        machine.buttonWiringSchematicsBinary,
        subsetSize,
      )) {
        // console.log(`Testing combination (${subsetSize}): ${combination.map(num => num.toString(2).padStart(machine.indicatorLights.length, '0')).join(', ')}`);
        const xorResult = combination.reduce((acc, curr) => acc ^ curr, 0);
        if (xorResult === machine.indicatorLightsBinary) {
          // Found a valid combination
          stepCount += subsetSize;
          continue machineLoop;
        }
      }
    }
  }

  return stepCount;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let stepCount = 0;

  for (const machine of input) {
    const model: yalps.Model = {
      objective: "totalSum",
      direction: "minimize",
      constraints: Object.fromEntries(
        machine.joltageRequirements.map((req, i) => [
          `var_${i}`,
          {
            equal: req,
          },
        ]),
      ),
      variables: Object.fromEntries(
        machine.buttonWiringSchematics.map((schematic, i) => [
          `button_${i}`,
          {
            totalSum: 1,
            ...Object.fromEntries(
              schematic.map((buttonIndex) => [`var_${buttonIndex}`, 1]),
            ),
          },
        ]),
      ),
      integers: machine.buttonWiringSchematics.map((_, i) =>`button_${i}`),
    };
    const results = yalps.solve(model);
    stepCount += results.result;
  }

  return stepCount;
};

run({
  part1: {
    tests: [
      {
        input: `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`,
        expected: 7,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`,
        expected: 33,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
