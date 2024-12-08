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

// pattern to match "mul({number},{number})"
// use groups to only capture the numbers
const pattern = /mul\((\d+),(\d+)\)/g;

// Use matchAll para capturar os grupos e extrair apenas os números
const numbers = [...input.matchAll(pattern)].flatMap((match) => [
  [parseInt(match[1]), parseInt(match[2])],
]);

const result = numbers
  .map(([a, b]) => a * b)
  .reduce((acc, curr) => acc + curr, 0);

console.log(result);
