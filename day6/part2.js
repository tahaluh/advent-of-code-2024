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
    acc.push(x, y, 0);
  }
  return acc;
}, []);

// find guard path, every time the guard hits a #, it turns right
// find every position to place a # and create a loop
function getPath(x, y, initialDirection) {
  const path = [[x, y, initialDirection]];
  let direction = 0;
  while (true) {
    const [x, y] = path[path.length - 1];
    let [nextX, nextY] = moveForward(x, y, direction);

    if (nextX < 0 || nextX >= xLength || nextY < 0 || nextY >= yLength) {
      break;
    }

    if (input[nextY][nextX] === "#") {
      direction = getNextDirection(direction);
      continue;
    }

    path.push([nextX, nextY, direction]);
  }
  return path;
}

const guardPath = getPath(...guardInitialCoordinates);

const uniquePathPositions = guardPath.reduce((acc, [x, y, direction]) => {
  return acc.some(([ax, ay]) => ax === x && ay === y)
    ? acc
    : [...acc, [x, y, direction]];
}, []);

function createsALoop(
  initialX,
  initialY,
  initialDirection,
  inputWithModification
) {
  let [x, y] = [initialX, initialY];
  let direction = initialDirection;
  let nextX, nextY;
  const visited = new Set();
  const key = (x, y, d) => `${x},${y},${d}`;

  while (true) {
    if (visited.has(key(x, y, direction))) return true;
    visited.add(key(x, y, direction));

    [nextX, nextY] = moveForward(x, y, direction);

    if (nextX < 0 || nextX >= xLength || nextY < 0 || nextY >= yLength) {
      return false;
    }

    if (inputWithModification[nextY][nextX] === "#") {
      direction = getNextDirection(direction);
      continue;
    }

    [x, y] = [nextX, nextY];
  }
}

// find all paths that have a # on a line on the right and not have a # on the front
const initialTime = Date.now();
const intersections = uniquePathPositions.filter(
  ([x, y, direction], index, path) => {
    console.log(`${index}/${path.length}`);

    if (index === 0) return false;

    if (x < 0 || x >= xLength || y < 0 || y >= yLength || input[y][x] === "#")
      return false;

    const inputWithModification = input;

    inputWithModification[y][x] = "#";
    const result = createsALoop(
      guardInitialCoordinates[0],
      guardInitialCoordinates[1],
      0,
      inputWithModification
    );
    // inputWithModification[y][x] = ".";
    return result;
  }
);
const finalTime = Date.now();

console.log(`${intersections.length}/${uniquePathPositions.length}`);
console.log(`Time: ${finalTime - initialTime}ms`);
