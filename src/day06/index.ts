import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const problems: {operation: 'add'|'multiply', values: number[], strings: string[]}[] = [];
  const rows = rawInput.split('\n');
  const operationRow = rows.pop()!;
  const indexes: number[] = [];
  for (let i = 0; i < operationRow.length; i++) {
    if (operationRow[i] !== ' ') {
      indexes.push(i);
    }
  }
  indexes.push(rows[0].length);
  const columns: string[][] = new Array(indexes.length).fill(0).map((()=>[]));
  for (const row of rows) {
    for (let i = 0; i < indexes.length - 1; i++ ) {
      columns[i].push(row.slice(indexes[i], indexes[i+1]));
    }
  }
  for (let i = 0; i < indexes.length - 1; i++) {
    problems.push({
      operation: operationRow.slice(indexes[i], indexes[i+1]).trim() === '+' ? 'add' : 'multiply',
      values: columns[i].map(Number),
      strings: columns[i]
    })
  }
  // console.log(problems);
  return problems;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let sum = 0;
  for (const problem of input) {
    if (problem.operation === 'add') {
      sum += problem.values.reduce((a,b)=>a+b);
    } else {
      sum += problem.values.reduce((a,b)=>a*b);
    }
  }
  return sum;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let sum = 0;
  for (const problem of input) {
    const verticalValues: number[] = [];
    for (let i = problem.strings[0].length; i >= 0; i--) {
      let number = '';
      for (const stringValue of problem.strings) {
        if (stringValue.charAt(i).trim()) {
          number += stringValue.charAt(i);
        }
      }
      if (number.length > 0) {
        verticalValues.push(Number(number));
      }
    }
    if (problem.operation === 'add') {
      sum += verticalValues.reduce((a,b)=>a+b);
    } else {
      sum += verticalValues.reduce((a,b)=>a*b);
    }
  }

  return sum;
};

run({
  part1: {
    tests: [
      {
        input: `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +`,
        expected: 4277556,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +`,
        expected: 3263827,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
