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

const sortedLeft = left.sort();
const sortedRight = right.sort();

let totalDistance = 0;
for (let i = 0; i < sortedLeft.length; i++) {
  const localDistance = sortedLeft[i] - sortedRight[i];
  totalDistance += Math.abs(sortedLeft[i] - sortedRight[i]);
}

console.log(totalDistance);
