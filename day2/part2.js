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

const input = (await readFileContent("input.txt")).trim();
const inputArray = input.split("\n").map((line) => line.split(" "));

function isMonotonicAndWithinRange(numbers) {
  if (numbers.length <= 1) return true;

  let direction = 0;
  for (let i = 0; i < numbers.length - 1; i++) {
    const diff = numbers[i + 1] - numbers[i];
    const absDiff = Math.abs(diff);

    if (absDiff < 1 || absDiff > 3) return false;

    const currentDirection = diff > 0 ? 1 : -1;
    if (direction === 0) {
      direction = currentDirection;
    } else if (direction !== currentDirection) {
      return false;
    }
  }

  return true;
}

function isSafe(numbers) {
  if (isMonotonicAndWithinRange(numbers)) {
    return true;
  }

  for (let i = 0; i < numbers.length; i++) {
    const newSequence = numbers.slice(0, i).concat(numbers.slice(i + 1));
    if (isMonotonicAndWithinRange(newSequence)) {
      return true;
    }
  }

  return false;
}

const result = inputArray.filter(isSafe).length;
console.log(result);
