// battle-ui/lib/research/research-engine.ts

import {
  RESEARCH_DURATION_CONFIG,
  getResearchXpCost,
} from "./research-config";

import {
  calculateResearchCompatibility,
} from "./research-compatibility";

import {
  getNextEvolutionStage,
  resolveMutationOutcomes,
  type MutationRollResult,
  type OutcomeMutation,
} from "./research-outcomes";

import {
  calculateSerumInfluence,
} from "./serum-engine";

import type {
  SerumBatch,
  SerumEngineProfile,
  SerumFormula,
} from "./serum-types";

import type {
  MutationExpression,
  ResearchOutcome,
  ResearchRequest,
  SpecimenResearchState,
  StatBlock,
} from "./research-types";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export type ResearchEngineInput = {
  request: ResearchRequest;

  mutations: readonly OutcomeMutation[];

  formula?: SerumFormula;

  serumBatch?: SerumBatch;
};

export type ResearchValidationIssue = {
  field: string;
  message: string;
};

export type ResearchValidationResult = {
  valid: boolean;
  issues: ResearchValidationIssue[];
};

export type CanonicalResearchResult = {
  outcome: ResearchOutcome;

  xpCost: number;

  predictability: number;

  researchDataWeight: number;

  mutationDetails: MutationRollResult[];

  movePowerMultiplier: number;

  serum?: {
    formulaId: string;
    formulaVersion: number;
    serumId: string;
    compatibility: number;
    effectiveness: number;
  };

  timing: {
    startedAt: number;
    completesAt: number;
    durationDays: 3 | 7 | 30 | 90;
  };
};

/* -------------------------------------------------------------------------- */
/*                                 HELPERS                                    */
/* -------------------------------------------------------------------------- */

const DAY_MS = 24 * 60 * 60 * 1000;

function scaleWeightTowardNeutral(
  value: number,
  effectiveness: number,
) {
  return 1 + (value - 1) * effectiveness;
}

function buildEffectiveSerumProfile({
  profile,
  effectiveness,
  stabilityModifier,
  expressionModifier,
}: {
  profile: SerumEngineProfile;
  effectiveness: number;
  stabilityModifier: number;
  expressionModifier: number;
}): SerumEngineProfile {
  const familyWeights = Object.fromEntries(
    Object.entries(profile.familyWeights).map(
      ([family, weight]) => [
        family,
        scaleWeightTowardNeutral(
          weight,
          effectiveness,
        ),
      ],
    ),
  ) as SerumEngineProfile["familyWeights"];

  const mutationWeights = Object.fromEntries(
    Object.entries(profile.mutationWeights).map(
      ([mutationId, weight]) => [
        mutationId,
        scaleWeightTowardNeutral(
          weight,
          effectiveness,
        ),
      ],
    ),
  );

  const rarityWeights = profile.rarityWeights
    ? Object.fromEntries(
        Object.entries(profile.rarityWeights).map(
          ([rarity, weight]) => [
            rarity,
            scaleWeightTowardNeutral(
              weight,
              effectiveness,
            ),
          ],
        ),
      ) as SerumEngineProfile["rarityWeights"]
    : undefined;

  return {
    ...profile,
    familyWeights,
    mutationWeights,
    rarityWeights,
    stabilityModifier,
    expressionModifier,
  };
}

function average(
  values: readonly number[],
  fallback: number,
) {
  if (values.length === 0) {
    return fallback;
  }

  return (
    values.reduce(
      (sum, value) => sum + value,
      0,
    ) / values.length
  );
}

function multiplyMovePower(
  results: readonly MutationRollResult[],
) {
  return results.reduce(
    (total, result) =>
      total *
      (result.mutation.movePowerMultiplier ?? 1),
    1,
  );
}

/* -------------------------------------------------------------------------- */
/*                                VALIDATION                                  */
/* -------------------------------------------------------------------------- */

export function validateResearchRequest({
  request,
  mutations,
  formula,
  serumBatch,
}: ResearchEngineInput): ResearchValidationResult {
  const issues: ResearchValidationIssue[] = [];
  const { specimen, input, seed, researchId } = request;

  if (!researchId.trim()) {
    issues.push({
      field: "researchId",
      message: "Research ID is required.",
    });
  }

  if (!seed.trim()) {
    issues.push({
      field: "seed",
      message: "A canonical research seed is required.",
    });
  }

  if (mutations.length === 0) {
    issues.push({
      field: "mutations",
      message: "Mutation library is empty.",
    });
  }

  if (!Number.isFinite(request.startedAt)) {
    issues.push({
      field: "startedAt",
      message: "Research start time must be finite.",
    });
  }

  if (specimen.evolutionStage >= 3 && input.mode !== "clone") {
    issues.push({
      field: "specimen.evolutionStage",
      message:
        "This specimen is already at EVO III. Additional normal evolution research is not currently enabled.",
    });
  }

  if (input.serumId && !formula) {
    issues.push({
      field: "formula",
      message:
        "A serum/formula was selected but no formula definition was supplied.",
    });
  }

  if (formula && !input.serumId) {
    issues.push({
      field: "input.serumId",
      message:
        "A formula was supplied but the research input does not identify a serum/formula selection.",
    });
  }

  if (
    serumBatch &&
    formula &&
    serumBatch.formulaId !== formula.id
  ) {
    issues.push({
      field: "serumBatch.formulaId",
      message:
        "The supplied serum batch does not belong to the supplied formula.",
    });
  }

  if (
    serumBatch &&
    formula &&
    serumBatch.formulaVersion !== formula.version
  ) {
    issues.push({
      field: "serumBatch.formulaVersion",
      message:
        "The supplied serum batch was manufactured from a different formula version.",
    });
  }

  const xpCost = getResearchXpCost({
    durationDays: input.durationDays,
    intensity: input.intensity,
    evolutionStage: specimen.evolutionStage,
  });

  if (
    input.mode !== "clone" &&
    specimen.xp.available < xpCost
  ) {
    issues.push({
      field: "specimen.xp.available",
      message:
        `Research requires ${xpCost} XP but this specimen only has ${specimen.xp.available} available.`,
    });
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

/* -------------------------------------------------------------------------- */
/*                           CANONICAL RESEARCH RUN                           */
/* -------------------------------------------------------------------------- */

/**
 * Pure canonical research calculation.
 *
 * This function does NOT:
 * - deduct XP
 * - consume a serum batch
 * - write Firebase state
 * - mint/update metadata
 * - generate an image
 *
 * It only calculates the official result. Commit logic belongs in the
 * persistence/evolution layer after the result is accepted.
 */
export function runResearch(
  input: ResearchEngineInput,
): CanonicalResearchResult {
  const validation =
    validateResearchRequest(input);

  if (!validation.valid) {
    throw new Error(
      `Invalid research request: ${validation.issues
        .map(
          (issue) =>
            `${issue.field}: ${issue.message}`,
        )
        .join("; ")}`,
    );
  }

  const {
    request,
    mutations,
    formula,
    serumBatch,
  } = input;

  const {
    specimen,
    input: researchInput,
    researchId,
    seed,
    startedAt,
  } = request;

  const duration =
    RESEARCH_DURATION_CONFIG[
      researchInput.durationDays
    ];

  const xpCost = getResearchXpCost({
    durationDays: researchInput.durationDays,
    intensity: researchInput.intensity,
    evolutionStage: specimen.evolutionStage,
  });

  let effectiveSerum:
    | SerumEngineProfile
    | undefined;

  let serumSummary:
    | CanonicalResearchResult["serum"]
    | undefined;

  if (formula) {
    /**
     * Batch ownership/availability should be validated by the transaction
     * layer before research begins. The canonical math intentionally depends
     * on the immutable formula version, not on time-sensitive batch status.
     * That keeps historical research reproducible after a batch expires or is
     * depleted.
     */
    const serumInfluence =
      calculateSerumInfluence({
        specimen,
        formula,
        durationDays:
          researchInput.durationDays,
      });

    const rawSerumProfile = {
      ...serumInfluence.profile,
      serumId:
        serumBatch?.id ??
        serumInfluence.profile.serumId,
    };

    effectiveSerum =
      buildEffectiveSerumProfile({
        profile: rawSerumProfile,
        effectiveness:
          serumInfluence.effectiveness,
        stabilityModifier:
          serumInfluence.stabilityModifier,
        expressionModifier:
          serumInfluence.expressionModifier,
      });

    serumSummary = {
      formulaId:
        serumInfluence.formulaId,
      formulaVersion:
        serumInfluence.formulaVersion,
      serumId:
        rawSerumProfile.serumId,
      compatibility:
        serumInfluence.compatibility,
      effectiveness:
        serumInfluence.effectiveness,
    };
  }

  const compatibility =
    calculateResearchCompatibility({
      specimen,
      primaryPath:
        researchInput.path,
      secondaryPath:
        researchInput.secondaryPath,
      durationDays:
        researchInput.durationDays,
      serum: effectiveSerum,
    });

  const nextEvolutionStage =
    getNextEvolutionStage(
      specimen.evolutionStage,
    );

  const resolved =
    resolveMutationOutcomes({
      seed,
      researchId,
      specimen,
      mutations,
      primaryPath:
        researchInput.path,
      secondaryPath:
        researchInput.secondaryPath,
      durationDays:
        researchInput.durationDays,
      intensity:
        researchInput.intensity,
      compatibility,
      serum: effectiveSerum,
      nextEvolutionStage,
    });

  const mutationDetails = [
    ...resolved.mutations,
    ...(resolved.anomaly.occurred &&
    resolved.anomaly.mutation
      ? [resolved.anomaly.mutation]
      : []),
  ];

  const mutationExpressions:
    MutationExpression[] =
    mutationDetails.map(
      (result) => result.expression,
    );

  const stability = average(
    mutationExpressions.map(
      (mutation) =>
        mutation.stability,
    ),
    compatibility.overall,
  );

  const completesAt =
    startedAt +
    researchInput.durationDays *
      DAY_MS;

  const outcome: ResearchOutcome = {
    researchId,
    seed,
    specimenId:
      researchInput.specimenId,
    path: researchInput.path,
    secondaryPath:
      researchInput.secondaryPath,
    serumId:
      effectiveSerum?.serumId,
    intensity:
      researchInput.intensity,
    durationDays:
      researchInput.durationDays,
    mode: researchInput.mode,
    compatibility,
    mutations:
      resolved.mutations.map(
        (result) =>
          result.expression,
      ),
    anomaly:
      resolved.anomaly.mutation
        ?.expression,
    statChanges:
      resolved.statChanges,
    stability,
    phenotypeInfluences:
      resolved.phenotypeInfluences,
    previousEvolutionStage:
      specimen.evolutionStage,
    nextEvolutionStage,
    startedAt,
    completedAt: completesAt,
  };

  return {
    outcome,
    xpCost,
    predictability:
      duration.predictability,
    researchDataWeight:
      duration.researchDataWeight,
    mutationDetails,
    movePowerMultiplier:
      multiplyMovePower(
        mutationDetails,
      ),
    serum: serumSummary,
    timing: {
      startedAt,
      completesAt,
      durationDays:
        researchInput.durationDays,
    },
  };
}

/* -------------------------------------------------------------------------- */
/*                            PREVIEW / UTILITY                               */
/* -------------------------------------------------------------------------- */

export function canAffordResearch({
  specimen,
  durationDays,
  intensity,
}: {
  specimen: SpecimenResearchState;
  durationDays: 3 | 7 | 30 | 90;
  intensity: "low" | "standard" | "high";
}) {
  const xpCost = getResearchXpCost({
    durationDays,
    intensity,
    evolutionStage:
      specimen.evolutionStage,
  });

  return {
    xpCost,
    availableXp:
      specimen.xp.available,
    canAfford:
      specimen.xp.available >= xpCost,
  };
}

export function applyStatChangesPreview(
  stats: StatBlock,
  changes: StatBlock,
): StatBlock {
  return {
    health: Math.max(
      1,
      stats.health + changes.health,
    ),
    attack: Math.max(
      1,
      stats.attack + changes.attack,
    ),
    defense: Math.max(
      1,
      stats.defense + changes.defense,
    ),
    speed: Math.max(
      1,
      stats.speed + changes.speed,
    ),
  };
}
