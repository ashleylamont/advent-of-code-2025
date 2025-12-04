import run from "aocrunner";
import { Grid } from "../utils/grid.js";

const parseInput = (rawInput: string) => new Grid<"@">(rawInput, ".");

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  // console.log(input.toString())

  // const debugGrid = input.clone<'@'|'x'>();
  let validLocations = 0;
  for (const { x, y } of input.points()) {
    if (input.getNeighbors(x, y, false).length < 4) {
      // debugGrid.setPoint(x, y, 'x');
      validLocations += 1;
    }
  }

  // console.log(debugGrid.toString())

  return validLocations;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let validLocations = 0;
  const grid = input.clone<'@' | 'x'>();
  while (true) {
    let deletedPoints = 0;
    for (const { x, y } of grid.points()) {
      if (grid.getNeighbors(x, y, false).length < 4) {
        validLocations += 1;
        grid.setPoint(x, y, 'x');
        deletedPoints += 1;
      }
    }

    if (deletedPoints === 0) {
      break;
    }
    // console.log(`Deleted points: ${deletedPoints}`);
    for (const {x,y} of grid.points('x')) {
      grid.deletePoint(x, y);
    }
  }

  return validLocations;
};

run({
  part1: {
    tests: [
      {
        input: `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`,
        expected: 43,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
