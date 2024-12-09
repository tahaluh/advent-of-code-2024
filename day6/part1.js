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
  .map((line) => line.split(""));

const xLength = input[0].length;
const yLength = input.length;

const directions = [
  [0, -1], // up
  [1, 0], // right
  [0, 1], // down
  [-1, 0], // left
];

function getNextDirection(currentDirection) {
  return (currentDirection + 1) % 4;
}

function moveForward(x, y, direction) {
  return [x + directions[direction][0], y + directions[direction][1]];
}

// find x and y of char ^
const guardInitialCoordinates = input.reduce((acc, row, y) => {
  const x = row.indexOf("^");
  if (x !== -1) {
    acc.push(x, y);
  }
  return acc;
}, []);

// find guard path, every time the guard hits a #, it turns right
const guardPath = [guardInitialCoordinates];
let direction = 0;
while (true) {
  const [x, y] = guardPath[guardPath.length - 1];
  let [nextX, nextY] = moveForward(x, y, direction);

  if (nextX < 0 || nextX >= xLength || nextY < 0 || nextY >= yLength) {
    break;
  }

  if (input[nextY][nextX] === "#") {
    direction = getNextDirection(direction);
    continue;
  }

  guardPath.push([nextX, nextY]);
}

const uniquePathPositions = new Set();
guardPath.forEach(([x, y]) => uniquePathPositions.add(`${x},${y}`));

console.log(uniquePathPositions.size);
