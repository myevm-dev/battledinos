import fs from "fs";

const data = JSON.parse(
  fs.readFileSync("./data/battle_dinos_333.json", "utf8")
);

const errors = [];

if (data.dinos.length !== 333) {
  errors.push(`Expected 333 dinos, found ${data.dinos.length}`);
}

for (const dino of data.dinos) {
  if (!dino.base_id) errors.push(`${dino.name}: missing base_id`);
  if (!dino.element) errors.push(`${dino.name}: missing element`);
  if (!dino.base_battle_stats) errors.push(`${dino.name}: missing base stats`);
  if (!Array.isArray(dino.moves) || dino.moves.length !== 3) {
    errors.push(`${dino.name}: must have exactly 3 moves`);
  }
  for (const move of dino.moves ?? []) {
    if (typeof move.base_power !== "number") {
      errors.push(`${dino.name}/${move.name}: missing base_power`);
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Metadata valid.");
console.log(`Archetypes: ${data.dinos.length}`);
console.log(`Schema: ${data.collection.schema_version}`);
