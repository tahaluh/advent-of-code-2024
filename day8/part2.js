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
const inputArray = input.split("\n").map((line) => line.split(""));
const x = inputArray[0].length;
const y = inputArray.length;

const charCount = new Map();

for (let i = 0; i < inputArray[0].length; i++) {
  const line = inputArray[i];

  for (let j = 0; j < line.length; j++) {
    const char = line[j];

    if (char === ".") {
      continue;
    }

    if (!charCount.has(char)) {
      charCount.set(char, 0);
    }

    charCount.set(char, charCount.get(char) + 1);
  }
}

// for every pair of igual chars, calculate the distance between them and add the antinode coordinates to a array
const antinodeCoordinates = [];
const charArray = Array.from(charCount.keys());

for (const char of charArray) {
  const charsCoordinates = [];

  for (let i = 0; i < inputArray.length; i++) {
    const line = inputArray[i];

    for (let j = 0; j < line.length; j++) {
      if (line[j] === char) {
        charsCoordinates.push([i, j]);
      }
    }
  }

  // for every possible par of coordinates, calculate the distance between them
  for (let i = 0; i < charsCoordinates.length; i++) {
    for (let j = i + 1; j < charsCoordinates.length; j++) {
      const distanceX = charsCoordinates[i][0] - charsCoordinates[j][0];
      const distanceY = charsCoordinates[i][1] - charsCoordinates[j][1];

      for (let k = 0; ; k++) {
        const antinodeCoordinateA = [
          charsCoordinates[i][0] + distanceX * k,
          charsCoordinates[i][1] + distanceY * k,
        ];

        if (
          antinodeCoordinateA[0] < 0 ||
          antinodeCoordinateA[0] >= y ||
          antinodeCoordinateA[1] < 0 ||
          antinodeCoordinateA[1] >= x
        ) {
          break;
        }

        antinodeCoordinates.push(antinodeCoordinateA);
      }

      for (let k = 0; ; k++) {
        const antinodeCoordinateB = [
          charsCoordinates[j][0] - distanceX * k,
          charsCoordinates[j][1] - distanceY * k,
        ];

        if (
          antinodeCoordinateB[0] < 0 ||
          antinodeCoordinateB[0] >= y ||
          antinodeCoordinateB[1] < 0 ||
          antinodeCoordinateB[1] >= x
        ) {
          break;
        }

        antinodeCoordinates.push(antinodeCoordinateB);
      }
    }
  }
}

// remove duplicates
const uniqueAntinodeCoordinates = Array.from(
  new Set(antinodeCoordinates.map(JSON.stringify)),
  JSON.parse
);

// remove coordinates that are outside the grid
const validAntinodeCoordinates = uniqueAntinodeCoordinates.filter(
  ([i, j]) => i >= 0 && i < y && j >= 0 && j < x
);

console.log(validAntinodeCoordinates.length);
