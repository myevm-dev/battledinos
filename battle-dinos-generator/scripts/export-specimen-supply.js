import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const editionsDir = path.join(
  __dirname,
  "../data/editions"
);

const outputFile = path.join(
  __dirname,
  "../../battle-ui/data/specimen_supply.json"
);

const supplyByBaseId = {};

function processValue(value) {
  if (Array.isArray(value)) {
    value.forEach(processValue);
    return;
  }

  if (!value || typeof value !== "object") {
    return;
  }

  if (
    typeof value.base_id === "number" &&
    typeof value.edition_supply === "number"
  ) {
    supplyByBaseId[value.base_id] = value.edition_supply;
  }

  Object.values(value).forEach(processValue);
}

function scanDirectory(directory) {
  const entries = fs.readdirSync(directory, {
    withFileTypes: true,
  });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      scanDirectory(fullPath);
      continue;
    }

    if (!entry.name.endsWith(".json")) {
      continue;
    }

    try {
      const json = JSON.parse(
        fs.readFileSync(fullPath, "utf8")
      );

      processValue(json);
    } catch {
      console.warn(`Skipped ${fullPath}`);
    }
  }
}

scanDirectory(editionsDir);

const sorted = Object.fromEntries(
  Object.entries(supplyByBaseId).sort(
    ([a], [b]) => Number(a) - Number(b)
  )
);

fs.mkdirSync(path.dirname(outputFile), {
  recursive: true,
});

fs.writeFileSync(
  outputFile,
  JSON.stringify(sorted, null, 2)
);

console.log(
  `Wrote ${Object.keys(sorted).length} specimen supplies`
);

console.log(outputFile);