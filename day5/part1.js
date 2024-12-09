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

// regex to match | and ,
const regex = /[\|,]/;
const [rulesInput, updatesInput] = (await readFileContent("input.txt"))
  .trim()
  .split("\n\n")
  .map((part) =>
    part
      .split("\n")
      .map((line) => line.split(regex).map((number) => parseInt(number)))
  );

// create a map of rules to store for each rule witch values should be before and after
const ruleMap = new Map();
rulesInput.forEach((rule) => {
  const prevRule0 = ruleMap.get(rule[0]);
  const prevRule1 = ruleMap.get(rule[1]);

  ruleMap.set(rule[0], {
    before: prevRule0?.before ?? [],
    // add all values after the first value in the rule
    after: [...(prevRule0?.after ?? []), ...rule.slice(1)],
  });

  ruleMap.set(rule[1], {
    // add all values before the second value in the rule
    before: [...(prevRule1?.before ?? []), rule[0]],
    after: prevRule1?.after ?? [],
  });
});

// for each updatesInput check if the number order is valid for each rule
let validUpdates = 0;
let middlePageSum = 0;
for (const update of updatesInput) {
  let valid = true;
  for (let i = 0; i < update.length; i++) {
    const rule = ruleMap.get(update[i]);
    const before = update.slice(0, i);
    const after = update.slice(i + 1);

    // check if the number is valid for the rule
    // check if all before numbers are not in the after array
    // check if all after numbers are not in the before array
    if (
      !(
        before.every((number) => !rule.after.includes(number)) &&
        after.every((number) => !rule.before.includes(number))
      )
    ) {
      valid = false;
      break;
    }
  }
  if (valid) {
    const middleIndex = (update.length - 1) / 2;
    middlePageSum += update[middleIndex];
    validUpdates++;
  }
}

console.log("Total updates:", updatesInput.length);
console.log("Valid updates:", validUpdates);
console.log("Middle page sum:", middlePageSum);
