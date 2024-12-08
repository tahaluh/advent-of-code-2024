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

// crescent order or decrescent order
// 1-3 diff for adjacent numbers
const isSafe = (numbers) => {
  let globalDirection = 0;

  for (let i = 0; i < numbers.length - 1; i++) {
    const diff = numbers[i + 1] - numbers[i];
    let direction = diff > 0 ? 1 : -1;
    const absDiff = Math.abs(diff);

    if (absDiff > 3 || absDiff < 1) return false;
    if (globalDirection === 0) {
      globalDirection = direction;
    } else if (globalDirection !== direction) {
      return false;
    }
  }

  return true;
};

const result = inputArray.filter(isSafe).length;
console.log(result);
