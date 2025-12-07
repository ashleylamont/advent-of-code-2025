import run from "aocrunner";
import { Grid } from "../utils/grid.js";

const parseInput = (rawInput: string) => new Grid<'^'|'S'>(rawInput, '.');

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const splitLocations: Set<string> = new Set();

  for (const startPoint of input.points('S')) {
    const counted = new Set<string>();
    const frontier: {x: number; y: number}[] = [startPoint];

    while (frontier.length > 0) {
      const next = frontier.shift()!;
      if (counted.has(`${next.x}:${next.y}`)) continue;
      counted.add(`${next.x}:${next.y}`);

      if (next.y > input.maxY) continue;
      if (next.x < input.minX) continue;
      if (next.x > input.maxX) continue;

      if (input.getPoint(next.x, next.y) === '^') {
        frontier.push({
          x: next.x-1,
          y: next.y
        }, {
          x: next.x+1,
          y: next.y
        });
        splitLocations.add(`${next.x}:${next.y}`);
      } else {
        frontier.push({
          x: next.x,
          y: next.y + 1
        });
      }
    }
  }

  return splitLocations.size;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const pathCountCache: Map<string, number> = new Map();

  const getPathCountFrom = (x: number, y: number): number => {
    if (pathCountCache.has(`${x}:${y}`)) return pathCountCache.get(`${x}:${y}`)!;

    if (x > input.maxX || x < input.minX || y > input.maxY) {
      pathCountCache.set(`${x}:${y}`, 1);
      return 1;
    }

    if (input.getPoint(x,y) === '^') {
      const result = getPathCountFrom(x-1, y) + getPathCountFrom(x+1, y);
      pathCountCache.set(`${x}:${y}`, result);
      return result;
    } else {
      const result = getPathCountFrom(x, y+1);
      pathCountCache.set(`${x}:${y}`, result);
      return result;
    }
  }

  for (const startPoint of input.points('S')) {
    return getPathCountFrom(startPoint.x, startPoint.y);
  }
};

run({
  part1: {
    tests: [
      {
        input: `.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`,
        expected: 40,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
