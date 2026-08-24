// battle-ui/lib/research/research-outcomes.ts

import {
  BASE_ANOMALY_CHANCE,
  BASE_MUTATION_COUNT_WEIGHTS,
  DURATION_MUTATION_COUNT_MODIFIERS,
  EXPRESSION_STRENGTH,
  MAX_ANOMALY_CHANCE,
  MIN_ANOMALY_CHANCE,
  MUTATION_RARITY_WEIGHTS,
  MUTATION_STABILITY,
  RESEARCH_DURATION_CONFIG,
  RESEARCH_INTENSITY_CONFIG,
} from "./research-config";

import {
  buildMutationWeightTable,
  rollMutationFromTable,
} from "./research-weights";

import {
  deriveSeed,
  roundTo,
  seededChance,
  seededFloat,
  weightedRandom,
} from "./research-rng";

import type {
  ResearchMutation,
  WeightedMutationCandidate,
} from "./research-weights";

import type {
  SerumEngineProfile,
} from "./serum-types";

import type {
  EvolutionStage,
  MutationExpression,
  MutationRarity,
  ResearchCompatibility,
  ResearchDurationDays,
  ResearchIntensity,
  ResearchPath,
  ResearchStatChanges,
  SpecimenResearchState,
  StatBlock,
} from "./research-types";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

/**
 * Extended mutation definition used when resolving actual outcomes.
 *
 * This matches the information already available in mutation-library.ts.
 */
export type OutcomeMutation =
  ResearchMutation & {
    description?: string;

    visualEffect?: string;

    statBias?: Partial<
      Record<
        keyof StatBlock,
        number
      >
    >;

    movePowerMultiplier?: number;

    evolutionInfluence?:
      | string
      | string[];
  };

export type MutationRollResult = {
  mutation: OutcomeMutation;

  rarity: MutationRarity;

  expression: MutationExpression;

  statChanges: ResearchStatChanges;

  phenotypeInfluences: string[];
};

export type MutationCountResult = {
  count: 0 | 1 | 2 | 3;

  weights: Record<
    0 | 1 | 2 | 3,
    number
  >;
};

export type RarityRollResult = {
  rarity: MutationRarity;

  weights: Record<
    MutationRarity,
    number
  >;
};

export type AnomalyResult = {
  occurred: boolean;

  chance: number;

  mutation?: MutationRollResult;
};

/* -------------------------------------------------------------------------- */
/*                              STAT SETTINGS                                 */
/* -------------------------------------------------------------------------- */

/**
 * Converts the statBias values in mutation-library.ts into current combat
 * stat changes.
 *
 * Example:
 *
 * statBias.defense = 10
 * expressionStrength = 0.75
 *
 * 10 × 0.75 × 1
 * = roughly +8 defense
 *
 * This is intentionally centralized here so it can be rebalanced easily.
 *
 * The current 600-mutation library already stores statBias as direct point
 * tendencies, so this stays at 1.
 */
const STAT_BIAS_POINT_SCALE = 1;

/**
 * Prevent any single normal mutation from creating an extreme immediate
 * stat swing.
 */
const MAX_STAT_CHANGE_PER_MUTATION = 10;

/* -------------------------------------------------------------------------- */
/*                              MUTATION COUNT                                */
/* -------------------------------------------------------------------------- */

/**
 * Duration changes the reliability/depth of the experiment without simply
 * guaranteeing stronger outcomes.
 */
export function getMutationCountWeights(
  durationDays: ResearchDurationDays,
) {
  const durationModifier =
    DURATION_MUTATION_COUNT_MODIFIERS[
      durationDays
    ];

  const secondaryMultiplier =
    RESEARCH_DURATION_CONFIG[
      durationDays
    ].secondaryExpressionMultiplier;

  const weights = {
    0:
      BASE_MUTATION_COUNT_WEIGHTS[0] *
      durationModifier
        .zeroMutationMultiplier,

    1:
      BASE_MUTATION_COUNT_WEIGHTS[1],

    2:
      BASE_MUTATION_COUNT_WEIGHTS[2] *
      durationModifier
        .multiMutationMultiplier *
      secondaryMultiplier,

    3:
      BASE_MUTATION_COUNT_WEIGHTS[3] *
      durationModifier
        .multiMutationMultiplier *
      secondaryMultiplier *
      secondaryMultiplier,
  };

  return weights;
}

export function rollMutationCount({
  seed,
  durationDays,
}: {
  seed: string;
  durationDays: ResearchDurationDays;
}): MutationCountResult {
  const weights =
    getMutationCountWeights(
      durationDays,
    );

  const count =
    weightedRandom<
      0 | 1 | 2 | 3
    >(
      deriveSeed(
        seed,
        "mutation-count",
      ),
      [
        {
          item: 0,
          weight: weights[0],
        },
        {
          item: 1,
          weight: weights[1],
        },
        {
          item: 2,
          weight: weights[2],
        },
        {
          item: 3,
          weight: weights[3],
        },
      ],
    );

  return {
    count,
    weights,
  };
}

/* -------------------------------------------------------------------------- */
/*                               RARITY ROLL                                  */
/* -------------------------------------------------------------------------- */

/**
 * Rarity is rolled BEFORE selecting the individual mutation.
 *
 * This prevents the number of mutations in each rarity tier from changing
 * the intended overall rarity distribution.
 */
export function getRarityWeights({
  intensity,
  serum,
}: {
  intensity: ResearchIntensity;

  serum?: SerumEngineProfile;
}): Record<
  MutationRarity,
  number
> {
  const intensityConfig =
    RESEARCH_INTENSITY_CONFIG[
      intensity
    ];

  const serumWeights =
    serum?.rarityWeights ?? {};

  return {
    Common:
      MUTATION_RARITY_WEIGHTS.Common *
      (serumWeights.Common ?? 1),

    Uncommon:
      MUTATION_RARITY_WEIGHTS.Uncommon *
      (serumWeights.Uncommon ?? 1),

    Rare:
      MUTATION_RARITY_WEIGHTS.Rare *
      intensityConfig
        .rareWeightMultiplier *
      (serumWeights.Rare ?? 1),

    Epic:
      MUTATION_RARITY_WEIGHTS.Epic *
      intensityConfig
        .epicWeightMultiplier *
      (serumWeights.Epic ?? 1),

    Legendary:
      MUTATION_RARITY_WEIGHTS.Legendary *
      intensityConfig
        .legendaryWeightMultiplier *
      (serumWeights.Legendary ?? 1),
  };
}

export function rollMutationRarity({
  seed,
  intensity,
  serum,
}: {
  seed: string;

  intensity: ResearchIntensity;

  serum?: SerumEngineProfile;
}): RarityRollResult {
  const weights =
    getRarityWeights({
      intensity,
      serum,
    });

  const rarity =
    weightedRandom<MutationRarity>(
      deriveSeed(
        seed,
        "rarity",
      ),
      (
        Object.entries(
          weights,
        ) as Array<
          [
            MutationRarity,
            number,
          ]
        >
      ).map(
        ([item, weight]) => ({
          item,
          weight,
        }),
      ),
    );

  return {
    rarity,
    weights,
  };
}

/* -------------------------------------------------------------------------- */
/*                         EXPRESSION STRENGTH                                */
/* -------------------------------------------------------------------------- */

/**
 * Expression strength controls HOW STRONGLY a mutation manifests.
 *
 * It is different from whether the mutation occurs.
 *
 * Duration changes the WIDTH of the possible expression range:
 *
 * 3 days  = wider and more experimental
 * 7 days  = baseline
 * 30 days = tighter
 * 90 days = very tightly controlled
 *
 * Longer duration therefore increases predictability rather than simply
 * increasing average strength.
 */
export function rollExpressionStrength({
  seed,
  compatibility,
  intensity,
  durationDays,
  serum,
}: {
  seed: string;

  compatibility: number;

  intensity: ResearchIntensity;

  durationDays: ResearchDurationDays;

  serum?: SerumEngineProfile;
}) {
  const duration =
    RESEARCH_DURATION_CONFIG[
      durationDays
    ];

  const center =
    (
      EXPRESSION_STRENGTH.baselineMin +
      EXPRESSION_STRENGTH.baselineMax
    ) / 2;

  const baseHalfRange =
    (
      EXPRESSION_STRENGTH.baselineMax -
      EXPRESSION_STRENGTH.baselineMin
    ) / 2;

  const adjustedHalfRange =
    baseHalfRange *
    duration
      .expressionVarianceMultiplier;

  const raw =
    seededFloat(
      deriveSeed(
        seed,
        "expression-strength",
      ),
      Math.max(
        EXPRESSION_STRENGTH.min,
        center -
          adjustedHalfRange,
      ),
      Math.min(
        EXPRESSION_STRENGTH.max,
        center +
          adjustedHalfRange,
      ),
    );

  const intensityMultiplier =
    RESEARCH_INTENSITY_CONFIG[
      intensity
    ].expressionMultiplier;

  /**
   * Compatibility can modestly increase or reduce expression.
   *
   * 0.0 compatibility -> 0.85x
   * 0.5 compatibility -> 1.00x
   * 1.0 compatibility -> 1.15x
   */
  const compatibilityMultiplier =
    0.85 +
    compatibility * 0.3;

  const serumMultiplier =
    serum?.expressionModifier ??
    1;

  const expression =
    raw *
    intensityMultiplier *
    compatibilityMultiplier *
    serumMultiplier;

  return roundTo(
    Math.max(
      EXPRESSION_STRENGTH.min,
      Math.min(
        EXPRESSION_STRENGTH.max,
        expression,
      ),
    ),
    4,
  );
}

/* -------------------------------------------------------------------------- */
/*                              STABILITY ROLL                                */
/* -------------------------------------------------------------------------- */

export function rollMutationStability({
  seed,
  compatibility,
  intensity,
}: {
  seed: string;

  compatibility: ResearchCompatibility;

  intensity: ResearchIntensity;
}) {
  const raw =
    seededFloat(
      deriveSeed(
        seed,
        "stability",
      ),
      MUTATION_STABILITY
        .baselineMin,
      MUTATION_STABILITY
        .baselineMax,
    );

  const intensityModifier =
    RESEARCH_INTENSITY_CONFIG[
      intensity
    ].stabilityModifier;

  /**
   * compatibility.stabilityModifier already contains:
   *
   * - research duration influence
   * - specimen compatibility
   * - serum stability influence
   *
   * Do not add those again here.
   */
  const stability =
    raw +
    intensityModifier +
    compatibility
      .stabilityModifier;

  return roundTo(
    Math.max(
      MUTATION_STABILITY.min,
      Math.min(
        MUTATION_STABILITY.max,
        stability,
      ),
    ),
    4,
  );
}

/* -------------------------------------------------------------------------- */
/*                               STAT CHANGES                                 */
/* -------------------------------------------------------------------------- */

function clampStatChange(
  value: number,
) {
  return Math.max(
    -MAX_STAT_CHANGE_PER_MUTATION,
    Math.min(
      MAX_STAT_CHANGE_PER_MUTATION,
      value,
    ),
  );
}

export function calculateMutationStatChanges({
  mutation,
  expressionStrength,
}: {
  mutation: OutcomeMutation;

  expressionStrength: number;
}): ResearchStatChanges {
  const bias =
    mutation.statBias ?? {};

  const calculate =
    (
      value:
        | number
        | undefined,
    ) => {
      if (
        value === undefined ||
        !Number.isFinite(value)
      ) {
        return 0;
      }

      return Math.round(
        clampStatChange(
          value *
            expressionStrength *
            STAT_BIAS_POINT_SCALE,
        ),
      );
    };

  return {
    health:
      calculate(
        bias.health,
      ),

    attack:
      calculate(
        bias.attack,
      ),

    defense:
      calculate(
        bias.defense,
      ),

    speed:
      calculate(
        bias.speed,
      ),
  };
}

/* -------------------------------------------------------------------------- */
/*                           COMBINE STAT CHANGES                             */
/* -------------------------------------------------------------------------- */

export function combineStatChanges(
  changes:
    readonly ResearchStatChanges[],
): ResearchStatChanges {
  return changes.reduce(
    (total, current) => ({
      health:
        total.health +
        current.health,

      attack:
        total.attack +
        current.attack,

      defense:
        total.defense +
        current.defense,

      speed:
        total.speed +
        current.speed,
    }),
    {
      health: 0,
      attack: 0,
      defense: 0,
      speed: 0,
    },
  );
}

/* -------------------------------------------------------------------------- */
/*                        PHENOTYPE INFLUENCES                                */
/* -------------------------------------------------------------------------- */

export function getMutationPhenotypeInfluences(
  mutation: OutcomeMutation,
): string[] {
  const influences:
    string[] = [];

  if (
    mutation.visualEffect
  ) {
    influences.push(
      mutation.visualEffect,
    );
  }

  if (
    typeof mutation
      .evolutionInfluence ===
    "string"
  ) {
    influences.push(
      mutation
        .evolutionInfluence,
    );
  }

  if (
    Array.isArray(
      mutation
        .evolutionInfluence,
    )
  ) {
    influences.push(
      ...mutation
        .evolutionInfluence,
    );
  }

  return Array.from(
    new Set(
      influences
        .map(
          (value) =>
            value.trim(),
        )
        .filter(Boolean),
    ),
  );
}

/* -------------------------------------------------------------------------- */
/*                          MUTATION SOURCE                                   */
/* -------------------------------------------------------------------------- */

function determineMutationSource({
  mutation,
  primaryPath,
  secondaryPath,
  serum,
}: {
  mutation: OutcomeMutation;

  primaryPath: ResearchPath;

  secondaryPath?: ResearchPath;

  serum?: SerumEngineProfile;
}):
  | "organic"
  | "primary"
  | "secondary"
  | "serum" {
  const serumMutationWeight =
    serum
      ?.mutationWeights[
        mutation.id
      ];

  if (
    serumMutationWeight !==
      undefined &&
    serumMutationWeight > 1
  ) {
    return "serum";
  }

  const serumFamilyWeight =
    serum
      ?.familyWeights[
        mutation.family
      ];

  if (
    serumFamilyWeight !==
      undefined &&
    serumFamilyWeight > 1
  ) {
    return "serum";
  }

  if (
    mutation.family ===
    primaryPath
  ) {
    return "primary";
  }

  if (
    secondaryPath &&
    mutation.family ===
      secondaryPath
  ) {
    return "secondary";
  }

  return "organic";
}

/* -------------------------------------------------------------------------- */
/*                        FILTER CANDIDATES BY RARITY                         */
/* -------------------------------------------------------------------------- */

function getCandidatesForRarity({
  candidates,
  rarity,
}: {
  candidates:
    readonly WeightedMutationCandidate[];

  rarity: MutationRarity;
}) {
  return candidates.filter(
    (candidate) =>
      candidate.mutation
        .rarity === rarity,
  );
}

/**
 * If a rarity tier has no valid mutation for this specimen, fall back to the
 * available pool rather than failing the entire research operation.
 */
function getFallbackCandidates(
  candidates:
    readonly WeightedMutationCandidate[],
) {
  return candidates.filter(
    (candidate) =>
      candidate.weight > 0,
  );
}

/* -------------------------------------------------------------------------- */
/*                         SINGLE MUTATION OUTCOME                            */
/* -------------------------------------------------------------------------- */

export function rollMutationOutcome({
  seed,

  researchId,

  specimen,

  mutations,

  primaryPath,

  secondaryPath,

  durationDays,

  intensity,

  compatibility,

  serum,

  acquiredAtStage,

  excludedMutationIds = [],
}: {
  seed: string;

  researchId: string;

  specimen: SpecimenResearchState;

  mutations:
    readonly OutcomeMutation[];

  primaryPath: ResearchPath;

  secondaryPath?: ResearchPath;

  durationDays:
    ResearchDurationDays;

  intensity:
    ResearchIntensity;

  compatibility:
    ResearchCompatibility;

  serum?: SerumEngineProfile;

  acquiredAtStage:
    EvolutionStage;

  excludedMutationIds?: string[];
}): MutationRollResult {
  /**
   * Prevent duplicate mutations within this research run.
   */
  const availableMutations =
    mutations.filter(
      (mutation) =>
        !excludedMutationIds.includes(
          mutation.id,
        ),
    );

  if (
    availableMutations.length ===
    0
  ) {
    throw new Error(
      "No mutations remain available for this research outcome.",
    );
  }

  const rarityResult =
    rollMutationRarity({
      seed:
        deriveSeed(
          seed,
          "mutation-rarity",
        ),

      intensity,

      serum,
    });

  const candidates =
    buildMutationWeightTable({
      mutations:
        availableMutations,

      specimen,

      primaryPath,

      secondaryPath,

      durationDays,

      intensity,

      serum,
    });

  let rarityCandidates =
    getCandidatesForRarity({
      candidates,
      rarity:
        rarityResult.rarity,
    });

  if (
    rarityCandidates.length === 0
  ) {
    rarityCandidates =
      getFallbackCandidates(
        candidates,
      );
  }

  if (
    rarityCandidates.length === 0
  ) {
    throw new Error(
      "Research produced no valid mutation candidates.",
    );
  }

  const selected =
    rollMutationFromTable(
      deriveSeed(
        seed,
        "mutation-selection",
      ),
      rarityCandidates,
    ) as OutcomeMutation;

  const familyCompatibility =
    compatibility
      .familyCompatibility[
        selected.family
      ] ??
    compatibility.overall;

  const expressionStrength =
    rollExpressionStrength({
      seed:
        deriveSeed(
          seed,
          selected.id,
        ),

      compatibility:
        familyCompatibility,

      intensity,

      durationDays,

      serum,
    });

  const stability =
    rollMutationStability({
      seed:
        deriveSeed(
          seed,
          selected.id,
        ),

      compatibility,

      intensity,
    });

  const source =
    determineMutationSource({
      mutation: selected,

      primaryPath,

      secondaryPath,

      serum,
    });

  const expression:
    MutationExpression = {
      mutationId:
        selected.id,

      family:
        selected.family,

      rarity:
        selected.rarity,

      source,

      compatibility:
        roundTo(
          familyCompatibility,
          4,
        ),

      expressionStrength,

      stability,

      acquiredAtLevel:
        specimen.level,

      acquiredAtStage,

      researchId,
    };

  return {
    mutation: selected,

    rarity:
      selected.rarity,

    expression,

    statChanges:
      calculateMutationStatChanges({
        mutation: selected,
        expressionStrength,
      }),

    phenotypeInfluences:
      getMutationPhenotypeInfluences(
        selected,
      ),
  };
}

/* -------------------------------------------------------------------------- */
/*                              ANOMALY CHANCE                                */
/* -------------------------------------------------------------------------- */

export function calculateAnomalyChance({
  primaryPath,
  intensity,
  durationDays,
  compatibility,
}: {
  primaryPath: ResearchPath;

  intensity: ResearchIntensity;

  durationDays:
    ResearchDurationDays;

  compatibility: number;
}) {
  const intensityMultiplier =
    RESEARCH_INTENSITY_CONFIG[
      intensity
    ].anomalyMultiplier;

  /**
   * Wildcard intentionally carries significantly more anomalous behavior.
   */
  const wildcardMultiplier =
    primaryPath === "Wildcard"
      ? 2
      : 1;

  /**
   * Poor compatibility increases instability.
   */
  const compatibilityMultiplier =
    compatibility < 0.5
      ? 1 +
        (0.5 -
          compatibility) *
          1.5
      : 1;

  /**
   * Longer research provides more controlled conditions.
   */
  const durationStability =
    RESEARCH_DURATION_CONFIG[
      durationDays
    ].stabilityModifier;

  const durationMultiplier =
    Math.max(
      0.65,
      1 -
        durationStability,
    );

  const chance =
    BASE_ANOMALY_CHANCE *
    intensityMultiplier *
    wildcardMultiplier *
    compatibilityMultiplier *
    durationMultiplier;

  return Math.max(
    MIN_ANOMALY_CHANCE,
    Math.min(
      MAX_ANOMALY_CHANCE,
      chance,
    ),
  );
}

/* -------------------------------------------------------------------------- */
/*                              ANOMALY ROLL                                  */
/* -------------------------------------------------------------------------- */

export function rollAnomaly({
  seed,

  researchId,

  specimen,

  mutations,

  primaryPath,

  secondaryPath,

  durationDays,

  intensity,

  compatibility,

  serum,

  acquiredAtStage,

  excludedMutationIds = [],
}: {
  seed: string;

  researchId: string;

  specimen: SpecimenResearchState;

  mutations:
    readonly OutcomeMutation[];

  primaryPath: ResearchPath;

  secondaryPath?: ResearchPath;

  durationDays:
    ResearchDurationDays;

  intensity:
    ResearchIntensity;

  compatibility:
    ResearchCompatibility;

  serum?: SerumEngineProfile;

  acquiredAtStage:
    EvolutionStage;

  excludedMutationIds?: string[];
}): AnomalyResult {
  const chance =
    calculateAnomalyChance({
      primaryPath,

      intensity,

      durationDays,

      compatibility:
        compatibility.overall,
    });

  const occurred =
    seededChance(
      deriveSeed(
        seed,
        "anomaly-check",
      ),
      chance,
    );

  if (!occurred) {
    return {
      occurred: false,
      chance,
    };
  }

  /**
   * Anomalies come from the Wildcard family.
   */
  const wildcardMutations =
    mutations.filter(
      (mutation) =>
        mutation.family ===
        "Wildcard" &&
        !excludedMutationIds.includes(
          mutation.id,
        ),
    );

  if (
    wildcardMutations.length === 0
  ) {
    return {
      occurred: false,
      chance,
    };
  }

  const result =
    rollMutationOutcome({
      seed:
        deriveSeed(
          seed,
          "anomaly-outcome",
        ),

      researchId,

      specimen,

      mutations:
        wildcardMutations,

      /**
       * Wildcard is deliberately used here so anomaly weighting
       * favors the anomaly pool itself.
       */
      primaryPath:
        "Wildcard",

      secondaryPath,

      durationDays,

      intensity,

      compatibility,

      serum,

      acquiredAtStage,

      excludedMutationIds,
    });

  return {
    occurred: true,

    chance,

    mutation: {
      ...result,

      expression: {
        ...result.expression,

        source:
          "anomaly",
      },
    },
  };
}

/* -------------------------------------------------------------------------- */
/*                         EVOLUTION STAGE                                    */
/* -------------------------------------------------------------------------- */

export function getNextEvolutionStage(
  currentStage: EvolutionStage,
): EvolutionStage {
  switch (currentStage) {
    case 0:
      return 1;

    case 1:
      return 2;

    case 2:
      return 3;

    case 3:
    default:
      return 3;
  }
}

/* -------------------------------------------------------------------------- */
/*                       COMPLETE MUTATION SET                                */
/* -------------------------------------------------------------------------- */

/**
 * Resolves all mutation expressions for a completed research operation.
 *
 * research-engine.ts will call this after:
 *
 * - validating XP
 * - validating specimen state
 * - validating serum
 * - calculating compatibility
 */
export function resolveMutationOutcomes({
  seed,

  researchId,

  specimen,

  mutations,

  primaryPath,

  secondaryPath,

  durationDays,

  intensity,

  compatibility,

  serum,

  nextEvolutionStage,
}: {
  seed: string;

  researchId: string;

  specimen: SpecimenResearchState;

  mutations:
    readonly OutcomeMutation[];

  primaryPath: ResearchPath;

  secondaryPath?: ResearchPath;

  durationDays:
    ResearchDurationDays;

  intensity:
    ResearchIntensity;

  compatibility:
    ResearchCompatibility;

  serum?: SerumEngineProfile;

  nextEvolutionStage:
    EvolutionStage;
}) {
  const mutationCount =
    rollMutationCount({
      seed,
      durationDays,
    });

  const results:
    MutationRollResult[] = [];

  const selectedIds:
    string[] = [];

  for (
    let index = 0;
    index < mutationCount.count;
    index += 1
  ) {
    const result =
      rollMutationOutcome({
        seed:
          deriveSeed(
            seed,
            "mutation",
            index,
          ),

        researchId,

        specimen,

        mutations,

        primaryPath,

        secondaryPath,

        durationDays,

        intensity,

        compatibility,

        serum,

        acquiredAtStage:
          nextEvolutionStage,

        excludedMutationIds:
          selectedIds,
      });

    results.push(result);

    selectedIds.push(
      result.mutation.id,
    );
  }

  const anomaly =
    rollAnomaly({
      seed,

      researchId,

      specimen,

      mutations,

      primaryPath,

      secondaryPath,

      durationDays,

      intensity,

      compatibility,

      serum,

      acquiredAtStage:
        nextEvolutionStage,

      excludedMutationIds:
        selectedIds,
    });

  if (
    anomaly.occurred &&
    anomaly.mutation
  ) {
    selectedIds.push(
      anomaly.mutation
        .mutation.id,
    );
  }

  const allResults =
    anomaly.occurred &&
    anomaly.mutation
      ? [
          ...results,
          anomaly.mutation,
        ]
      : results;

  const statChanges =
    combineStatChanges(
      allResults.map(
        (result) =>
          result.statChanges,
      ),
    );

  const phenotypeInfluences =
    Array.from(
      new Set(
        allResults.flatMap(
          (result) =>
            result
              .phenotypeInfluences,
        ),
      ),
    );

  return {
    mutationCount:
      mutationCount.count,

    mutations:
      results,

    anomaly,

    statChanges,

    phenotypeInfluences,
  };
}
