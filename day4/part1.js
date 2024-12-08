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
  .split("\n")
  .map((line) => line.split(""));

const xLength = input[0].length;
const yLength = input.length;

// list all coordinates where appears the x character
const xCharCoordinates = input.flatMap((row, y) =>
  row.flatMap((char, x) => (char === "X" ? [[x, y]] : []))
);

// for each direction, check if the word XMAS is found
const directions = [
  [1, 0],
  [0, 1],
  [1, 1],
  [1, -1],
  [-1, 0],
  [0, -1],
  [-1, -1],
  [-1, 1],
];

let xmasCount = 0;

const targetWord = "XMAS";

for (const [x, y] of xCharCoordinates) {
  for (const [dx, dy] of directions) {
    let word = "";
    let currentX = x;
    let currentY = y;

    while (
      currentX >= 0 &&
      currentX < xLength &&
      currentY >= 0 &&
      currentY < yLength
    ) {
      word += input[currentY][currentX];
      if (word === targetWord) {
        xmasCount++;
        break;
      }
      currentX += dx;
      currentY += dy;
    }
  }
}

console.log(xmasCount);
