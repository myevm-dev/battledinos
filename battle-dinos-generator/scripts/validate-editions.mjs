import fs from "fs";
import path from "path";

const collection = JSON.parse(
  fs.readFileSync("./data/collection_manifest.json", "utf8")
);

const supply = JSON.parse(
  fs.readFileSync("./data/supply_manifest.json", "utf8")
);

const editions = JSON.parse(
  fs.readFileSync("./data/editions_manifest.json", "utf8")
);

const errors = [];

if (supply.length !== 333) {
  errors.push(`Expected 333 supply entries, found ${supply.length}`);
}

const supplyTotal = supply.reduce(
  (sum, item) => sum + item.standard_supply,
  0
);

if (supplyTotal !== collection.standard_supply) {
  errors.push(
    `Supply manifest total ${supplyTotal} does not match ${collection.standard_supply}`
  );
}

if (editions.length !== collection.standard_supply) {
  errors.push(
    `Edition manifest has ${editions.length} records, expected ${collection.standard_supply}`
  );
}

for (let tokenId = 1; tokenId <= collection.standard_supply; tokenId++) {
  const file = path.join("./metadata/standard", `${tokenId}.json`);

  if (!fs.existsSync(file)) {
    errors.push(`Missing ${file}`);
    continue;
  }

  const dino = JSON.parse(fs.readFileSync(file, "utf8"));

  if (dino.token_id !== tokenId) {
    errors.push(`${file}: token_id mismatch`);
  }

  if (!Array.isArray(dino.moves) || dino.moves.length !== 3) {
    errors.push(`${file}: expected exactly 3 moves`);
  }

  if (dino.xp.available !== dino.xp.lifetime - dino.xp.spent) {
    errors.push(`${file}: XP accounting mismatch`);
  }
}

if (errors.length) {
  console.error(errors.slice(0, 100).join("\n"));
  if (errors.length > 100) {
    console.error(`...and ${errors.length - 100} more`);
  }
  process.exit(1);
}

console.log("Standard edition metadata valid.");
console.log(`Base archetypes: ${supply.length}`);
console.log(`Standard supply: ${supplyTotal}`);
