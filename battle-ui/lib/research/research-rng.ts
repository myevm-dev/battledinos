// battle-ui/lib/research/research-rng.ts

/**
 * Deterministic seeded randomness for SPECIMEN research.
 *
 * IMPORTANT:
 * Never use Math.random() inside the canonical research engine.
 *
 * The same:
 *
 * specimen state
 * + research inputs
 * + serum
 * + seed
 *
 * should always reproduce the same official research outcome.
 */

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export type SeededRandom = {
  /**
   * Returns a deterministic number from 0 inclusive to 1 exclusive.
   */
  next: () => number;

  /**
   * Returns a deterministic decimal between min and max.
   */
  float: (min?: number, max?: number) => number;

  /**
   * Returns a deterministic integer between min and max, inclusive.
   */
  int: (min: number, max: number) => number;

  /**
   * Returns true based on a probability from 0 to 1.
   */
  chance: (probability: number) => boolean;

  /**
   * Deterministically selects one item from an array.
   */
  pick: <T>(items: readonly T[]) => T;

  /**
   * Deterministically shuffles an array without mutating the original.
   */
  shuffle: <T>(items: readonly T[]) => T[];
};

export type WeightedItem<T> = {
  item: T;
  weight: number;
};

/* -------------------------------------------------------------------------- */
/*                              STRING HASHING                                */
/* -------------------------------------------------------------------------- */

/**
 * Converts any string into a stable unsigned 32-bit integer.
 *
 * FNV-1a is used here because it is:
 * - simple
 * - deterministic
 * - fast
 * - stable across environments
 *
 * This is NOT intended to be cryptographically secure.
 */
export function hashSeed(seed: string): number {
  let hash = 2166136261;

  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);

    hash = Math.imul(
      hash,
      16777619,
    );
  }

  return hash >>> 0;
}

/* -------------------------------------------------------------------------- */
/*                                DERIVE SEED                                 */
/* -------------------------------------------------------------------------- */

/**
 * Creates deterministic child seeds from one canonical research seed.
 *
 * Example:
 *
 * deriveSeed(seed, "mutation-count")
 * deriveSeed(seed, "mutation-1")
 * deriveSeed(seed, "mutation-2")
 *
 * This prevents one random decision from accidentally changing every
 * subsequent decision if the engine is expanded later.
 */
export function deriveSeed(
  seed: string,
  ...parts: Array<string | number>
): string {
  return [
    seed,
    ...parts.map(String),
  ].join("::");
}

/* -------------------------------------------------------------------------- */
/*                                  PRNG                                      */
/* -------------------------------------------------------------------------- */

/**
 * Mulberry32 deterministic pseudo-random number generator.
 *
 * Given the same 32-bit seed, it always produces the same sequence.
 */
function mulberry32(
  initialSeed: number,
): () => number {
  let state = initialSeed >>> 0;

  return () => {
    state += 0x6d2b79f5;

    let value = state;

    value = Math.imul(
      value ^ (value >>> 15),
      value | 1,
    );

    value ^= value +
      Math.imul(
        value ^ (value >>> 7),
        value | 61,
      );

    return (
      (
        value ^
        (value >>> 14)
      ) >>>
      0
    ) / 4294967296;
  };
}

/* -------------------------------------------------------------------------- */
/*                           SEEDED RANDOM OBJECT                             */
/* -------------------------------------------------------------------------- */

export function createSeededRandom(
  seed: string,
): SeededRandom {
  const generator =
    mulberry32(hashSeed(seed));

  const next = () => generator();

  const float = (
    min = 0,
    max = 1,
  ) => {
    if (max < min) {
      throw new Error(
        `Invalid random range: max (${max}) is less than min (${min}).`,
      );
    }

    return (
      min +
      next() * (max - min)
    );
  };

  const int = (
    min: number,
    max: number,
  ) => {
    if (!Number.isInteger(min) || !Number.isInteger(max)) {
      throw new Error(
        "Random integer bounds must be integers.",
      );
    }

    if (max < min) {
      throw new Error(
        `Invalid random integer range: max (${max}) is less than min (${min}).`,
      );
    }

    return Math.floor(
      float(
        min,
        max + 1,
      ),
    );
  };

  const chance = (
    probability: number,
  ) => {
    const normalized =
      Math.max(
        0,
        Math.min(1, probability),
      );

    return next() < normalized;
  };

  const pick = <T>(
    items: readonly T[],
  ): T => {
    if (items.length === 0) {
      throw new Error(
        "Cannot pick from an empty array.",
      );
    }

    return items[
      int(
        0,
        items.length - 1,
      )
    ];
  };

  const shuffle = <T>(
    items: readonly T[],
  ): T[] => {
    const result = [...items];

    for (
      let i = result.length - 1;
      i > 0;
      i -= 1
    ) {
      const j = int(0, i);

      [
        result[i],
        result[j],
      ] = [
        result[j],
        result[i],
      ];
    }

    return result;
  };

  return {
    next,
    float,
    int,
    chance,
    pick,
    shuffle,
  };
}

/* -------------------------------------------------------------------------- */
/*                            SINGLE-VALUE HELPERS                            */
/* -------------------------------------------------------------------------- */

/**
 * Returns one deterministic float from a scoped seed.
 *
 * Good for isolated decisions that should remain stable if unrelated
 * engine logic changes later.
 */
export function seededFloat(
  seed: string,
  min = 0,
  max = 1,
): number {
  return createSeededRandom(seed)
    .float(min, max);
}

/**
 * Returns one deterministic integer from a scoped seed.
 */
export function seededInt(
  seed: string,
  min: number,
  max: number,
): number {
  return createSeededRandom(seed)
    .int(min, max);
}

/**
 * Returns one deterministic probability check.
 */
export function seededChance(
  seed: string,
  probability: number,
): boolean {
  return createSeededRandom(seed)
    .chance(probability);
}

/* -------------------------------------------------------------------------- */
/*                           WEIGHTED RANDOM PICK                             */
/* -------------------------------------------------------------------------- */

/**
 * Selects one item according to its relative weight.
 *
 * Example:
 *
 * [
 *   { item: "Defensive", weight: 2.7 },
 *   { item: "Structural", weight: 1.55 },
 *   { item: "Wildcard", weight: 0.65 }
 * ]
 *
 * Higher weight = more likely to be selected.
 */
export function weightedRandom<T>(
  seed: string,
  items: readonly WeightedItem<T>[],
): T {
  const validItems =
    items.filter(
      ({ weight }) =>
        Number.isFinite(weight) &&
        weight > 0,
    );

  if (validItems.length === 0) {
    throw new Error(
      "weightedRandom requires at least one item with a positive weight.",
    );
  }

  const totalWeight =
    validItems.reduce(
      (total, current) =>
        total + current.weight,
      0,
    );

  const random =
    createSeededRandom(seed);

  const roll =
    random.float(
      0,
      totalWeight,
    );

  let cursor = 0;

  for (const entry of validItems) {
    cursor += entry.weight;

    if (roll < cursor) {
      return entry.item;
    }
  }

  /**
   * Floating-point fallback.
   */
  return validItems[
    validItems.length - 1
  ].item;
}

/* -------------------------------------------------------------------------- */
/*                       WEIGHTED PICK WITH DETAILS                           */
/* -------------------------------------------------------------------------- */

export type WeightedRandomResult<T> = {
  item: T;

  weight: number;

  totalWeight: number;

  normalizedProbability: number;

  roll: number;
};

/**
 * Same concept as weightedRandom, but also returns debugging / analytics
 * information.
 *
 * This will be useful for:
 * - clone research
 * - research audit logs
 * - formula testing
 * - probability-tree generation
 */
export function weightedRandomWithDetails<T>(
  seed: string,
  items: readonly WeightedItem<T>[],
): WeightedRandomResult<T> {
  const validItems =
    items.filter(
      ({ weight }) =>
        Number.isFinite(weight) &&
        weight > 0,
    );

  if (validItems.length === 0) {
    throw new Error(
      "weightedRandomWithDetails requires positive weights.",
    );
  }

  const totalWeight =
    validItems.reduce(
      (total, current) =>
        total + current.weight,
      0,
    );

  const random =
    createSeededRandom(seed);

  const roll =
    random.float(
      0,
      totalWeight,
    );

  let cursor = 0;

  for (const entry of validItems) {
    cursor += entry.weight;

    if (roll < cursor) {
      return {
        item: entry.item,

        weight: entry.weight,

        totalWeight,

        normalizedProbability:
          entry.weight /
          totalWeight,

        roll,
      };
    }
  }

  const fallback =
    validItems[
      validItems.length - 1
    ];

  return {
    item: fallback.item,

    weight: fallback.weight,

    totalWeight,

    normalizedProbability:
      fallback.weight /
      totalWeight,

    roll,
  };
}

/* -------------------------------------------------------------------------- */
/*                         NORMALIZE WEIGHT TABLE                             */
/* -------------------------------------------------------------------------- */

/**
 * Converts raw weights into percentages/probabilities.
 *
 * This does NOT roll anything.
 *
 * It is useful when displaying:
 *
 * Defensive       47.2%
 * Structural      24.8%
 * Metabolic       11.3%
 */
export function normalizeWeights<T>(
  items: readonly WeightedItem<T>[],
) {
  const validItems =
    items.filter(
      ({ weight }) =>
        Number.isFinite(weight) &&
        weight > 0,
    );

  const totalWeight =
    validItems.reduce(
      (total, current) =>
        total + current.weight,
      0,
    );

  if (totalWeight <= 0) {
    return [];
  }

  return validItems.map(
    ({ item, weight }) => ({
      item,

      weight,

      probability:
        weight / totalWeight,

      percent:
        (weight / totalWeight) *
        100,
    }),
  );
}

/* -------------------------------------------------------------------------- */
/*                              NUMBER HELPERS                                */
/* -------------------------------------------------------------------------- */

export function roundTo(
  value: number,
  decimals = 4,
): number {
  const multiplier =
    10 ** decimals;

  return (
    Math.round(
      value * multiplier,
    ) / multiplier
  );
}

/**
 * Keeps normalized biological values within 0-1.
 */
export function clamp01(
  value: number,
): number {
  return Math.max(
    0,
    Math.min(1, value),
  );
}