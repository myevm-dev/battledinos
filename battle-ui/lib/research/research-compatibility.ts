// battle-ui/lib/research/research-compatibility.ts

import {
  COMPATIBILITY_LIMITS,
  RESEARCH_DURATION_CONFIG,
  clampResearchValue,
} from "./research-config";

import {
  getResearchFamilyWeight,
} from "./research-paths";

import type {
  SerumEngineProfile,
} from "./serum-types";

import type {
  MutationFamily,
  ResearchCompatibility,
  ResearchDurationDays,
  ResearchPath,
  SpecimenResearchState,
} from "./research-types";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export type CompatibilityInput = {
  specimen: SpecimenResearchState;

  primaryPath: ResearchPath;

  secondaryPath?: ResearchPath;

  durationDays: ResearchDurationDays;

  serum?: SerumEngineProfile;
};

export type FamilyCompatibilityEntry = {
  family: MutationFamily;

  geneticsAffinity: number;

  lineageAffinity: number;

  elementAffinity: number;

  finalCompatibility: number;
};

/* -------------------------------------------------------------------------- */
/*                              BASELINE VALUES                               */
/* -------------------------------------------------------------------------- */

/**
 * Compatibility is always represented from 0 to 1.
 *
 * 0.50 is intentionally neutral.
 */
const BASE_COMPATIBILITY =
  COMPATIBILITY_LIMITS.baseline;

/**
 * Existing mutations make related future research somewhat easier.
 *
 * We keep this modest so early mutations do not permanently lock a
 * specimen into one biological pathway.
 */
const LINEAGE_BONUS_PER_MUTATION = 0.035;

const MAX_LINEAGE_BONUS = 0.16;

/**
 * Elemental research gets a small natural compatibility bonus because
 * every Genesis template already has an elemental identity.
 */
const ELEMENTAL_BASE_AFFINITY = 0.06;

/**
 * Long studies improve our ability to work with the specimen's biology,
 * but they should not completely override poor compatibility.
 *
 * This is separate from predictability. Predictability narrows the range
 * of possible outcomes, while compatibility describes how well this
 * individual specimen responds to the chosen biology.
 */
const DURATION_COMPATIBILITY_BONUS = {
  3: -0.03,
  7: 0,
  30: 0.04,
  90: 0.07,
} satisfies Record<
  ResearchDurationDays,
  number
>;

/* -------------------------------------------------------------------------- */
/*                            GENETICS NORMALIZATION                          */
/* -------------------------------------------------------------------------- */

/**
 * Edition genetics are multipliers such as:
 *
 * health: 1.02
 * attack: 0.98
 * defense: 1.04
 * speed: 1.01
 *
 * Convert those values into a small compatibility influence.
 *
 * 1.00 genetics = neutral
 * 1.05 genetics = positive tendency
 * 0.95 genetics = negative tendency
 */
function geneticsToAffinity(
  value: number | undefined,
): number {
  if (
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return 0;
  }

  /**
   * 0.05 above baseline becomes +0.10 compatibility influence.
   *
   * 0.05 below baseline becomes -0.10.
   */
  return Math.max(
    -0.12,
    Math.min(
      0.12,
      (value - 1) * 2,
    ),
  );
}

/* -------------------------------------------------------------------------- */
/*                         FAMILY GENETIC AFFINITY                            */
/* -------------------------------------------------------------------------- */

/**
 * Different research families care about different parts of the
 * specimen's inherited genetics.
 *
 * These are biological tendencies, not combat bonuses.
 */
export function getFamilyGeneticsAffinity(
  specimen: SpecimenResearchState,
  family: MutationFamily,
): number {
  const health =
    geneticsToAffinity(
      specimen.genetics.health,
    );

  const attack =
    geneticsToAffinity(
      specimen.genetics.attack,
    );

  const defense =
    geneticsToAffinity(
      specimen.genetics.defense,
    );

  const speed =
    geneticsToAffinity(
      specimen.genetics.speed,
    );

  switch (family) {
    case "Structural":
      return (
        defense * 0.55 +
        health * 0.30 +
        attack * 0.15
      );

    case "Metabolic":
      return (
        health * 0.55 +
        speed * 0.30 +
        defense * 0.15
      );

    case "Neural":
      return (
        speed * 0.60 +
        attack * 0.25 +
        health * 0.15
      );

    case "Cross-Species":
      /**
       * Cross-species compatibility should not be strongly predicted
       * by ordinary Genesis combat genetics.
       */
      return (
        health * 0.20 +
        attack * 0.20 +
        defense * 0.20 +
        speed * 0.20
      );

    case "Elemental":
      return (
        attack * 0.35 +
        health * 0.25 +
        speed * 0.20 +
        defense * 0.20
      );

    case "Defensive":
      return (
        defense * 0.60 +
        health * 0.30 +
        speed * 0.10
      );

    case "Offensive":
      return (
        attack * 0.65 +
        speed * 0.20 +
        health * 0.15
      );

    case "Mobility":
      return (
        speed * 0.70 +
        health * 0.20 +
        attack * 0.10
      );

    case "Wildcard":
      /**
       * Wildcard intentionally ignores most predictable genetic
       * advantages.
       */
      return (
        (
          health +
          attack +
          defense +
          speed
        ) /
        4
      ) * 0.25;

    default:
      return 0;
  }
}

/* -------------------------------------------------------------------------- */
/*                             LINEAGE AFFINITY                               */
/* -------------------------------------------------------------------------- */

export function getFamilyLineageAffinity(
  specimen: SpecimenResearchState,
  family: MutationFamily,
): number {
  const matching =
    specimen.mutations.filter(
      (mutation) =>
        mutation.family === family,
    );

  if (matching.length === 0) {
    return 0;
  }

  /**
   * Strong, stable existing expressions contribute slightly more than
   * weak expressions.
   */
  const expressionContribution =
    matching.reduce(
      (total, mutation) => {
        const expression =
          mutation.expressionStrength ??
          0.5;

        const stability =
          mutation.stability ??
          0.5;

        const quality =
          (
            expression +
            stability
          ) /
          2;

        return (
          total +
          LINEAGE_BONUS_PER_MUTATION *
            quality
        );
      },
      0,
    );

  return Math.min(
    MAX_LINEAGE_BONUS,
    expressionContribution,
  );
}

/* -------------------------------------------------------------------------- */
/*                             ELEMENT AFFINITY                               */
/* -------------------------------------------------------------------------- */

export function getFamilyElementAffinity(
  specimen: SpecimenResearchState,
  family: MutationFamily,
): number {
  if (family !== "Elemental") {
    return 0;
  }

  if (
    !specimen.element ||
    specimen.element.trim() === ""
  ) {
    return 0;
  }

  return ELEMENTAL_BASE_AFFINITY;
}

/* -------------------------------------------------------------------------- */
/*                         FAMILY COMPATIBILITY                               */
/* -------------------------------------------------------------------------- */

export function calculateFamilyCompatibility(
  specimen: SpecimenResearchState,
  family: MutationFamily,
): FamilyCompatibilityEntry {
  const geneticsAffinity =
    getFamilyGeneticsAffinity(
      specimen,
      family,
    );

  const lineageAffinity =
    getFamilyLineageAffinity(
      specimen,
      family,
    );

  const elementAffinity =
    getFamilyElementAffinity(
      specimen,
      family,
    );

  const finalCompatibility =
    clampResearchValue(
      BASE_COMPATIBILITY +
        geneticsAffinity +
        lineageAffinity +
        elementAffinity,
    );

  return {
    family,

    geneticsAffinity,

    lineageAffinity,

    elementAffinity,

    finalCompatibility,
  };
}

/* -------------------------------------------------------------------------- */
/*                       ALL FAMILY COMPATIBILITIES                           */
/* -------------------------------------------------------------------------- */

const MUTATION_FAMILIES: MutationFamily[] = [
  "Structural",
  "Metabolic",
  "Neural",
  "Cross-Species",
  "Elemental",
  "Defensive",
  "Offensive",
  "Mobility",
  "Wildcard",
];

export function calculateAllFamilyCompatibility(
  specimen: SpecimenResearchState,
) {
  return MUTATION_FAMILIES.map(
    (family) =>
      calculateFamilyCompatibility(
        specimen,
        family,
      ),
  );
}

/* -------------------------------------------------------------------------- */
/*                           PATH COMPATIBILITY                               */
/* -------------------------------------------------------------------------- */

/**
 * A research path can favor several mutation families.
 *
 * Example:
 *
 * Defensive Research favors:
 *
 * Defensive
 * Structural
 * Metabolic
 *
 * Therefore path compatibility should consider more than only the
 * Defensive family's value.
 */
export function calculatePathCompatibility(
  specimen: SpecimenResearchState,
  path: ResearchPath,
): number {
  const familyCompatibility =
    calculateAllFamilyCompatibility(
      specimen,
    );

  let weightedTotal = 0;

  let totalWeight = 0;

  for (
    const entry
    of familyCompatibility
  ) {
    const pathWeight =
      getResearchFamilyWeight(
        path,
        entry.family,
      );

    /**
     * Only positive path relationships contribute.
     *
     * Families suppressed below 1 should still matter slightly,
     * but they should not dominate compatibility.
     */
    const effectiveWeight =
      Math.max(
        0.25,
        pathWeight,
      );

    weightedTotal +=
      entry.finalCompatibility *
      effectiveWeight;

    totalWeight +=
      effectiveWeight;
  }

  if (totalWeight <= 0) {
    return BASE_COMPATIBILITY;
  }

  return clampResearchValue(
    weightedTotal /
      totalWeight,
  );
}

/* -------------------------------------------------------------------------- */
/*                         SECONDARY PATH EFFECT                              */
/* -------------------------------------------------------------------------- */

function calculateCombinedPathCompatibility({
  specimen,
  primaryPath,
  secondaryPath,
}: {
  specimen: SpecimenResearchState;
  primaryPath: ResearchPath;
  secondaryPath?: ResearchPath;
}) {
  const primary =
    calculatePathCompatibility(
      specimen,
      primaryPath,
    );

  if (!secondaryPath) {
    return primary;
  }

  const secondary =
    calculatePathCompatibility(
      specimen,
      secondaryPath,
    );

  /**
   * Primary direction remains dominant.
   */
  return clampResearchValue(
    primary * 0.75 +
      secondary * 0.25,
  );
}

/* -------------------------------------------------------------------------- */
/*                            SERUM COMPATIBILITY                             */
/* -------------------------------------------------------------------------- */

/**
 * Serum compatibility asks:
 *
 * "Does this serum's intended biological weighting align with this
 * particular specimen?"
 *
 * This is separate from serum potency.
 */
export function calculateSerumCompatibility(
  specimen: SpecimenResearchState,
  serum?: SerumEngineProfile,
): number | undefined {
  if (!serum) {
    return undefined;
  }

  const familyEntries =
    calculateAllFamilyCompatibility(
      specimen,
    );

  const serumFamilyWeights =
    serum.familyWeights ?? {};

  let totalWeightedCompatibility = 0;

  let totalSerumWeight = 0;

  for (
    const entry
    of familyEntries
  ) {
    const serumWeight =
      serumFamilyWeights[
        entry.family
      ];

    if (
      serumWeight === undefined ||
      serumWeight <= 1
    ) {
      continue;
    }

    /**
     * Only count the amount above neutral.
     *
     * 1.0 = no intentional influence
     * 1.8 = +0.8 serum emphasis
     */
    const emphasis =
      serumWeight - 1;

    totalWeightedCompatibility +=
      entry.finalCompatibility *
      emphasis;

    totalSerumWeight += emphasis;
  }

  /**
   * A serum with no special family weighting is treated as neutral.
   */
  if (totalSerumWeight <= 0) {
    return BASE_COMPATIBILITY;
  }

  return clampResearchValue(
    totalWeightedCompatibility /
      totalSerumWeight,
  );
}

/* -------------------------------------------------------------------------- */
/*                         DURATION COMPATIBILITY                             */
/* -------------------------------------------------------------------------- */

function applyDurationCompatibility(
  compatibility: number,
  durationDays: ResearchDurationDays,
) {
  const modifier =
    DURATION_COMPATIBILITY_BONUS[
      durationDays
    ];

  return clampResearchValue(
    compatibility +
      modifier,
  );
}

/* -------------------------------------------------------------------------- */
/*                         STABILITY MODIFIER                                 */
/* -------------------------------------------------------------------------- */

/**
 * Compatibility influences final mutation stability.
 *
 * High compatibility gives a small positive stability modifier.
 * Poor compatibility gives a negative modifier.
 */
export function getCompatibilityStabilityModifier(
  compatibility: number,
): number {
  const centered =
    compatibility -
    BASE_COMPATIBILITY;

  return Math.max(
    -0.15,
    Math.min(
      0.15,
      centered * 0.3,
    ),
  );
}

/* -------------------------------------------------------------------------- */
/*                          COMPATIBILITY NOTES                               */
/* -------------------------------------------------------------------------- */

function getCompatibilityLabel(
  value: number,
) {
  if (value >= 0.95) {
    return "Exceptional";
  }

  if (value >= 0.8) {
    return "High";
  }

  if (value >= 0.6) {
    return "Good";
  }

  if (value >= 0.4) {
    return "Moderate";
  }

  return "Poor";
}

function buildCompatibilityNotes({
  specimen,
  primaryPath,
  overall,
  serumCompatibility,
}: {
  specimen: SpecimenResearchState;

  primaryPath: ResearchPath;

  overall: number;

  serumCompatibility?: number;
}) {
  const notes: string[] = [];

  notes.push(
    `${primaryPath} compatibility: ${getCompatibilityLabel(
      overall,
    )}`,
  );

  const existingFamilyMutations =
    specimen.mutations.filter(
      (mutation) =>
        mutation.family ===
        primaryPath,
    ).length;

  if (existingFamilyMutations > 0) {
    notes.push(
      `Existing ${primaryPath} lineage detected`,
    );
  }

  if (
    primaryPath === "Elemental" &&
    specimen.element
  ) {
    notes.push(
      `${specimen.element} elemental identity contributes to compatibility`,
    );
  }

  if (
    serumCompatibility !== undefined
  ) {
    notes.push(
      `Serum compatibility: ${getCompatibilityLabel(
        serumCompatibility,
      )}`,
    );
  }

  return notes;
}

/* -------------------------------------------------------------------------- */
/*                       COMPLETE RESEARCH COMPATIBILITY                      */
/* -------------------------------------------------------------------------- */

export function calculateResearchCompatibility({
  specimen,
  primaryPath,
  secondaryPath,
  durationDays,
  serum,
}: CompatibilityInput): ResearchCompatibility {
  const familyEntries =
    calculateAllFamilyCompatibility(
      specimen,
    );

  const familyCompatibility =
    Object.fromEntries(
      familyEntries.map(
        (entry) => [
          entry.family,
          entry.finalCompatibility,
        ],
      ),
    ) as Partial<
      Record<
        MutationFamily,
        number
      >
    >;

  const pathCompatibility =
    calculateCombinedPathCompatibility({
      specimen,
      primaryPath,
      secondaryPath,
    });

  const serumCompatibility =
    calculateSerumCompatibility(
      specimen,
      serum,
    );

  /**
   * The specimen's path compatibility matters most.
   *
   * A serum can improve our confidence about the biological direction,
   * but it does not replace the specimen's genetics.
   */
  let overall =
    serumCompatibility === undefined
      ? pathCompatibility
      : pathCompatibility * 0.78 +
        serumCompatibility * 0.22;

  overall =
    applyDurationCompatibility(
      overall,
      durationDays,
    );

  overall =
    clampResearchValue(
      overall,
    );

  const durationStability =
    RESEARCH_DURATION_CONFIG[
      durationDays
    ].stabilityModifier;

  const compatibilityStability =
    getCompatibilityStabilityModifier(
      overall,
    );

  const serumStability =
    serum?.stabilityModifier ??
    0;

  const stabilityModifier =
    Math.max(
      -0.25,
      Math.min(
        0.30,
        durationStability +
          compatibilityStability +
          serumStability,
      ),
    );

  return {
    overall,

    familyCompatibility,

    serumCompatibility,

    stabilityModifier,

    notes:
      buildCompatibilityNotes({
        specimen,
        primaryPath,
        overall,
        serumCompatibility,
      }),
  };
}

/* -------------------------------------------------------------------------- */
/*                              UI HELPERS                                    */
/* -------------------------------------------------------------------------- */

export function getCompatibilityDisplay(
  compatibility: number,
) {
  const value =
    clampResearchValue(
      compatibility,
    );

  return {
    value,

    percent:
      Math.round(
        value * 100,
      ),

    label:
      getCompatibilityLabel(
        value,
      ),
  };
}