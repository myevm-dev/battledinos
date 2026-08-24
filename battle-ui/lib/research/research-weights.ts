// battle-ui/lib/research/research-weights.ts

import {
  MUTATION_RARITY_WEIGHTS,
  RESEARCH_DURATION_CONFIG,
  RESEARCH_INTENSITY_CONFIG,
  SERUM_CONFIG,
} from "./research-config";

import {
  getResearchFamilyWeight,
} from "./research-paths";

import {
  normalizeWeights,
  weightedRandom,
} from "./research-rng";

import type {
  SerumEngineProfile,
} from "./serum-types";

import type {
  MutationFamily,
  MutationRarity,
  ResearchDurationDays,
  ResearchIntensity,
  ResearchPath,
  SpecimenResearchState,
} from "./research-types";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

/**
 * Minimal mutation shape required by the research engine.
 *
 * Your existing mutation-library.ts contains additional fields such as:
 *
 * description
 * visualEffect
 * statBias
 * movePowerMultiplier
 * tags
 * evolutionInfluence
 *
 * Those can remain on the original object. The weighting engine only needs
 * the fields below.
 */
export type ResearchMutation = {
  id: string;
  name: string;
  family: MutationFamily;
  rarity: MutationRarity;

  tags?: string[];

  /**
   * Optional future override.
   *
   * 1 = normal
   * 1.5 = naturally more common
   * 0.5 = naturally less common
   */
  researchWeight?: number;
};

export type MutationWeightInput = {
  specimen: SpecimenResearchState;

  mutation: ResearchMutation;

  primaryPath: ResearchPath;

  secondaryPath?: ResearchPath;

  durationDays: ResearchDurationDays;

  intensity: ResearchIntensity;

  serum?: SerumEngineProfile;

  /**
   * Normally false.
   *
   * Existing mutations should usually not be rolled again.
   */
  allowExistingMutation?: boolean;
};

export type MutationWeightBreakdown = {
  mutationId: string;
  mutationName: string;

  family: MutationFamily;
  rarity: MutationRarity;

  baseWeight: number;

  rarityWeight: number;

  primaryPathMultiplier: number;

  secondaryPathMultiplier: number;

  serumFamilyMultiplier: number;

  serumMutationMultiplier: number;

  lineageMultiplier: number;

  elementAffinityMultiplier: number;

  customMutationMultiplier: number;

  duplicateMultiplier: number;

  finalWeight: number;
};

export type WeightedMutationCandidate = {
  mutation: ResearchMutation;

  weight: number;

  probability?: number;

  percent?: number;

  breakdown: MutationWeightBreakdown;
};

/* -------------------------------------------------------------------------- */
/*                              INTERNAL HELPERS                              */
/* -------------------------------------------------------------------------- */

function clamp(
  value: number,
  min: number,
  max: number,
) {
  return Math.min(
    max,
    Math.max(min, value),
  );
}

/**
 * Research duration strengthens intentional direction without globally
 * multiplying every family.
 *
 * Example:
 *
 * Defensive path raw weight = 2.70
 * 3 day focus = 0.90
 *
 * 1 + ((2.70 - 1) × 0.90)
 * = 2.53
 *
 * 90 day focus = 1.22
 *
 * 1 + ((2.70 - 1) × 1.22)
 * = 3.074
 *
 * Neutral 1.0 weights remain 1.0.
 */
export function applyFocusMultiplier(
  weight: number,
  focus: number,
): number {
  return Math.max(
    0,
    1 + (weight - 1) * focus,
  );
}

/* -------------------------------------------------------------------------- */
/*                              RARITY WEIGHT                                 */
/* -------------------------------------------------------------------------- */

/**
 * Canonical rarity is rolled separately in research-outcomes.ts.
 *
 * This weighting remains useful for generic candidate-table analysis.
 * Once a rarity is selected, every candidate in the filtered rarity pool
 * shares the same rarity multiplier, so it does not distort selection within
 * that tier.
 */
function getRarityWeight({
  rarity,
  intensity,
}: {
  rarity: MutationRarity;
  intensity: ResearchIntensity;
}) {
  const base =
    MUTATION_RARITY_WEIGHTS[rarity];

  const intensityConfig =
    RESEARCH_INTENSITY_CONFIG[intensity];

  switch (rarity) {
    case "Rare":
      return (
        base *
        intensityConfig
          .rareWeightMultiplier
      );

    case "Epic":
      return (
        base *
        intensityConfig
          .epicWeightMultiplier
      );

    case "Legendary":
      return (
        base *
        intensityConfig
          .legendaryWeightMultiplier
      );

    default:
      return base;
  }
}

/* -------------------------------------------------------------------------- */
/*                           PRIMARY PATH WEIGHT                              */
/* -------------------------------------------------------------------------- */

function getPrimaryPathMultiplier({
  primaryPath,
  mutationFamily,
  durationDays,
}: {
  primaryPath: ResearchPath;
  mutationFamily: MutationFamily;
  durationDays: ResearchDurationDays;
}) {
  const raw =
    getResearchFamilyWeight(
      primaryPath,
      mutationFamily,
    );

  const duration =
    RESEARCH_DURATION_CONFIG[
      durationDays
    ];

  return applyFocusMultiplier(
    raw,
    duration.pathFocusMultiplier,
  );
}

/* -------------------------------------------------------------------------- */
/*                          SECONDARY PATH WEIGHT                             */
/* -------------------------------------------------------------------------- */

/**
 * Formula development may eventually allow a secondary research direction.
 *
 * It should influence the experiment without overpowering the primary path.
 */
const SECONDARY_PATH_STRENGTH = 0.4;

function getSecondaryPathMultiplier({
  secondaryPath,
  mutationFamily,
  durationDays,
}: {
  secondaryPath?: ResearchPath;
  mutationFamily: MutationFamily;
  durationDays: ResearchDurationDays;
}) {
  if (!secondaryPath) {
    return 1;
  }

  const raw =
    getResearchFamilyWeight(
      secondaryPath,
      mutationFamily,
    );

  const duration =
    RESEARCH_DURATION_CONFIG[
      durationDays
    ];

  const focused =
    applyFocusMultiplier(
      raw,
      duration.pathFocusMultiplier,
    );

  return (
    1 +
    (focused - 1) *
      SECONDARY_PATH_STRENGTH
  );
}

/* -------------------------------------------------------------------------- */
/*                              SERUM WEIGHTS                                 */
/* -------------------------------------------------------------------------- */

function getSerumFamilyMultiplier({
  serum,
  mutationFamily,
  durationDays,
}: {
  serum?: SerumEngineProfile;
  mutationFamily: MutationFamily;
  durationDays: ResearchDurationDays;
}) {
  if (!serum?.familyWeights) {
    return 1;
  }

  const raw =
    serum.familyWeights[
      mutationFamily
    ] ?? 1;

  const capped =
    clamp(
      raw,
      0.1,
      SERUM_CONFIG
        .maxFamilyWeightMultiplier,
    );

  const focus =
    RESEARCH_DURATION_CONFIG[
      durationDays
    ].serumFocusMultiplier;

  return applyFocusMultiplier(
    capped,
    focus,
  );
}

function getSerumMutationMultiplier({
  serum,
  mutationId,
  durationDays,
}: {
  serum?: SerumEngineProfile;
  mutationId: string;
  durationDays: ResearchDurationDays;
}) {
  if (!serum?.mutationWeights) {
    return 1;
  }

  const raw =
    serum.mutationWeights[
      mutationId
    ] ?? 1;

  const capped =
    clamp(
      raw,
      0.1,
      SERUM_CONFIG
        .maxMutationWeightMultiplier,
    );

  const focus =
    RESEARCH_DURATION_CONFIG[
      durationDays
    ].serumFocusMultiplier;

  return applyFocusMultiplier(
    capped,
    focus,
  );
}

/* -------------------------------------------------------------------------- */
/*                            LINEAGE AFFINITY                                */
/* -------------------------------------------------------------------------- */

/**
 * Existing development gives a slight tendency for related biology to
 * continue expressing in later evolution stages.
 *
 * This creates lineage.
 *
 * It is deliberately modest so a specimen does not become permanently
 * trapped in its first research family.
 */
const LINEAGE_BONUS_PER_MUTATION = 0.04;
const MAX_LINEAGE_BONUS = 0.20;

function getLineageMultiplier(
  specimen: SpecimenResearchState,
  mutationFamily: MutationFamily,
) {
  const matchingMutations =
    specimen.mutations.filter(
      (mutation) =>
        mutation.family ===
        mutationFamily,
    ).length;

  const bonus =
    Math.min(
      MAX_LINEAGE_BONUS,
      matchingMutations *
        LINEAGE_BONUS_PER_MUTATION,
    );

  return 1 + bonus;
}

/* -------------------------------------------------------------------------- */
/*                           ELEMENT AFFINITY                                 */
/* -------------------------------------------------------------------------- */

/**
 * Elemental mutations can be slightly influenced by the specimen's existing
 * element.
 *
 * A mutation can explicitly identify elemental compatibility through tags.
 *
 * Example mutation tags:
 *
 * ["frost", "gland", "elemental"]
 *
 * A Frost specimen receives a modest affinity bonus.
 */
function getElementAffinityMultiplier(
  specimen: SpecimenResearchState,
  mutation: ResearchMutation,
) {
  if (!mutation.tags?.length) {
    return 1;
  }

  const specimenElement =
    specimen.element
      .trim()
      .toLowerCase();

  const tags =
    mutation.tags.map(
      (tag) =>
        tag.trim().toLowerCase(),
    );

  if (
    tags.includes(specimenElement)
  ) {
    return 1.12;
  }

  return 1;
}

/* -------------------------------------------------------------------------- */
/*                         DUPLICATE MUTATION RULE                            */
/* -------------------------------------------------------------------------- */

function getDuplicateMultiplier({
  specimen,
  mutationId,
  allowExistingMutation,
}: {
  specimen: SpecimenResearchState;
  mutationId: string;
  allowExistingMutation: boolean;
}) {
  const alreadyOwned =
    specimen.mutations.some(
      (mutation) =>
        mutation.mutationId ===
        mutationId,
    );

  if (!alreadyOwned) {
    return 1;
  }

  /**
   * Most mutations are unique traits.
   */
  if (!allowExistingMutation) {
    return 0;
  }

  /**
   * If repeated expressions are intentionally supported later,
   * heavily suppress them by default.
   */
  return 0.15;
}

/* -------------------------------------------------------------------------- */
/*                        INDIVIDUAL MUTATION WEIGHT                          */
/* -------------------------------------------------------------------------- */

export function calculateMutationWeight(
  input: MutationWeightInput,
): MutationWeightBreakdown {
  const {
    specimen,
    mutation,
    primaryPath,
    secondaryPath,
    durationDays,
    intensity,
    serum,
    allowExistingMutation = false,
  } = input;

  /**
   * Base weight exists mainly so individual mutation records can eventually
   * have their own natural frequency.
   */
  const baseWeight = 1;

  const rarityWeight =
    getRarityWeight({
      rarity: mutation.rarity,
      intensity,
    });

  const primaryPathMultiplier =
    getPrimaryPathMultiplier({
      primaryPath,
      mutationFamily:
        mutation.family,
      durationDays,
    });

  const secondaryPathMultiplier =
    getSecondaryPathMultiplier({
      secondaryPath,
      mutationFamily:
        mutation.family,
      durationDays,
    });

  const serumFamilyMultiplier =
    getSerumFamilyMultiplier({
      serum,
      mutationFamily:
        mutation.family,
      durationDays,
    });

  const serumMutationMultiplier =
    getSerumMutationMultiplier({
      serum,
      mutationId:
        mutation.id,
      durationDays,
    });

  const lineageMultiplier =
    getLineageMultiplier(
      specimen,
      mutation.family,
    );

  const elementAffinityMultiplier =
    getElementAffinityMultiplier(
      specimen,
      mutation,
    );

  const customMutationMultiplier =
    mutation.researchWeight ?? 1;

  const duplicateMultiplier =
    getDuplicateMultiplier({
      specimen,
      mutationId:
        mutation.id,
      allowExistingMutation,
    });

  const finalWeight =
    baseWeight *
    rarityWeight *
    primaryPathMultiplier *
    secondaryPathMultiplier *
    serumFamilyMultiplier *
    serumMutationMultiplier *
    lineageMultiplier *
    elementAffinityMultiplier *
    customMutationMultiplier *
    duplicateMultiplier;

  return {
    mutationId: mutation.id,
    mutationName: mutation.name,

    family: mutation.family,
    rarity: mutation.rarity,

    baseWeight,

    rarityWeight,

    primaryPathMultiplier,

    secondaryPathMultiplier,

    serumFamilyMultiplier,

    serumMutationMultiplier,

    lineageMultiplier,

    elementAffinityMultiplier,

    customMutationMultiplier,

    duplicateMultiplier,

    finalWeight:
      Math.max(
        0,
        finalWeight,
      ),
  };
}

/* -------------------------------------------------------------------------- */
/*                         BUILD CANDIDATE TABLE                              */
/* -------------------------------------------------------------------------- */

export function buildMutationWeightTable({
  mutations,
  specimen,
  primaryPath,
  secondaryPath,
  durationDays,
  intensity,
  serum,
  allowExistingMutations = false,
}: {
  mutations: readonly ResearchMutation[];

  specimen: SpecimenResearchState;

  primaryPath: ResearchPath;

  secondaryPath?: ResearchPath;

  durationDays: ResearchDurationDays;

  intensity: ResearchIntensity;

  serum?: SerumEngineProfile;

  allowExistingMutations?: boolean;
}): WeightedMutationCandidate[] {
  const candidates =
    mutations
      .map((mutation) => {
        const breakdown =
          calculateMutationWeight({
            specimen,
            mutation,

            primaryPath,
            secondaryPath,

            durationDays,
            intensity,

            serum,

            allowExistingMutation:
              allowExistingMutations,
          });

        return {
          mutation,
          weight:
            breakdown.finalWeight,
          breakdown,
        };
      })
      .filter(
        ({ weight }) =>
          Number.isFinite(weight) &&
          weight > 0,
      );

  const normalized =
    normalizeWeights(
      candidates.map(
        (candidate) => ({
          item:
            candidate.mutation.id,
          weight:
            candidate.weight,
        }),
      ),
    );

  const probabilities =
    new Map(
      normalized.map(
        ({
          item,
          probability,
          percent,
        }) => [
          item,
          {
            probability,
            percent,
          },
        ],
      ),
    );

  return candidates
    .map((candidate) => {
      const normalizedValue =
        probabilities.get(
          candidate.mutation.id,
        );

      return {
        ...candidate,

        probability:
          normalizedValue
            ?.probability ?? 0,

        percent:
          normalizedValue
            ?.percent ?? 0,
      };
    })
    .sort(
      (a, b) =>
        b.weight - a.weight,
    );
}

/* -------------------------------------------------------------------------- */
/*                              ROLL MUTATION                                 */
/* -------------------------------------------------------------------------- */

/**
 * Selects one actual mutation from an already-calculated candidate table.
 */
export function rollMutationFromTable(
  seed: string,
  candidates: readonly WeightedMutationCandidate[],
): ResearchMutation {
  if (candidates.length === 0) {
    throw new Error(
      "No valid mutation candidates are available for this research experiment.",
    );
  }

  return weightedRandom(
    seed,
    candidates.map(
      (candidate) => ({
        item: candidate.mutation,
        weight: candidate.weight,
      }),
    ),
  );
}

/* -------------------------------------------------------------------------- */
/*                       BUILD TABLE + ROLL HELPER                            */
/* -------------------------------------------------------------------------- */

export function rollResearchMutation({
  seed,
  mutations,
  specimen,
  primaryPath,
  secondaryPath,
  durationDays,
  intensity,
  serum,
  allowExistingMutations = false,
}: {
  seed: string;

  mutations: readonly ResearchMutation[];

  specimen: SpecimenResearchState;

  primaryPath: ResearchPath;

  secondaryPath?: ResearchPath;

  durationDays: ResearchDurationDays;

  intensity: ResearchIntensity;

  serum?: SerumEngineProfile;

  allowExistingMutations?: boolean;
}) {
  const candidates =
    buildMutationWeightTable({
      mutations,
      specimen,

      primaryPath,
      secondaryPath,

      durationDays,
      intensity,

      serum,

      allowExistingMutations,
    });

  const mutation =
    rollMutationFromTable(
      seed,
      candidates,
    );

  const candidate =
    candidates.find(
      (entry) =>
        entry.mutation.id ===
        mutation.id,
    );

  if (!candidate) {
    throw new Error(
      `Mutation ${mutation.id} was selected but could not be found in the candidate table.`,
    );
  }

  return {
    mutation,

    probability:
      candidate.probability ?? 0,

    percent:
      candidate.percent ?? 0,

    weight:
      candidate.weight,

    breakdown:
      candidate.breakdown,
  };
}

/* -------------------------------------------------------------------------- */
/*                         FAMILY PROBABILITY TABLE                           */
/* -------------------------------------------------------------------------- */

/**
 * Collapses all mutation candidates into family-level probabilities.
 *
 * This is useful for:
 *
 * Defensive      46%
 * Structural     24%
 * Metabolic      12%
 *
 * and will eventually power clone research / outcome-tree views.
 */
export function getFamilyProbabilityTable(
  candidates: readonly WeightedMutationCandidate[],
) {
  const familyWeights =
    new Map<
      MutationFamily,
      number
    >();

  for (const candidate of candidates) {
    const current =
      familyWeights.get(
        candidate.mutation.family,
      ) ?? 0;

    familyWeights.set(
      candidate.mutation.family,
      current +
        candidate.weight,
    );
  }

  const normalized =
    normalizeWeights(
      Array.from(
        familyWeights.entries(),
      ).map(
        ([family, weight]) => ({
          item: family,
          weight,
        }),
      ),
    );

  return normalized
    .map(
      ({
        item,
        weight,
        probability,
        percent,
      }) => ({
        family: item,
        weight,
        probability,
        percent,
      }),
    )
    .sort(
      (a, b) =>
        b.weight - a.weight,
    );
}

/* -------------------------------------------------------------------------- */
/*                         TOP MUTATION OUTCOMES                              */
/* -------------------------------------------------------------------------- */

export function getTopMutationCandidates(
  candidates: readonly WeightedMutationCandidate[],
  limit = 10,
) {
  return [...candidates]
    .sort(
      (a, b) =>
        (b.probability ?? 0) -
        (a.probability ?? 0),
    )
    .slice(
      0,
      Math.max(0, limit),
    );
}