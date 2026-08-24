// battle-ui/lib/research/clone-research.ts

import {
  runResearch,
  type CanonicalResearchResult,
} from "./research-engine";

import {
  deriveSeed,
  roundTo,
} from "./research-rng";

import type {
  OutcomeMutation,
} from "./research-outcomes";

import type {
  SerumBatch,
  SerumFormula,
} from "./serum-types";

import type {
  CloneFamilyEstimate,
  CloneMutationEstimate,
  CloneResearchResult,
  ResearchInput,
  SpecimenResearchState,
  StatBlock,
} from "./research-types";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export type CloneResearchReport =
  CloneResearchResult & {
    predictability: number;
    confidence: number;
    anomalyRate: number;
    zeroMutationRate: number;
    averageMutationCount: number;
    topResults: Array<{
      mutationId: string;
      observedRate: number;
    }>;
  };

export type RunCloneResearchInput = {
  cloneResearchId: string;
  specimen: SpecimenResearchState;
  researchInput: Omit<ResearchInput, "mode">;
  mutations: readonly OutcomeMutation[];
  formula?: SerumFormula;
  serumBatch?: SerumBatch;
  simulations?: number;
  generatedAt?: number;
  seed?: string;
};

/* -------------------------------------------------------------------------- */
/*                                  HELPERS                                   */
/* -------------------------------------------------------------------------- */

function averageStatBlocks(
  blocks: readonly StatBlock[],
): StatBlock {
  if (blocks.length === 0) {
    return {
      health: 0,
      attack: 0,
      defense: 0,
      speed: 0,
    };
  }

  const total = blocks.reduce(
    (sum, block) => ({
      health:
        sum.health + block.health,
      attack:
        sum.attack + block.attack,
      defense:
        sum.defense + block.defense,
      speed:
        sum.speed + block.speed,
    }),
    {
      health: 0,
      attack: 0,
      defense: 0,
      speed: 0,
    },
  );

  return {
    health:
      roundTo(
        total.health /
          blocks.length,
        3,
      ),
    attack:
      roundTo(
        total.attack /
          blocks.length,
        3,
      ),
    defense:
      roundTo(
        total.defense /
          blocks.length,
        3,
      ),
    speed:
      roundTo(
        total.speed /
          blocks.length,
        3,
      ),
  };
}

function calculateConfidence({
  simulations,
  predictability,
  durationMultiplier,
}: {
  simulations: number;
  predictability: number;
  durationMultiplier: number;
}) {
  const sampleConfidence =
    1 - Math.exp(-simulations / 150);

  return Math.min(
    0.99,
    sampleConfidence *
      (0.72 +
        predictability * 0.18) *
      Math.min(
        1.08,
        durationMultiplier,
      ),
  );
}

/* -------------------------------------------------------------------------- */
/*                              CLONE RESEARCH                                */
/* -------------------------------------------------------------------------- */

/**
 * Runs many hypothetical branches using derived seeds.
 *
 * Clone research does not reveal the exact future canonical seed. It estimates
 * the specimen's outcome landscape so users gain useful information without
 * eliminating real evolution uncertainty.
 */
export function runCloneResearch({
  cloneResearchId,
  specimen,
  researchInput,
  mutations,
  formula,
  serumBatch,
  simulations = 500,
  generatedAt = Date.now(),
  seed = cloneResearchId,
}: RunCloneResearchInput): CloneResearchReport {
  const count = Math.max(
    25,
    Math.min(5000, Math.floor(simulations)),
  );

  const results: CanonicalResearchResult[] = [];

  for (
    let index = 0;
    index < count;
    index += 1
  ) {
    const simulationSeed =
      deriveSeed(
        seed,
        "clone",
        index,
      );

    results.push(
      runResearch({
        request: {
          researchId:
            `${cloneResearchId}:sim:${index}`,
          specimen,
          input: {
            ...researchInput,
            mode: "clone",
          },
          seed: simulationSeed,
          startedAt: generatedAt,
        },
        mutations,
        formula,
        serumBatch,
      }),
    );
  }

  const mutationMap = new Map<
    string,
    {
      family: CloneMutationEstimate["family"];
      occurrences: number;
      expressionTotal: number;
      stabilityTotal: number;
    }
  >();

  const familyMap = new Map<
    CloneFamilyEstimate["family"],
    number
  >();

  let anomalyCount = 0;
  let zeroMutationCount = 0;
  let totalMutationCount = 0;

  for (const result of results) {
    const expressions = [
      ...result.outcome.mutations,
      ...(result.outcome.anomaly
        ? [result.outcome.anomaly]
        : []),
    ];

    if (
      result.outcome.mutations.length === 0
    ) {
      zeroMutationCount += 1;
    }

    if (result.outcome.anomaly) {
      anomalyCount += 1;
    }

    totalMutationCount +=
      expressions.length;

    for (const expression of expressions) {
      const existing =
        mutationMap.get(
          expression.mutationId,
        ) ?? {
          family: expression.family,
          occurrences: 0,
          expressionTotal: 0,
          stabilityTotal: 0,
        };

      existing.occurrences += 1;
      existing.expressionTotal +=
        expression.expressionStrength;
      existing.stabilityTotal +=
        expression.stability;

      mutationMap.set(
        expression.mutationId,
        existing,
      );

      familyMap.set(
        expression.family,
        (familyMap.get(
          expression.family,
        ) ?? 0) + 1,
      );
    }
  }

  const mutationEstimates:
    CloneMutationEstimate[] =
    Array.from(
      mutationMap.entries(),
    )
      .map(
        ([mutationId, value]) => ({
          mutationId,
          family: value.family,
          occurrences:
            value.occurrences,
          observedRate:
            value.occurrences /
            count,
          averageExpressionStrength:
            value.expressionTotal /
            value.occurrences,
          averageStability:
            value.stabilityTotal /
            value.occurrences,
        }),
      )
      .sort(
        (a, b) =>
          b.observedRate -
          a.observedRate,
      );

  const familyEstimates:
    CloneFamilyEstimate[] =
    Array.from(
      familyMap.entries(),
    )
      .map(
        ([family, occurrences]) => ({
          family,
          occurrences,
          observedRate:
            occurrences /
            Math.max(
              1,
              totalMutationCount,
            ),
        }),
      )
      .sort(
        (a, b) =>
          b.observedRate -
          a.observedRate,
      );

  const averageStability =
    results.length
      ? results.reduce(
          (sum, result) =>
            sum +
            result.outcome.stability,
          0,
        ) / results.length
      : 0;

  const predictability =
    results[0]?.predictability ?? 0;

  const durationMultiplier =
    researchInput.durationDays === 90
      ? 1.08
      : researchInput.durationDays === 30
        ? 1.04
        : researchInput.durationDays === 7
          ? 1
          : 0.94;

  return {
    cloneResearchId,
    specimenId:
      researchInput.specimenId,
    simulations: count,
    input: {
      ...researchInput,
      mode: "clone",
    },
    mutationEstimates,
    familyEstimates,
    averageStatChanges:
      averageStatBlocks(
        results.map(
          (result) =>
            result.outcome
              .statChanges,
        ),
      ),
    averageStability:
      roundTo(
        averageStability,
        4,
      ),
    generatedAt,
    predictability,
    confidence:
      roundTo(
        calculateConfidence({
          simulations: count,
          predictability,
          durationMultiplier,
        }),
        4,
      ),
    anomalyRate:
      roundTo(
        anomalyCount / count,
        4,
      ),
    zeroMutationRate:
      roundTo(
        zeroMutationCount / count,
        4,
      ),
    averageMutationCount:
      roundTo(
        totalMutationCount / count,
        4,
      ),
    topResults:
      mutationEstimates
        .slice(0, 10)
        .map(
          (mutation) => ({
            mutationId:
              mutation.mutationId,
            observedRate:
              mutation.observedRate,
          }),
        ),
  };
}
