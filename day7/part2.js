import { promises as fs } from "fs";

async function readFileContent(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return data;
  } catch (err) {
    console.error("Error reading the file:", err);
    process.exit(1);
  }
}

const input = (await readFileContent("input.txt"))
  .trim()
  .split("\n")
  .map((line) => {
    const splitedLine = line.split(":");
    return [splitedLine[0], splitedLine[1].trim().split(" ")];
  });

const randomIndex = Math.floor(Math.random() * input.length);

const operators = ["+", "*", "||"];

function generatePermutations(possibilities, length, currentSequence = []) {
  const results = [];

  function backtrack(seq) {
    if (seq.length === length) {
      results.push([...seq]);
      return;
    }

    for (const op of possibilities) {
      seq.push(op);
      backtrack(seq);
      seq.pop();
    }
  }

  backtrack(currentSequence);
  return results;
}

function calculateExpression(numbers, operations) {
  let result = parseInt(numbers[0]);
  for (let i = 0; i < operations.length; i++) {
    const number = parseInt(numbers[i + 1]);
    const operation = operations[i];

    switch (operation) {
      case "+":
        result += number;
        break;
      case "*":
        result *= number;
        break;
      case "||":
        result = +`${result}${number}`;
        break;
      default:
        throw new Error("Invalid operation");
    }
  }

  return result;
}

function canBeSolved(expression, index) {
  const [value, numbers] = expression;

  const possibleOrders = generatePermutations(operators, numbers.length - 1);

  for (const possibleResult of possibleOrders) {
    const result = calculateExpression(numbers, possibleResult);
    if (result === parseInt(value)) {
      return true;
    }
  }

  return false;
}

const validExpressions = input.filter(canBeSolved);
const sumValues = validExpressions.reduce(
  (acc, [value]) => acc + parseInt(value),
  0
);

console.log(validExpressions.length);
console.log(sumValues);
