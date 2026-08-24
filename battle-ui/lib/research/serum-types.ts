// battle-ui/lib/research/serum-types.ts

import type {
  MutationFamily,
  MutationRarity,
  ResearchPath,
} from "./research-types";

/* -------------------------------------------------------------------------- */
/*                                CORE TYPES                                  */
/* -------------------------------------------------------------------------- */

export type SerumOrigin =
  | "project"
  | "lab";

export type FormulaStatus =
  | "experimental"
  | "observed"
  | "certified"
  | "retired";

export type SerumBatchStatus =
  | "active"
  | "depleted"
  | "expired"
  | "retired";

/* -------------------------------------------------------------------------- */
/*                             FORMULA TARGETING                              */
/* -------------------------------------------------------------------------- */

export type FormulaFamilyWeights =
  Partial<
    Record<
      MutationFamily,
      number
    >
  >;

export type FormulaMutationWeights =
  Record<
    string,
    number
  >;

/**
 * Optional rarity influence.
 *
 * These are multipliers, not direct probabilities.
 *
 * Example:
 *
 * Rare: 1.10
 * Epic: 1.20
 *
 * means the formula slightly favors those tiers.
 */
export type FormulaRarityWeights =
  Partial<
    Record<
      MutationRarity,
      number
    >
  >;

/* -------------------------------------------------------------------------- */
/*                              FORMULA INPUTS                                */
/* -------------------------------------------------------------------------- */

/**
 * These represent the research recipe itself.
 *
 * A formula is effectively a saved experimental strategy.
 */
export type FormulaResearchProfile = {
  primaryPath: ResearchPath;

  secondaryPath?: ResearchPath;

  /**
   * Optional third influence used during formula development.
   *
   * This does not have to appear in ordinary player-facing research.
   */
  catalystPath?: ResearchPath;

  familyWeights: FormulaFamilyWeights;

  mutationWeights: FormulaMutationWeights;

  rarityWeights?: FormulaRarityWeights;

  /**
   * Flat modifier applied to mutation stability.
   *
   * Recommended normal range:
   * -0.15 to +0.15
   */
  stabilityModifier: number;

  /**
   * Multiplier applied to final expression strength.
   *
   * 1 = neutral
   */
  expressionModifier: number;
};

/* -------------------------------------------------------------------------- */
/*                            FORMULA DISCOVERY                               */
/* -------------------------------------------------------------------------- */

export type FormulaCreator = {
  type:
    | "project"
    | "wallet";

  wallet?: string;

  displayName?: string;
};

export type FormulaDiscovery = {
  /**
   * Number of valid research experiments contributing to the formula.
   */
  experimentCount: number;

  /**
   * Weighted amount of research evidence.
   *
   * A 90-day experiment can eventually contribute more evidence than
   * a 3-day experiment.
   */
  researchWeight: number;

  /**
   * Number of unique specimens tested.
   */
  uniqueSpecimens: number;

  /**
   * Number of different base templates tested.
   */
  uniqueBaseTemplates: number;

  firstObservedAt?: number;

  lastObservedAt?: number;

  certifiedAt?: number;
};

/* -------------------------------------------------------------------------- */
/*                           OBSERVED OUTCOMES                                */
/* -------------------------------------------------------------------------- */

export type FormulaMutationObservation = {
  mutationId: string;

  mutationName?: string;

  family: MutationFamily;

  count: number;

  /**
   * Observed frequency from actual completed tests.
   *
   * This should be shown to users as observedRate rather than guaranteed
   * probability.
   */
  observedRate: number;

  averageExpressionStrength: number;

  averageStability: number;
};

export type FormulaFamilyObservation = {
  family: MutationFamily;

  count: number;

  observedRate: number;
};

export type FormulaOutcomeStats = {
  successfulExperiments: number;

  zeroMutationExperiments: number;

  anomalyExperiments: number;

  mutationObservations: FormulaMutationObservation[];

  familyObservations: FormulaFamilyObservation[];

  averageStability: number;

  averageMutationCount: number;
};

/* -------------------------------------------------------------------------- */
/*                           SPECIMEN COMPATIBILITY                           */
/* -------------------------------------------------------------------------- */

export type FormulaCompatibilityRecord = {
  baseId: number;

  specimenCount: number;

  experimentCount: number;

  averageCompatibility: number;

  averageStability: number;

  /**
   * Optional dominant observed mutation.
   */
  dominantMutationId?: string;

  dominantMutationObservedRate?: number;
};

export type FormulaElementCompatibility = {
  element: string;

  experimentCount: number;

  averageCompatibility: number;

  averageStability: number;
};

/* -------------------------------------------------------------------------- */
/*                                 FORMULA                                    */
/* -------------------------------------------------------------------------- */

export type SerumFormula = {
  id: string;

  name: string;

  /**
   * User-facing short identifier.
   *
   * Example:
   * IRONBLOOM-7
   */
  code: string;

  version: number;

  origin: SerumOrigin;

  status: FormulaStatus;

  creator: FormulaCreator;

  description?: string;

  profile: FormulaResearchProfile;

  discovery: FormulaDiscovery;

  outcomes: FormulaOutcomeStats;

  specimenCompatibility?: FormulaCompatibilityRecord[];

  elementCompatibility?: FormulaElementCompatibility[];

  /**
   * Tags for search, marketplace filters, and research reports.
   */
  tags: string[];

  createdAt: number;

  updatedAt: number;
};

/* -------------------------------------------------------------------------- */
/*                              SERUM BATCH                                   */
/* -------------------------------------------------------------------------- */

/**
 * A formula is knowledge.
 *
 * A serum is a usable instance manufactured from that knowledge.
 */
export type SerumBatch = {
  id: string;

  formulaId: string;

  formulaVersion: number;

  batchNumber: number;

  status: SerumBatchStatus;

  manufacturer: {
    wallet?: string;

    displayName?: string;
  };

  /**
   * Number of research uses represented by this batch.
   */
  totalUses: number;

  usesRemaining: number;

  createdAt: number;

  expiresAt?: number;
};

/* -------------------------------------------------------------------------- */
/*                             SERUM INSTANCE                                 */
/* -------------------------------------------------------------------------- */

/**
 * If individual serum items become inventory objects later, this can represent
 * a single usable dose.
 *
 * You may not need to mint or store these individually initially.
 */
export type SerumDose = {
  id: string;

  formulaId: string;

  batchId: string;

  owner?: string;

  consumed: boolean;

  consumedAt?: number;

  researchId?: string;

  createdAt: number;
};

/* -------------------------------------------------------------------------- */
/*                        ENGINE-FACING WEIGHT PROFILE                        */
/* -------------------------------------------------------------------------- */

/**
 * This is the simplified serum object consumed by research-weights.ts
 * and research-compatibility.ts.
 *
 * The research engine does not need marketplace metadata, creator info,
 * observation history, etc.
 */
export type SerumEngineProfile = {
  serumId: string;

  formulaId: string;

  formulaVersion: number;

  familyWeights: FormulaFamilyWeights;

  mutationWeights: FormulaMutationWeights;

  rarityWeights?: FormulaRarityWeights;

  stabilityModifier: number;

  expressionModifier: number;
};

/* -------------------------------------------------------------------------- */
/*                             RESEARCH RECORD                                */
/* -------------------------------------------------------------------------- */

/**
 * Records one actual serum use.
 *
 * This later becomes part of the empirical research dataset used to evaluate
 * the formula.
 */
export type SerumResearchRecord = {
  researchId: string;

  formulaId: string;

  formulaVersion: number;

  serumBatchId?: string;

  specimenTokenId: number;

  specimenBaseId: number;

  specimenElement: string;

  compatibility: number;

  mutationIds: string[];

  mutationFamilies: MutationFamily[];

  averageExpressionStrength: number;

  averageStability: number;

  anomalyOccurred: boolean;

  durationDays:
    | 3
    | 7
    | 30
    | 90;

  completedAt: number;
};

/* -------------------------------------------------------------------------- */
/*                            FORMULA CERTIFICATION                           */
/* -------------------------------------------------------------------------- */

export type FormulaCertificationRequirements = {
  minimumExperiments: number;

  minimumUniqueSpecimens: number;

  minimumUniqueBaseTemplates: number;

  minimumResearchWeight: number;

  maximumAnomalyRate?: number;
};

export const DEFAULT_FORMULA_CERTIFICATION_REQUIREMENTS: FormulaCertificationRequirements =
  {
    minimumExperiments: 20,

    minimumUniqueSpecimens: 10,

    minimumUniqueBaseTemplates: 3,

    minimumResearchWeight: 25,

    maximumAnomalyRate: 0.15,
  };

/* -------------------------------------------------------------------------- */
/*                                HELPERS                                     */
/* -------------------------------------------------------------------------- */

export function isFormulaCertified(
  formula: SerumFormula,
) {
  return (
    formula.status ===
    "certified"
  );
}

export function hasSerumUsesRemaining(
  serum: SerumBatch,
) {
  return (
    serum.status === "active" &&
    serum.usesRemaining > 0
  );
}

export function getSerumEngineProfile({
  formula,
  serum,
}: {
  formula: SerumFormula;

  serum?: SerumBatch;
}): SerumEngineProfile {
  if (
    serum &&
    serum.formulaId !== formula.id
  ) {
    throw new Error(
      `Serum batch ${serum.id} does not belong to formula ${formula.id}.`,
    );
  }

  if (
    serum &&
    serum.formulaVersion !==
      formula.version
  ) {
    throw new Error(
      `Serum batch ${serum.id} uses formula version ${serum.formulaVersion}, but formula ${formula.id} is currently version ${formula.version}.`,
    );
  }

  return {
    serumId:
      serum?.id ??
      `formula:${formula.id}`,

    formulaId:
      formula.id,

    formulaVersion:
      formula.version,

    familyWeights:
      formula.profile
        .familyWeights,

    mutationWeights:
      formula.profile
        .mutationWeights,

    rarityWeights:
      formula.profile
        .rarityWeights,

    stabilityModifier:
      formula.profile
        .stabilityModifier,

    expressionModifier:
      formula.profile
        .expressionModifier,
  };
}