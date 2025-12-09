import run from "aocrunner";
import { Grid } from "../utils/grid.js";

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map((line) => line.split(",").map(Number) as [x: number, y: number]);

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let biggestPairSize = 0;

  for (let i = 0; i < input.length; i++) {
    for (let j = i + 1; j < input.length; j++) {
      const [x1, y1] = input[i];
      const [x2, y2] = input[j];

      const area = (Math.abs(x1 - x2) + 1) * (Math.abs(y1 - y2) + 1);
      if (area > biggestPairSize) {
        biggestPairSize = area;
      }
    }
  }

  return biggestPairSize;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const fullEdge: [number, number][] = [];

  const significantXValues = new Set<number>();
  const significantYValues = new Set<number>();

  for (const point of input) {
    significantXValues.add(point[0]);
    significantXValues.add(point[0]+1);
    significantXValues.add(point[0]-1);

    significantYValues.add(point[1]);
    significantYValues.add(point[1]+1);
    significantYValues.add(point[1]-1);
  }

  let lastPoint = input[input.length - 1];
  for (const point of input) {
    const [x1, y1] = lastPoint;
    const [x2, y2] = point;
    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
      for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
        if (!significantXValues.has(x) && !significantYValues.has(y)) {
          continue;
        }
        fullEdge.push([x, y]);
      }
    }
    lastPoint = point;
  }

  let biggestThreeEdgePairSize = 0;
  let biggestThreeEdges: [number, number][] | null = null;

  for (let i = 0; i < input.length; i++) {
    for (let j = i + 1; j < input.length; j++) {
      const [x1, y1] = input[i];
      const [x2, y2] = input[j];

      // We can't have any other corners *inside* the area (edges are ok)
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);

      let hasInnerPoints = false;
      for (const edgePoint of fullEdge) {
        if (edgePoint[0] > minX && edgePoint[0] < maxX && edgePoint[1] > minY && edgePoint[1] < maxY) {
          hasInnerPoints = true;
          break;
        }
      }

      if (hasInnerPoints) {
        continue;
      }

      const area = (Math.abs(minX - maxX) + 1) * (Math.abs(minY - maxY) + 1);

      if (area > biggestThreeEdgePairSize) {
        biggestThreeEdgePairSize = area;
        biggestThreeEdges = [input[i], input[j]];
      }
    }
  }

  console.log(biggestThreeEdges);

  return biggestThreeEdgePairSize;
};

run({
  part1: {
    tests: [
      {
        input: `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`,
        expected: 50,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`,
        expected: 24,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
