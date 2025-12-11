import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n");
  const devices: [deviceName: string, linksTo: string[]][] = [];
  for (const line of lines) {
    const [deviceName, rest] = line.split(": ");
    const linksTo = rest.split(" ");
    devices.push([deviceName, linksTo]);
  }
  return Object.fromEntries(devices);
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const pathsFrom: Map<string, number> = new Map();
  function countPathsOutFrom(device: string): number {
    // console.log(`Counting paths from ${device}`);
    if (pathsFrom.has(device)) {
      // console.log(`  Cached value found: ${pathsFrom.get(device)}`);
      return pathsFrom.get(device)!;
    }
    let totalPaths = 0;
    for (const linkedDevice of input[device]) {
      // console.log(`  Following link to ${linkedDevice} from ${device}`);
      if (linkedDevice === "out") {
        // console.log(`    Reached 'out' from ${device}`);
        totalPaths += 1;
      } else {
        totalPaths += countPathsOutFrom(linkedDevice);
        // console.log(`    ${countPathsOutFrom(linkedDevice)} paths from ${linkedDevice} added to total for ${device}`);
      }
    }
    pathsFrom.set(device, totalPaths);
    return totalPaths;
  }

  for (const device in input) {
    countPathsOutFrom(device);
  }

  return pathsFrom.get("you") ?? 0;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const pathsFrom: Map<string, number> = new Map();
  const pathKey = (device: string, hasVisitedDac: boolean, hasVisitedFft: boolean) =>
    `${device}|${hasVisitedDac ? 1 : 0}|${hasVisitedFft ? 1 : 0}`;
  function countPathsOutFrom(
    device: string,
    hasVisitedDac: boolean = false,
    hasVisitedFft: boolean = false,
  ): number {
    if (pathsFrom.has(pathKey(device, hasVisitedDac, hasVisitedFft))) {
      return pathsFrom.get(
        pathKey(device, hasVisitedDac, hasVisitedFft),
      )!;
    }

    let totalPaths = 0;
    for (const linkedDevice of input[device]) {
      if (linkedDevice === "out") {
        if (
          (hasVisitedDac || device === "dac") &&
          (hasVisitedFft || device === "fft")
        ) {
          totalPaths += 1;
        }
      } else {
        totalPaths += countPathsOutFrom(
          linkedDevice,
          hasVisitedDac || device === "dac",
          hasVisitedFft || device === "fft",
        );
      }
    }
    pathsFrom.set(
      pathKey(device, hasVisitedDac, hasVisitedFft),
      totalPaths,
    );
    return totalPaths;
  }

  return countPathsOutFrom("svr");
};

run({
  part1: {
    tests: [
      {
        input: `aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out`,
        expected: 5,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out`,
        expected: 2,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
