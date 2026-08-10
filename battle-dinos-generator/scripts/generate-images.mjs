import fs from "fs";
import path from "path";
import process from "process";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const ROOT = process.cwd();
const DATA_PATH = path.join(ROOT, "data", "battle_dinos_333.json");
const OUTPUT_DIR = path.join(ROOT, "output");
const LOG_DIR = path.join(ROOT, "logs");
const RESULTS_PATH = path.join(LOG_DIR, "results.json");
const FAILURES_PATH = path.join(LOG_DIR, "failures.json");

const MODEL = process.env.OPENAI_IMAGE_MODEL || "gpt-image-2";
const SIZE = process.env.IMAGE_SIZE || "1024x1024";
const QUALITY = process.env.IMAGE_QUALITY || "medium";
const DELAY_MS = Number(process.env.DELAY_MS || 1000);
const MAX_RETRIES = Number(process.env.MAX_RETRIES || 3);
const OVERWRITE = String(process.env.OVERWRITE || "false").toLowerCase() === "true";

function parseArgs() {
  const args = process.argv.slice(2);
  const values = {};

  for (const arg of args) {
    if (!arg.startsWith("--")) continue;
    const [key, value] = arg.slice(2).split("=");
    values[key] = value ?? true;
  }

  return values;
}

const args = parseArgs();

const START_AT = Number(args.start || process.env.START_AT || 1);
const END_AT = Number(args.end || process.env.END_AT || 333);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function safeReadLog(filePath) {
  if (!fs.existsSync(filePath)) return [];
  try {
    const value = readJson(filePath);
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function buildPrompt(collection, dino) {
  if (dino.image_prompt?.trim()) {
    return dino.image_prompt.trim();
  }

  const stylePrompt = collection?.style_prompt?.trim();

  if (!stylePrompt) {
    throw new Error(
      `Dino #${dino.token_id} has no image_prompt and collection.style_prompt is missing.`
    );
  }

  if (!dino.visual?.description || !dino.visual?.arena) {
    throw new Error(
      `Dino #${dino.token_id} is missing visual.description or visual.arena.`
    );
  }

  return `${stylePrompt}

Character: ${dino.name}, a ${dino.visual.description}.

Pose with a confident battle-ready personality in the following environment: ${dino.visual.arena}.

Do not depict attacks, powers, text, numbers, logos, UI, humans, or other combatants.`;
}

async function generateImage(client, dino, collection) {
  const prompt = buildPrompt(collection, dino);

  const result = await client.images.generate({
    model: MODEL,
    prompt,
    size: SIZE,
    quality: QUALITY,
  });

  const imageBase64 = result.data?.[0]?.b64_json;

  if (!imageBase64) {
    throw new Error("The API response did not contain image data.");
  }

  return Buffer.from(imageBase64, "base64");
}

async function generateOne(client, dino, collection, results, failures) {
  const tokenId = Number(dino.token_id);
  const fileName = `${tokenId}.png`;
  const outPath = path.join(OUTPUT_DIR, fileName);

  if (!OVERWRITE && fs.existsSync(outPath)) {
    console.log(`SKIP  #${tokenId} ${dino.name} already exists`);
    return;
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(
        `GEN   #${tokenId} ${dino.name} | ${attempt}/${MAX_RETRIES} | ${QUALITY}`
      );

      const imageBuffer = await generateImage(client, dino, collection);
      fs.writeFileSync(outPath, imageBuffer);

      const record = {
        token_id: tokenId,
        name: dino.name,
        status: "success",
        file: `output/${fileName}`,
        model: MODEL,
        size: SIZE,
        quality: QUALITY,
        timestamp: new Date().toISOString(),
      };

      results.push(record);
      writeJson(RESULTS_PATH, results);

      console.log(`SAVE  output/${fileName}`);
      return;
    } catch (error) {
      const message = error?.message || String(error);
      console.error(`ERR   #${tokenId}: ${message}`);

      if (attempt < MAX_RETRIES) {
        const waitMs = 2000 * attempt;
        console.log(`WAIT  ${waitMs}ms then retry`);
        await sleep(waitMs);
      } else {
        failures.push({
          token_id: tokenId,
          name: dino.name,
          error: message,
          timestamp: new Date().toISOString(),
        });

        writeJson(FAILURES_PATH, failures);
      }
    }
  }
}

async function main() {
  ensureDir(OUTPUT_DIR);
  ensureDir(LOG_DIR);

  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "OPENAI_API_KEY is missing. Copy .env.example to .env and add your API key."
    );
  }

  if (!fs.existsSync(DATA_PATH)) {
    throw new Error(
      "Missing data/battle_dinos_333.json. Put the master metadata file inside the data folder."
    );
  }

  if (
    !Number.isInteger(START_AT) ||
    !Number.isInteger(END_AT) ||
    START_AT < 1 ||
    END_AT < START_AT
  ) {
    throw new Error(`Invalid range: START_AT=${START_AT}, END_AT=${END_AT}`);
  }

  const raw = readJson(DATA_PATH);
  const collection = raw.collection || {};
  const dinos = Array.isArray(raw.dinos) ? raw.dinos : [];

  if (!dinos.length) {
    throw new Error("No dinos found in data/battle_dinos_333.json.");
  }

  const selected = dinos
    .filter((dino) => {
      const id = Number(dino.token_id);
      return id >= START_AT && id <= END_AT;
    })
    .sort((a, b) => Number(a.token_id) - Number(b.token_id));

  if (!selected.length) {
    throw new Error(`No dinos found in token range ${START_AT}-${END_AT}.`);
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const results = safeReadLog(RESULTS_PATH);
  const failures = safeReadLog(FAILURES_PATH);

  console.log("");
  console.log("Battle Dinos Image Generator");
  console.log("----------------------------");
  console.log(`Model:   ${MODEL}`);
  console.log(`Size:    ${SIZE}`);
  console.log(`Quality: ${QUALITY}`);
  console.log(`Range:   ${START_AT}-${END_AT}`);
  console.log(`Dinos:   ${selected.length}`);
  console.log(`Output:  ${OUTPUT_DIR}`);
  console.log("");

  for (let i = 0; i < selected.length; i++) {
    const dino = selected[i];

    await generateOne(client, dino, collection, results, failures);

    if (i < selected.length - 1 && DELAY_MS > 0) {
      await sleep(DELAY_MS);
    }
  }

  console.log("");
  console.log("Finished.");
  console.log(`Images:   ${OUTPUT_DIR}`);
  console.log(`Results:  ${RESULTS_PATH}`);
  console.log(`Failures: ${FAILURES_PATH}`);
}

main().catch((error) => {
  console.error("");
  console.error(`FATAL: ${error.message}`);
  process.exit(1);
});
