import run from "aocrunner";

const parseInput = (rawInput: string) => {
  return rawInput.split('\n').map((line)=>line.trim().split(',').map(Number) as [x: number, y: number, z: number]);
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const isTest = input.length < 50;

  const pairsByDistance: [distance: number, points: [point1: [x: number, y: number, z: number], point2: [x: number, y: number, z: number]]][] = [];

  for (let i = 0; i < input.length; i++) {
    const firstPoint = input[i];
    for (let j = i + 1; j < input.length; j++) {
      const secondPoint = input[j];
      const distance = Math.sqrt(
        Math.pow(firstPoint[0]-secondPoint[0], 2) +
        Math.pow(firstPoint[1]-secondPoint[1], 2) +
        Math.pow(firstPoint[2]-secondPoint[2], 2)
      );
      pairsByDistance.push([
        distance,
        [firstPoint, secondPoint]
      ]);
    }
  }

  pairsByDistance.sort((a,b)=>b[0]-a[0]);

  let junctions = input.map((point)=>[point]);
  for (let i = 0; i < (isTest ? 10 : 1000); i++) {
    const nextPair = pairsByDistance.pop()!;
    const firstPairJunction = junctions.find((junction)=>junction.includes(nextPair[1][0]))!;
    const secondPairJunction = junctions.find((junction)=>junction.includes(nextPair[1][1]))!;
    if (firstPairJunction !== secondPairJunction) {
      firstPairJunction.push(...secondPairJunction);
      junctions.splice(junctions.indexOf(secondPairJunction), 1);
    }
  }
  junctions.sort((a,b)=>b.length - a.length);
  return junctions[0].length * junctions[1].length * junctions[2].length;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const isTest = input.length < 50;

  const pairsByDistance: [distance: number, points: [point1: [x: number, y: number, z: number], point2: [x: number, y: number, z: number]]][] = [];

  for (let i = 0; i < input.length; i++) {
    const firstPoint = input[i];
    for (let j = i + 1; j < input.length; j++) {
      const secondPoint = input[j];
      const distance = Math.sqrt(
        Math.pow(firstPoint[0]-secondPoint[0], 2) +
        Math.pow(firstPoint[1]-secondPoint[1], 2) +
        Math.pow(firstPoint[2]-secondPoint[2], 2)
      );
      pairsByDistance.push([
        distance,
        [firstPoint, secondPoint]
      ]);
    }
  }

  pairsByDistance.sort((a,b)=>b[0]-a[0]);

  let junctions = input.map((point)=>[point]);
  while (junctions.length > 1) {
    const nextPair = pairsByDistance.pop()!;
    const firstPairJunction = junctions.find((junction)=>junction.includes(nextPair[1][0]))!;
    const secondPairJunction = junctions.find((junction)=>junction.includes(nextPair[1][1]))!;
    if (firstPairJunction !== secondPairJunction) {
      if (junctions.length === 2) {
        return nextPair[1][0][0] * nextPair[1][1][0];
      }
      firstPairJunction.push(...secondPairJunction);
      junctions.splice(junctions.indexOf(secondPairJunction), 1);
    }
  }
};

run({
  part1: {
    tests: [
      {
        input: `162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`,
        expected: 40,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`,
        expected: 25272,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
