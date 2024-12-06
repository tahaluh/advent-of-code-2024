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
const inputArray = input.split("\n").map((pair) => pair.split("   "));

const left = inputArray.map((line) => line[0]);
const right = inputArray.map((line) => line[1]);

const rightNumbersCount = new Map();

for (let i = 0; i < right.length; i++) {
  if (rightNumbersCount.has(right[i])) {
    rightNumbersCount.set(right[i], rightNumbersCount.get(right[i]) + 1);
  } else {
    rightNumbersCount.set(right[i], 1);
  }
}

const similarityScore = left.reduce((acc, number, index) => {
  return acc + (rightNumbersCount.get(number) || 0) * number;
}, 0);

console.log(similarityScore);
