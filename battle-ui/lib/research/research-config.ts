// battle-ui/lib/research/research-config.ts

import type {
  MutationRarity,
  ResearchDurationDays,
  ResearchIntensity,
} from "./research-types";

/**
 * Central balancing configuration for the SPECIMEN research system.
 *
 * Keep numerical tuning here whenever possible so the actual research
 * engine does not become filled with hardcoded balance values.
 *
 * These values are initial game-design values and can be rebalanced.
 */

/* -------------------------------------------------------------------------- */
/*                                  RARITY                                    */
/* -------------------------------------------------------------------------- */

export const MUTATION_RARITY_WEIGHTS = {
  Common: 38,
  Uncommon: 28,
  Rare: 18,
  Epic: 10,
  Legendary: 6,
} satisfies Record<MutationRarity, number>;

/**
 * Used when research conditions increase or decrease the likelihood
 * of rarer mutation expressions.
 *
 * A value of 1 means no change.
 */
export const RARITY_TIER_MULTIPLIERS = {
  Common: 1,
  Uncommon: 1,
  Rare: 1,
  Epic: 1,
  Legendary: 1,
} satisfies Record<MutationRarity, number>;

/* -------------------------------------------------------------------------- */
/*                              RESEARCH INTENSITY                            */
/* -------------------------------------------------------------------------- */

export type ResearchIntensityConfig = {
  /**
   * Modifier applied to mutation expression strength.
   */
  expressionMultiplier: number;

  /**
   * Flat modifier added to final stability.
   */
  stabilityModifier: number;

  /**
   * Multiplier applied to Rare mutation weight.
   */
  rareWeightMultiplier: number;

  /**
   * Multiplier applied to Epic mutation weight.
   */
  epicWeightMultiplier: number;

  /**
   * Multiplier applied to Legendary mutation weight.
   */
  legendaryWeightMultiplier: number;

  /**
   * Multiplier applied to anomaly probability.
   */
  anomalyMultiplier: number;

  /**
   * Multiplier used later when calculating XP cost.
   */
  xpCostMultiplier: number;
};

export const RESEARCH_INTENSITY_CONFIG = {
  low: {
    expressionMultiplier: 0.85,
    stabilityModifier: 0.1,

    rareWeightMultiplier: 0.9,
    epicWeightMultiplier: 0.8,
    legendaryWeightMultiplier: 0.7,

    anomalyMultiplier: 0.5,

    xpCostMultiplier: 0.75,
  },

  standard: {
    expressionMultiplier: 1,
    stabilityModifier: 0,

    rareWeightMultiplier: 1,
    epicWeightMultiplier: 1,
    legendaryWeightMultiplier: 1,

    anomalyMultiplier: 1,

    xpCostMultiplier: 1,
  },

  high: {
    expressionMultiplier: 1.15,
    stabilityModifier: -0.1,

    rareWeightMultiplier: 1.15,
    epicWeightMultiplier: 1.25,
    legendaryWeightMultiplier: 1.35,

    anomalyMultiplier: 1.75,

    xpCostMultiplier: 1.4,
  },
} satisfies Record<ResearchIntensity, ResearchIntensityConfig>;

/* -------------------------------------------------------------------------- */
/*                              RESEARCH DURATION                             */
/* -------------------------------------------------------------------------- */

export type ResearchDurationConfig = {
  days: ResearchDurationDays;

  /**
   * How controlled and predictable the research process is.
   *
   * This is useful for:
   * - UI
   * - clone research confidence
   * - research reporting
   * - formula / serum marketplace analytics
   *
   * It is NOT a direct mutation probability.
   */
  predictability: number;

  /**
   * Controls how wide mutation expression strength can vary.
   *
   * 1 = baseline variance
   * > 1 = wider and more experimental
   * < 1 = tighter and more predictable
   */
  expressionVarianceMultiplier: number;

  /**
   * Improves the stability of whatever mutation is expressed.
   *
   * Longer research is intended to produce cleaner, more controlled
   * experiments rather than simply stronger creatures.
   */
  stabilityModifier: number;

  /**
   * Strengthens the influence of the selected research path.
   *
   * Higher values cause outcomes to cluster more closely around the
   * player's intended research direction.
   */
  pathFocusMultiplier: number;

  /**
   * Strengthens a serum's weighting effect.
   *
   * Longer research gives a proven serum more opportunity to influence
   * the result, but never guarantees a specific mutation.
   */
  serumFocusMultiplier: number;

  /**
   * Influences the probability of secondary mutation expression.
   */
  secondaryExpressionMultiplier: number;

  /**
   * Determines how valuable this experiment is when contributing to
   * formula statistics and observed research history.
   */
  researchDataWeight: number;

  /**
   * Used later when calculating clone research confidence.
   */
  cloneConfidenceMultiplier: number;

  /**
   * Used later when calculating XP requirements.
   */
  xpCostMultiplier: number;
};

export const RESEARCH_DURATION_CONFIG = {
  3: {
    days: 3,

    predictability: 0.35,
    expressionVarianceMultiplier: 1.25,

    stabilityModifier: -0.06,

    pathFocusMultiplier: 0.9,

    serumFocusMultiplier: 0.85,

    secondaryExpressionMultiplier: 0.8,

    researchDataWeight: 1,

    cloneConfidenceMultiplier: 0.8,

    xpCostMultiplier: 0.7,
  },

  7: {
    days: 7,

    predictability: 0.5,
    expressionVarianceMultiplier: 1,

    stabilityModifier: 0,

    pathFocusMultiplier: 1,

    serumFocusMultiplier: 1,

    secondaryExpressionMultiplier: 1,

    researchDataWeight: 1.5,

    cloneConfidenceMultiplier: 1,

    xpCostMultiplier: 1,
  },

  30: {
    days: 30,

    predictability: 0.75,
    expressionVarianceMultiplier: 0.65,

    stabilityModifier: 0.08,

    pathFocusMultiplier: 1.12,

    serumFocusMultiplier: 1.2,

    secondaryExpressionMultiplier: 1.1,

    researchDataWeight: 3,

    cloneConfidenceMultiplier: 1.2,

    xpCostMultiplier: 1.65,
  },

  90: {
    days: 90,

    predictability: 0.92,
    expressionVarianceMultiplier: 0.35,

    stabilityModifier: 0.14,

    pathFocusMultiplier: 1.22,

    serumFocusMultiplier: 1.35,

    secondaryExpressionMultiplier: 1.15,

    researchDataWeight: 6,

    cloneConfidenceMultiplier: 1.35,

    xpCostMultiplier: 2.5,
  },
} satisfies Record<ResearchDurationDays, ResearchDurationConfig>;

/* -------------------------------------------------------------------------- */
/*                            MUTATION COUNT                                  */
/* -------------------------------------------------------------------------- */

/**
 * Base probability distribution for the number of mutations expressed
 * during one completed research evolution.
 *
 * These probabilities total 1.
 *
 * An anomaly is handled separately and does not replace this roll.
 */
export const BASE_MUTATION_COUNT_WEIGHTS = {
  0: 0.15,
  1: 0.56,
  2: 0.23,
  3: 0.06,
} as const;

/**
 * Longer research slightly reduces the chance of producing no usable
 * expression, but should not turn long research into automatic power creep.
 */
export const DURATION_MUTATION_COUNT_MODIFIERS = {
  3: {
    zeroMutationMultiplier: 1.15,
    multiMutationMultiplier: 0.9,
  },

  7: {
    zeroMutationMultiplier: 1,
    multiMutationMultiplier: 1,
  },

  30: {
    zeroMutationMultiplier: 0.8,
    multiMutationMultiplier: 1.08,
  },

  90: {
    zeroMutationMultiplier: 0.65,
    multiMutationMultiplier: 1.12,
  },
} satisfies Record<
  ResearchDurationDays,
  {
    zeroMutationMultiplier: number;
    multiMutationMultiplier: number;
  }
>;

/* -------------------------------------------------------------------------- */
/*                                 ANOMALIES                                  */
/* -------------------------------------------------------------------------- */

/**
 * Base chance of an anomaly occurring during research.
 *
 * 0.01 = 1%
 *
 * Intensity and other research conditions can modify this later.
 */
export const BASE_ANOMALY_CHANCE = 0.01;

/**
 * Hard limits prevent balancing modifiers from creating absurd values.
 */
export const MIN_ANOMALY_CHANCE = 0.001;
export const MAX_ANOMALY_CHANCE = 0.08;

/* -------------------------------------------------------------------------- */
/*                              COMPATIBILITY                                 */
/* -------------------------------------------------------------------------- */

/**
 * Compatibility is represented internally as 0 through 1.
 */
export const COMPATIBILITY_LIMITS = {
  min: 0,
  max: 1,
  baseline: 0.5,
};

export const COMPATIBILITY_BANDS = {
  poor: {
    min: 0,
    max: 0.39,
  },

  moderate: {
    min: 0.4,
    max: 0.59,
  },

  good: {
    min: 0.6,
    max: 0.79,
  },

  high: {
    min: 0.8,
    max: 0.94,
  },

  exceptional: {
    min: 0.95,
    max: 1,
  },
} as const;

/* -------------------------------------------------------------------------- */
/*                           EXPRESSION STRENGTH                              */
/* -------------------------------------------------------------------------- */

/**
 * Mutation expression strength controls how strongly a mutation manifests.
 *
 * Example:
 *
 * Iron Hide at 0.35
 * = light dermal reinforcement
 *
 * Iron Hide at 0.90
 * = major armored plating
 */
export const EXPRESSION_STRENGTH = {
  min: 0.2,
  max: 1,

  baselineMin: 0.4,
  baselineMax: 0.8,
};

/* -------------------------------------------------------------------------- */
/*                                STABILITY                                   */
/* -------------------------------------------------------------------------- */

export const MUTATION_STABILITY = {
  min: 0.2,
  max: 1,

  baselineMin: 0.55,
  baselineMax: 0.85,
};

/* -------------------------------------------------------------------------- */
/*                              SERUM CONTROL                                 */
/* -------------------------------------------------------------------------- */

/**
 * Serums should narrow probabilities, not provide guaranteed mutations.
 *
 * This cap limits how much any normal serum can dominate the mutation pool.
 *
 * Special future project items could use different rules, but the normal
 * research engine should obey this limit.
 */
export const SERUM_CONFIG = {
  /**
   * A normal serum's final mutation weight multiplier cannot exceed this.
   */
  maxMutationWeightMultiplier: 4,

  /**
   * Maximum family-level multiplier.
   */
  maxFamilyWeightMultiplier: 3,

  /**
   * Minimum probability that should remain available to outcomes outside
   * the serum's strongest target group.
   */
  minimumOutcomeDiversity: 0.08,

  /**
   * Maximum direct stability bonus a serum can provide.
   */
  maxStabilityModifier: 0.15,
};

/* -------------------------------------------------------------------------- */
/*                           SECONDARY EXPRESSIONS                            */
/* -------------------------------------------------------------------------- */

export const SECONDARY_EXPRESSION_CONFIG = {
  /**
   * Base chance that a successful single-expression research event
   * develops a secondary mutation.
   */
  baseChance: 0.16,

  minChance: 0.05,

  maxChance: 0.4,
};

/* -------------------------------------------------------------------------- */
/*                               XP ECONOMY                                   */
/* -------------------------------------------------------------------------- */

/**
 * These are intentionally initial values.
 *
 * The progression economy should be tested against real battle XP output
 * before treating these as final.
 */
export const BASE_RESEARCH_XP_COST = 250;

export const EVOLUTION_STAGE_XP_MULTIPLIERS = {
  0: 1,
  1: 1.75,
  2: 3,
  3: 4.5,
} as const;

/**
 * Example calculation:
 *
 * XP Cost =
 * BASE_RESEARCH_XP_COST
 * × Duration Multiplier
 * × Intensity Multiplier
 * × Evolution Stage Multiplier
 */
export function getResearchXpCost({
  durationDays,
  intensity,
  evolutionStage,
}: {
  durationDays: ResearchDurationDays;
  intensity: ResearchIntensity;
  evolutionStage: 0 | 1 | 2 | 3;
}) {
  const duration =
    RESEARCH_DURATION_CONFIG[durationDays];

  const intensityConfig =
    RESEARCH_INTENSITY_CONFIG[intensity];

  const stageMultiplier =
    EVOLUTION_STAGE_XP_MULTIPLIERS[evolutionStage];

  return Math.round(
    BASE_RESEARCH_XP_COST *
      duration.xpCostMultiplier *
      intensityConfig.xpCostMultiplier *
      stageMultiplier,
  );
}

/* -------------------------------------------------------------------------- */
/*                              HELPER LIMITS                                 */
/* -------------------------------------------------------------------------- */

export function clampResearchValue(
  value: number,
  min = 0,
  max = 1,
) {
  return Math.min(max, Math.max(min, value));
}