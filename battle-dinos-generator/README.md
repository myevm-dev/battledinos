# Battle Dinos Metadata v2

This package upgrades the original 333 generated dinos into reusable base archetypes.

## What changed

Each base dino now has:

- `base_id`
- `element`
- `base_battle_stats`
- exactly 3 moves using `base_power`
- `starting_state`
  - level 1
  - XP 0
  - evolution stage 0
  - no mutations

The original image, visual data, rarity, species, and image prompt are preserved.

## Important architecture choice

The 333 files are now BASE ARCHETYPES.

Do not store a player's live level, XP, evolution, or mutations directly on these shared files.

Future collectible editions will inherit from a base archetype:

```text
Echoguard base #1
  -> Echoguard 1/78
  -> Echoguard 2/78
  -> ...
  -> Echoguard 78/78
```

Each edition will get:

- its own token ID
- its own genetics roll
- slightly different battle stats
- the same 3 move names
- slightly different move powers
- independent XP
- independent evolution history
- independent mutations

## Element reconstruction

Elements were reconstructed from the elemental vocabulary already used when the original move names were generated.

Examples:

- Primal / Wild / Savage / Alpha -> Primal
- Riptide / Torrent / Tidal / Aqua -> Tide
- Magma / Inferno / Cinder / Flare -> Ember
- Thunder / Static / Tempest / Lightning -> Storm

No new random element was assigned.

## Next step

Generate an edition manifest with varied supply by base archetype and a target standard-edition supply around 33,300.

Foils should be generated as a separate supply layer afterward.
