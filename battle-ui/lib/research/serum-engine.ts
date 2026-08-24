// battle-ui/lib/research/serum-engine.ts

import {
  RESEARCH_DURATION_CONFIG,
  SERUM_CONFIG,
  clampResearchValue,
} from "./research-config";

import {
  calculateSerumCompatibility,
} from "./research-compatibility";

import type {
  MutationFamily,
  MutationRarity,
  ResearchDurationDays,
  SpecimenResearchState,
} from "./research-types";

import type {
  FormulaFamilyWeights,
  FormulaMutationWeights,
  FormulaRarityWeights,
  SerumBatch,
  SerumEngineProfile,
  SerumFormula,
} from "./serum-types";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export type SerumValidationIssue = {
  field: string;
  message: string;
};

export type SerumValidationResult = {
  valid: boolean;
  issues: SerumValidationIssue[];
};

export type SerumInfluence = {
  serumId: string;

  formulaId: string;

  formulaVersion: number;

  /**
   * Safe, capped profile that can be passed into research-weights.ts.
   */
  profile: SerumEngineProfile;

  /**
   * How well the serum fits this individual specimen.
   */
  compatibility: number;

  /**
   * 0-1 convenience value representing how strongly the serum should
   * effectively influence this particular experiment.
   *
   * This is not an outcome probability.
   */
  effectiveness: number;

  /**
   * Final stability modifier contributed by the serum.
   */
  stabilityModifier: number;

  /**
   * Final expression multiplier contributed by the serum.
   */
  expressionModifier: number;

  durationFocusMultiplier: number;

  notes: string[];
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

function isFinitePositive(
  value: number,
) {
  return (
    Number.isFinite(value) &&
    value > 0
  );
}

/* -------------------------------------------------------------------------- */
/*                             FAMILY WEIGHTS                                 */
/* -------------------------------------------------------------------------- */

/**
 * Family weight:
 *
 * 1.0 = neutral
 * >1 = favored
 * <1 = suppressed
 *
 * Normal formulas cannot exceed the platform safety caps.
 */
export function sanitizeFamilyWeights(
  weights: FormulaFamilyWeights,
): FormulaFamilyWeights {
  const result: FormulaFamilyWeights =
    {};

  for (
    const [family, value]
    of Object.entries(weights)
  ) {
    if (
      !Number.isFinite(value)
    ) {
      continue;
    }

    result[
      family as MutationFamily
    ] = clamp(
      value,
      0.1,
      SERUM_CONFIG
        .maxFamilyWeightMultiplier,
    );
  }

  return result;
}

/* -------------------------------------------------------------------------- */
/*                            MUTATION WEIGHTS                                */
/* -------------------------------------------------------------------------- */

export function sanitizeMutationWeights(
  weights: FormulaMutationWeights,
): FormulaMutationWeights {
  const result:
    FormulaMutationWeights = {};

  for (
    const [mutationId, value]
    of Object.entries(weights)
  ) {
    if (
      !mutationId ||
      !Number.isFinite(value)
    ) {
      continue;
    }

    result[mutationId] =
      clamp(
        value,
        0.1,
        SERUM_CONFIG
          .maxMutationWeightMultiplier,
      );
  }

  return result;
}

/* -------------------------------------------------------------------------- */
/*                             RARITY WEIGHTS                                 */
/* -------------------------------------------------------------------------- */

/**
 * Rarity modifiers are intentionally kept fairly narrow.
 *
 * Serums are primarily meant to control biological direction, not become
 * a simple "Legendary mutation potion."
 */
const MIN_RARITY_MULTIPLIER = 0.5;
const MAX_RARITY_MULTIPLIER = 1.5;

export function sanitizeRarityWeights(
  weights?: FormulaRarityWeights,
): FormulaRarityWeights | undefined {
  if (!weights) {
    return undefined;
  }

  const result:
    FormulaRarityWeights = {};

  for (
    const [rarity, value]
    of Object.entries(weights)
  ) {
    if (
      !Number.isFinite(value)
    ) {
      continue;
    }

    result[
      rarity as MutationRarity
    ] = clamp(
      value,
      MIN_RARITY_MULTIPLIER,
      MAX_RARITY_MULTIPLIER,
    );
  }

  return result;
}

/* -------------------------------------------------------------------------- */
/*                          STABILITY / EXPRESSION                            */
/* -------------------------------------------------------------------------- */

export function sanitizeStabilityModifier(
  value: number,
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return clamp(
    value,
    -SERUM_CONFIG
      .maxStabilityModifier,
    SERUM_CONFIG
      .maxStabilityModifier,
  );
}

/**
 * Keep ordinary serum expression changes modest.
 *
 * Serums should influence what expresses and how cleanly it expresses,
 * rather than multiplying combat power dramatically.
 */
const MIN_EXPRESSION_MODIFIER = 0.85;
const MAX_EXPRESSION_MODIFIER = 1.15;

export function sanitizeExpressionModifier(
  value: number,
): number {
  if (!Number.isFinite(value)) {
    return 1;
  }

  return clamp(
    value,
    MIN_EXPRESSION_MODIFIER,
    MAX_EXPRESSION_MODIFIER,
  );
}

/* -------------------------------------------------------------------------- */
/*                              FORMULA VALIDATION                            */
/* -------------------------------------------------------------------------- */

export function validateSerumFormula(
  formula: SerumFormula,
): SerumValidationResult {
  const issues:
    SerumValidationIssue[] = [];

  if (!formula.id.trim()) {
    issues.push({
      field: "id",
      message:
        "Formula ID is required.",
    });
  }

  if (!formula.name.trim()) {
    issues.push({
      field: "name",
      message:
        "Formula name is required.",
    });
  }

  if (!formula.code.trim()) {
    issues.push({
      field: "code",
      message:
        "Formula code is required.",
    });
  }

  if (
    !Number.isInteger(
      formula.version,
    ) ||
    formula.version < 1
  ) {
    issues.push({
      field: "version",
      message:
        "Formula version must be a positive integer.",
    });
  }

  if (
    !formula.profile
      .primaryPath
  ) {
    issues.push({
      field:
        "profile.primaryPath",
      message:
        "A primary research path is required.",
    });
  }

  for (
    const [family, weight]
    of Object.entries(
      formula.profile
        .familyWeights,
    )
  ) {
    if (
      !isFinitePositive(weight)
    ) {
      issues.push({
        field:
          `profile.familyWeights.${family}`,
        message:
          "Family weights must be positive finite numbers.",
      });
    }
  }

  for (
    const [mutationId, weight]
    of Object.entries(
      formula.profile
        .mutationWeights,
    )
  ) {
    if (
      !isFinitePositive(weight)
    ) {
      issues.push({
        field:
          `profile.mutationWeights.${mutationId}`,
        message:
          "Mutation weights must be positive finite numbers.",
      });
    }
  }

  return {
    valid:
      issues.length === 0,

    issues,
  };
}

/* -------------------------------------------------------------------------- */
/*                               BATCH VALIDATION                             */
/* -------------------------------------------------------------------------- */

export function validateSerumBatch({
  formula,
  batch,
}: {
  formula: SerumFormula;
  batch: SerumBatch;
}): SerumValidationResult {
  const issues:
    SerumValidationIssue[] = [];

  if (
    batch.formulaId !==
    formula.id
  ) {
    issues.push({
      field: "formulaId",
      message:
        "Serum batch does not belong to this formula.",
    });
  }

  if (
    batch.formulaVersion !==
    formula.version
  ) {
    issues.push({
      field:
        "formulaVersion",
      message:
        "Serum batch was manufactured from a different formula version.",
    });
  }

  if (
    batch.status !==
    "active"
  ) {
    issues.push({
      field: "status",
      message:
        `Serum batch is ${batch.status}.`,
    });
  }

  if (
    batch.usesRemaining <= 0
  ) {
    issues.push({
      field:
        "usesRemaining",
      message:
        "Serum batch has no remaining uses.",
    });
  }

  if (
    batch.expiresAt !==
      undefined &&
    batch.expiresAt <=
      Date.now()
  ) {
    issues.push({
      field: "expiresAt",
      message:
        "Serum batch has expired.",
    });
  }

  return {
    valid:
      issues.length === 0,

    issues,
  };
}

/* -------------------------------------------------------------------------- */
/*                         SAFE ENGINE PROFILE                                */
/* -------------------------------------------------------------------------- */

/**
 * Converts the full Formula object into the small, safe object consumed by
 * canonical research calculations.
 *
 * Never send raw user-created formula values directly into the engine.
 */
export function buildSerumEngineProfile({
  formula,
  batch,
}: {
  formula: SerumFormula;

  batch?: SerumBatch;
}): SerumEngineProfile {
  const formulaValidation =
    validateSerumFormula(
      formula,
    );

  if (!formulaValidation.valid) {
    throw new Error(
      `Invalid serum formula ${formula.id}: ${formulaValidation.issues
        .map(
          (issue) =>
            `${issue.field}: ${issue.message}`,
        )
        .join("; ")}`,
    );
  }

  if (batch) {
    const batchValidation =
      validateSerumBatch({
        formula,
        batch,
      });

    if (!batchValidation.valid) {
      throw new Error(
        `Invalid serum batch ${batch.id}: ${batchValidation.issues
          .map(
            (issue) =>
              `${issue.field}: ${issue.message}`,
          )
          .join("; ")}`,
      );
    }
  }

  return {
    serumId:
      batch?.id ??
      `formula:${formula.id}`,

    formulaId:
      formula.id,

    formulaVersion:
      formula.version,

    familyWeights:
      sanitizeFamilyWeights(
        formula.profile
          .familyWeights,
      ),

    mutationWeights:
      sanitizeMutationWeights(
        formula.profile
          .mutationWeights,
      ),

    rarityWeights:
      sanitizeRarityWeights(
        formula.profile
          .rarityWeights,
      ),

    stabilityModifier:
      sanitizeStabilityModifier(
        formula.profile
          .stabilityModifier,
      ),

    expressionModifier:
      sanitizeExpressionModifier(
        formula.profile
          .expressionModifier,
      ),
  };
}

/* -------------------------------------------------------------------------- */
/*                         SERUM COMPATIBILITY                                */
/* -------------------------------------------------------------------------- */

/**
 * Compatibility is specimen-specific.
 *
 * Two editions of the same base creature can respond differently because
 * their genetics and developmental histories can differ.
 */
export function getSerumCompatibility({
  specimen,
  profile,
}: {
  specimen: SpecimenResearchState;

  profile: SerumEngineProfile;
}): number {
  return (
    calculateSerumCompatibility(
      specimen,
      profile,
    ) ?? 0.5
  );
}

/* -------------------------------------------------------------------------- */
/*                        DURATION-ADJUSTED FOCUS                             */
/* -------------------------------------------------------------------------- */

/**
 * Longer research gives the serum more opportunity to narrow the outcome
 * space toward its intended biology.
 *
 * This does NOT guarantee any specific mutation.
 */
export function getSerumDurationFocus(
  durationDays:
    ResearchDurationDays,
): number {
  return (
    RESEARCH_DURATION_CONFIG[
      durationDays
    ].serumFocusMultiplier
  );
}

/* -------------------------------------------------------------------------- */
/*                       SERUM EFFECTIVENESS                                  */
/* -------------------------------------------------------------------------- */

/**
 * "Effectiveness" is a convenient 0-1 score for UI/reporting.
 *
 * It is NOT:
 *
 * - a mutation probability
 * - a success probability
 * - a rarity probability
 *
 * It means roughly:
 *
 * "How strongly should this serum's intended research direction be expected
 * to influence this specimen under these research conditions?"
 */
export function calculateSerumEffectiveness({
  compatibility,
  durationDays,
}: {
  compatibility: number;

  durationDays:
    ResearchDurationDays;
}): number {
  const durationFocus =
    getSerumDurationFocus(
      durationDays,
    );

  /**
   * Convert focus multipliers such as:
   *
   * 0.85
   * 1.00
   * 1.20
   * 1.35
   *
   * into a modest effectiveness adjustment.
   */
  const durationAdjustment =
    (durationFocus - 1) *
    0.2;

  return clampResearchValue(
    compatibility +
      durationAdjustment,
  );
}

/* -------------------------------------------------------------------------- */
/*                         FINAL STABILITY EFFECT                             */
/* -------------------------------------------------------------------------- */

/**
 * Poor compatibility softens the useful stability contribution of a serum.
 *
 * High compatibility allows more of its intended stability profile to show.
 */
export function calculateSerumStabilityInfluence({
  profile,
  compatibility,
}: {
  profile: SerumEngineProfile;

  compatibility: number;
}) {
  const compatibilityScale =
    0.65 +
    clampResearchValue(
      compatibility,
    ) *
      0.35;

  return clamp(
    profile
      .stabilityModifier *
      compatibilityScale,

    -SERUM_CONFIG
      .maxStabilityModifier,

    SERUM_CONFIG
      .maxStabilityModifier,
  );
}

/* -------------------------------------------------------------------------- */
/*                        FINAL EXPRESSION EFFECT                             */
/* -------------------------------------------------------------------------- */

export function calculateSerumExpressionInfluence({
  profile,
  compatibility,
}: {
  profile: SerumEngineProfile;

  compatibility: number;
}) {
  const rawDifference =
    profile
      .expressionModifier -
    1;

  /**
   * At mediocre compatibility, some of the serum's intended expression
   * influence is lost.
   *
   * At strong compatibility, most of it is preserved.
   */
  const compatibilityScale =
    0.6 +
    clampResearchValue(
      compatibility,
    ) *
      0.4;

  return clamp(
    1 +
      rawDifference *
        compatibilityScale,

    MIN_EXPRESSION_MODIFIER,

    MAX_EXPRESSION_MODIFIER,
  );
}

/* -------------------------------------------------------------------------- */
/*                         COMPLETE SERUM INFLUENCE                           */
/* -------------------------------------------------------------------------- */

export function calculateSerumInfluence({
  specimen,
  formula,
  batch,
  durationDays,
}: {
  specimen:
    SpecimenResearchState;

  formula:
    SerumFormula;

  batch?:
    SerumBatch;

  durationDays:
    ResearchDurationDays;
}): SerumInfluence {
  const profile =
    buildSerumEngineProfile({
      formula,
      batch,
    });

  const compatibility =
    getSerumCompatibility({
      specimen,
      profile,
    });

  const durationFocusMultiplier =
    getSerumDurationFocus(
      durationDays,
    );

  const effectiveness =
    calculateSerumEffectiveness({
      compatibility,
      durationDays,
    });

  const stabilityModifier =
    calculateSerumStabilityInfluence({
      profile,
      compatibility,
    });

  const expressionModifier =
    calculateSerumExpressionInfluence({
      profile,
      compatibility,
    });

  const notes: string[] = [];

  if (compatibility >= 0.8) {
    notes.push(
      "High serum compatibility with this specimen.",
    );
  } else if (
    compatibility >= 0.6
  ) {
    notes.push(
      "Good serum compatibility with this specimen.",
    );
  } else if (
    compatibility >= 0.4
  ) {
    notes.push(
      "Moderate serum compatibility with this specimen.",
    );
  } else {
    notes.push(
      "Poor serum compatibility with this specimen.",
    );
  }

  if (durationDays === 3) {
    notes.push(
      "Short research duration reduces serum control.",
    );
  }

  if (durationDays === 30) {
    notes.push(
      "Deep research improves serum consistency.",
    );
  }

  if (durationDays === 90) {
    notes.push(
      "Long-term research provides the strongest serum focus.",
    );
  }

  return {
    serumId:
      profile.serumId,

    formulaId:
      profile.formulaId,

    formulaVersion:
      profile.formulaVersion,

    profile,

    compatibility,

    effectiveness,

    stabilityModifier,

    expressionModifier,

    durationFocusMultiplier,

    notes,
  };
}

/* -------------------------------------------------------------------------- */
/*                            CONSUME SERUM USE                               */
/* -------------------------------------------------------------------------- */

/**
 * Pure helper.
 *
 * It returns the updated batch rather than modifying persistence directly.
 *
 * Firebase / contracts should be responsible for actually committing this
 * state change atomically when research begins.
 */
export function consumeSerumUse(
  batch: SerumBatch,
): SerumBatch {
  if (
    batch.status !==
    "active"
  ) {
    throw new Error(
      `Cannot consume serum batch ${batch.id} because it is ${batch.status}.`,
    );
  }

  if (
    batch.usesRemaining <= 0
  ) {
    throw new Error(
      `Serum batch ${batch.id} has no remaining uses.`,
    );
  }

  const usesRemaining =
    batch.usesRemaining - 1;

  return {
    ...batch,

    usesRemaining,

    status:
      usesRemaining === 0
        ? "depleted"
        : "active",
  };
}