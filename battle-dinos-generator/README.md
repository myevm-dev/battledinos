# Battle Dinos Generator

## 1. Put your metadata here

Place the master metadata file at:

data/battle_dinos_333.json

The generator expects the JSON to contain:

- `collection.style_prompt`
- `dinos`
- each dino's `token_id`, `name`, and `image_prompt`

The existing Battle Dinos master JSON already has this structure.

## 2. Install dependencies

```bash
npm install
```

## 3. Set your API key

Copy `.env.example` to `.env`.

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Mac/Linux:

```bash
cp .env.example .env
```

Then open `.env` and replace:

```text
OPENAI_API_KEY=replace_with_your_api_key
```

with your real OpenAI API key.

Do not commit `.env`.

## 4. Test only the first 5 dinos

```bash
npm run test:5
```

Generated files appear in:

```text
output/
  1.png
  2.png
  3.png
  4.png
  5.png
```

## 5. Generate all 333

```bash
npm run generate
```

The default range is 1 through 333.

## Generate a custom range

```bash
node scripts/generate-images.mjs --start=100 --end=120
```

## Resume after stopping

Run the same command again.

Existing PNGs are skipped automatically, so the generator only creates missing images.

## Regenerate existing images

Set this in `.env`:

```text
OVERWRITE=true
```

Change it back to `false` when finished.

## Quality

The default is:

```text
IMAGE_QUALITY=medium
```

You can change it in `.env` to:

```text
IMAGE_QUALITY=low
```

or:

```text
IMAGE_QUALITY=high
```

## Logs

Generation records are written to:

```text
logs/results.json
logs/failures.json
```
