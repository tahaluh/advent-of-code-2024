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

// list all coordinates where appears the A character
const aCharCoordinates = input.flatMap((row, y) =>
  row.flatMap((char, x) => (char === "A" ? [[x, y]] : []))
);

// for every A character, check if the word MAS is for each diagonal
let xMasCount = 0;

function isXMas(x, y, input) {
  // verify if the character is in the border
  if (x <= 0 || y <= 0 || x >= input[0].length - 1 || y >= input.length - 1) {
    return false;
  }

  const upLeftChar = input[y - 1][x - 1];
  const downRightChar = input[y + 1][x + 1];
  const upRightChar = input[y - 1][x + 1];
  const downLeftChar = input[y + 1][x - 1];

  return !(
    (upLeftChar === "M" && downRightChar === "S") ||
    (upLeftChar === "S" && downRightChar === "M")
  ) ||
    !(
      (upRightChar === "M" && downLeftChar === "S") ||
      (upRightChar === "S" && downLeftChar === "M")
    )
    ? false
    : true;
}

for (const [x, y] of aCharCoordinates) {
  if (isXMas(x, y, input)) {
    xMasCount++;
  }
}

console.log(xMasCount);
