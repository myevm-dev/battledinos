# Battle Dinos Standard Edition Expansion

This package expands the 333 v2 base archetypes into individual standard collectible editions.

## Current supply

- Base archetypes: 333
- Standard editions: 33,300
- Foils: not generated yet
- Current total: 33,300

## Supply logic

Each named dino receives a varied number of standard copies.

Supply is influenced by rarity using these allowed ranges:

- Common: 75-190
- Uncommon: 55-135
- Rare: 25-90
- Epic: 8-45
- Legendary: 2-20

The generator was then adjusted deterministically to land on exactly 33,300 standard NFTs.

Multiple named dinos may have the same supply count. Quantities are intentionally varied, not required to be globally unique.

## What remains identical between copies

Every edition of the same base archetype keeps:

- name
- base_id
- species
- rarity
- element
- image
- the same 3 move names

## What varies between copies

Every individual edition gets deterministic genetics:

- Health: 0.95-1.05 of base
- Attack: 0.95-1.05 of base
- Defense: 0.95-1.05 of base
- Speed: 0.95-1.05 of base
- Each move power: 0.92-1.08 of base

The resulting starting stats and move powers are stored directly in the edition JSON.

## Live progression

Each edition starts with:

- Level 1
- Lifetime XP 0
- Spent XP 0
- Available XP 0
- Evolution stage 0
- No mutations

These are starting values. In production, live progression can move to Firebase / backend game state while the base mint identity stays fixed.

## Files

```text
data/
  battle_dinos_333_v2.json
  collection_manifest.json
  supply_manifest.json
  editions_manifest.json

metadata/
  standard/
    1.json
    2.json
    ...
    33300.json

types/
  battle-dino-edition.ts

scripts/
  validate-editions.mjs
```

## Foils

No holo, reverse holo, or special cards are included yet.

Those can be generated later as a separate finish/supply layer without changing the standard edition counts.
