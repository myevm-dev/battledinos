// battle-ui/lib/research/formula-analytics.ts

import {
  getResearchMutationById,
} from "./mutation-library-adapter";

import {
  roundTo,
} from "./research-rng";

import type {
  FormulaFamilyObservation,
  FormulaMutationObservation,
  FormulaOutcomeStats,
  SerumFormula,
  SerumResearchRecord,
} from "./serum-types";

import type {
  MutationFamily,
  ResearchDurationDays,
} from "./research-types";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export type FormulaDurationAnalytics = {
  durationDays: ResearchDurationDays;
  experiments: number;
  mutationExpressions: number;
  targetMutationHitRate: number;
  targetFamilyHitRate: number;
  averageStability: number;
  anomalyRate: number;
  observedPredictability: number;
  confidence: number;
};

export type FormulaAnalytics = {
  formulaId: string;
  formulaVersion: number;
  experiments: number;
  uniqueSpecimens: number;
  uniqueBaseTemplates: number;
  researchWeightApproximation: number;
  outcomeStats: FormulaOutcomeStats;
  targetMutationHitRate: number;
  targetFamilyHitRate: number;
  observedPredictability: number;
  confidence: number;
  stabilityScore: number;
  anomalyRate: number;
  compatibilityBreadth: number;
  durationAnalytics: FormulaDurationAnalytics[];
};

/* -------------------------------------------------------------------------- */
/*                              DURATION WEIGHTS                              */
/* -------------------------------------------------------------------------- */

const DURATION_RESEARCH_WEIGHTS:
  Record<ResearchDurationDays, number> = {
  3: 1,
  7: 1.5,
  30: 3,
  90: 6,
};

/* -------------------------------------------------------------------------- */
/*                              MATH HELPERS                                  */
/* -------------------------------------------------------------------------- */

function average(
  values: readonly number[],
) {
  if (!values.length) return 0;

  return (
    values.reduce(
      (sum, value) => sum + value,
      0,
    ) / values.length
  );
}

function calculateEntropyPredictability(
  counts: readonly number[],
) {
  const positive =
    counts.filter(
      (value) => value > 0,
    );

  const total = positive.reduce(
    (sum, value) => sum + value,
    0,
  );

  if (total <= 0) return 0;
  if (positive.length === 1) return 1;

  const entropy =
    positive.reduce(
      (sum, count) => {
        const p = count / total;
        return sum - p * Math.log(p);
      },
      0,
    );

  const maxEntropy =
    Math.log(positive.length);

  return Math.max(
    0,
    Math.min(
      1,
      1 - entropy / maxEntropy,
    ),
  );
}

function calculateSampleConfidence(
  experiments: number,
  uniqueSpecimens: number,
) {
  const sample =
    1 - Math.exp(-experiments / 50);

  const breadth =
    1 - Math.exp(-uniqueSpecimens / 20);

  return Math.min(
    0.99,
    sample * 0.75 +
      breadth * 0.25,
  );
}

/* -------------------------------------------------------------------------- */
/*                         MUTATION / FAMILY COUNTS                           */
/* -------------------------------------------------------------------------- */

function buildMutationObservations(
  records: readonly SerumResearchRecord[],
): FormulaMutationObservation[] {
  const map = new Map<
    string,
    {
      family: MutationFamily;
      count: number;
      expressionTotal: number;
      stabilityTotal: number;
    }
  >();

  let totalExpressions = 0;

  for (const record of records) {
    record.mutationIds.forEach(
      (mutationId, index) => {
        const definition =
          getResearchMutationById(
            mutationId,
          );

        const family =
          definition?.family ??
          record.mutationFamilies[
            index
          ] ??
          record.mutationFamilies[0];

        if (!family) return;

        const existing =
          map.get(mutationId) ?? {
            family,
            count: 0,
            expressionTotal: 0,
            stabilityTotal: 0,
          };

        existing.count += 1;
        existing.expressionTotal +=
          record.averageExpressionStrength;
        existing.stabilityTotal +=
          record.averageStability;

        map.set(
          mutationId,
          existing,
        );

        totalExpressions += 1;
      },
    );
  }

  return Array.from(
    map.entries(),
  )
    .map(
      ([mutationId, value]) => ({
        mutationId,
        mutationName:
          getResearchMutationById(
            mutationId,
          )?.name,
        family: value.family,
        count: value.count,
        observedRate:
          value.count /
          Math.max(
            1,
            totalExpressions,
          ),
        averageExpressionStrength:
          value.expressionTotal /
          value.count,
        averageStability:
          value.stabilityTotal /
          value.count,
      }),
    )
    .sort(
      (a, b) =>
        b.observedRate -
        a.observedRate,
    );
}

function buildFamilyObservations(
  records: readonly SerumResearchRecord[],
): FormulaFamilyObservation[] {
  const map = new Map<
    MutationFamily,
    number
  >();

  let total = 0;

  for (const record of records) {
    for (
      const family
      of record.mutationFamilies
    ) {
      map.set(
        family,
        (map.get(family) ?? 0) + 1,
      );
      total += 1;
    }
  }

  return Array.from(
    map.entries(),
  )
    .map(
      ([family, count]) => ({
        family,
        count,
        observedRate:
          count / Math.max(1, total),
      }),
    )
    .sort(
      (a, b) =>
        b.observedRate -
        a.observedRate,
    );
}

/* -------------------------------------------------------------------------- */
/*                             TARGET ANALYTICS                               */
/* -------------------------------------------------------------------------- */

function getTargetMutationIds(
  formula: SerumFormula,
) {
  return new Set(
    Object.entries(
      formula.profile.mutationWeights,
    )
      .filter(
        ([, weight]) =>
          weight > 1,
      )
      .map(([id]) => id),
  );
}

function getTargetFamilies(
  formula: SerumFormula,
) {
  return new Set(
    Object.entries(
      formula.profile.familyWeights,
    )
      .filter(
        ([, weight]) =>
          weight > 1,
      )
      .map(
        ([family]) =>
          family as MutationFamily,
      ),
  );
}

function calculateTargetRates(
  formula: SerumFormula,
  records: readonly SerumResearchRecord[],
) {
  const targetMutationIds =
    getTargetMutationIds(formula);

  const targetFamilies =
    getTargetFamilies(formula);

  if (!records.length) {
    return {
      targetMutationHitRate: 0,
      targetFamilyHitRate: 0,
    };
  }

  let mutationHits = 0;
  let familyHits = 0;

  for (const record of records) {
    if (
      record.mutationIds.some(
        (id) =>
          targetMutationIds.has(id),
      )
    ) {
      mutationHits += 1;
    }

    if (
      record.mutationFamilies.some(
        (family) =>
          targetFamilies.has(family),
      )
    ) {
      familyHits += 1;
    }
  }

  return {
    targetMutationHitRate:
      mutationHits / records.length,
    targetFamilyHitRate:
      familyHits / records.length,
  };
}

/* -------------------------------------------------------------------------- */
/*                            OUTCOME STATISTICS                              */
/* -------------------------------------------------------------------------- */

export function calculateFormulaOutcomeStats(
  records: readonly SerumResearchRecord[],
): FormulaOutcomeStats {
  const mutationObservations =
    buildMutationObservations(records);

  const familyObservations =
    buildFamilyObservations(records);

  const zeroMutationExperiments =
    records.filter(
      (record) =>
        record.mutationIds.length === 0,
    ).length;

  const anomalyExperiments =
    records.filter(
      (record) =>
        record.anomalyOccurred,
    ).length;

  return {
    successfulExperiments:
      records.length -
      zeroMutationExperiments,
    zeroMutationExperiments,
    anomalyExperiments,
    mutationObservations,
    familyObservations,
    averageStability:
      average(
        records.map(
          (record) =>
            record.averageStability,
        ),
      ),
    averageMutationCount:
      average(
        records.map(
          (record) =>
            record.mutationIds.length,
        ),
      ),
  };
}

/* -------------------------------------------------------------------------- */
/*                              DURATION VIEW                                 */
/* -------------------------------------------------------------------------- */

function calculateDurationAnalytics(
  formula: SerumFormula,
  records: readonly SerumResearchRecord[],
  durationDays: ResearchDurationDays,
): FormulaDurationAnalytics {
  const scoped =
    records.filter(
      (record) =>
        record.durationDays ===
        durationDays,
    );

  const targets =
    calculateTargetRates(
      formula,
      scoped,
    );

  const mutationCounts =
    buildMutationObservations(
      scoped,
    ).map(
      (observation) =>
        observation.count,
    );

  const uniqueSpecimens =
    new Set(
      scoped.map(
        (record) =>
          record.specimenTokenId,
      ),
    ).size;

  return {
    durationDays,
    experiments: scoped.length,
    mutationExpressions:
      scoped.reduce(
        (sum, record) =>
          sum +
          record.mutationIds.length,
        0,
      ),
    targetMutationHitRate:
      roundTo(
        targets.targetMutationHitRate,
        4,
      ),
    targetFamilyHitRate:
      roundTo(
        targets.targetFamilyHitRate,
        4,
      ),
    averageStability:
      roundTo(
        average(
          scoped.map(
            (record) =>
              record.averageStability,
          ),
        ),
        4,
      ),
    anomalyRate:
      roundTo(
        scoped.length
          ? scoped.filter(
              (record) =>
                record.anomalyOccurred,
            ).length /
            scoped.length
          : 0,
        4,
      ),
    observedPredictability:
      roundTo(
        calculateEntropyPredictability(
          mutationCounts,
        ),
        4,
      ),
    confidence:
      roundTo(
        calculateSampleConfidence(
          scoped.length,
          uniqueSpecimens,
        ),
        4,
      ),
  };
}

/* -------------------------------------------------------------------------- */
/*                             COMPLETE ANALYTICS                             */
/* -------------------------------------------------------------------------- */

export function calculateFormulaAnalytics({
  formula,
  records,
}: {
  formula: SerumFormula;
  records: readonly SerumResearchRecord[];
}): FormulaAnalytics {
  const scoped =
    records.filter(
      (record) =>
        record.formulaId ===
          formula.id &&
        record.formulaVersion ===
          formula.version,
    );

  const outcomeStats =
    calculateFormulaOutcomeStats(
      scoped,
    );

  const uniqueSpecimens =
    new Set(
      scoped.map(
        (record) =>
          record.specimenTokenId,
      ),
    ).size;

  const uniqueBaseTemplates =
    new Set(
      scoped.map(
        (record) =>
          record.specimenBaseId,
      ),
    ).size;

  const targets =
    calculateTargetRates(
      formula,
      scoped,
    );

  const predictability =
    calculateEntropyPredictability(
      outcomeStats
        .mutationObservations.map(
          (observation) =>
            observation.count,
        ),
    );

  const confidence =
    calculateSampleConfidence(
      scoped.length,
      uniqueSpecimens,
    );

  const elementCount =
    new Set(
      scoped.map(
        (record) =>
          record.specimenElement,
      ),
    ).size;

  const compatibilityBreadth =
    scoped.length
      ? Math.min(
          1,
          uniqueBaseTemplates /
              12 *
              0.7 +
            elementCount /
              10 *
              0.3,
        )
      : 0;

  return {
    formulaId: formula.id,
    formulaVersion:
      formula.version,
    experiments: scoped.length,
    uniqueSpecimens,
    uniqueBaseTemplates,
    researchWeightApproximation:
      scoped.reduce(
        (sum, record) =>
          sum +
          DURATION_RESEARCH_WEIGHTS[
            record.durationDays
          ],
        0,
      ),
    outcomeStats,
    targetMutationHitRate:
      roundTo(
        targets.targetMutationHitRate,
        4,
      ),
    targetFamilyHitRate:
      roundTo(
        targets.targetFamilyHitRate,
        4,
      ),
    observedPredictability:
      roundTo(
        predictability,
        4,
      ),
    confidence:
      roundTo(
        confidence,
        4,
      ),
    stabilityScore:
      roundTo(
        outcomeStats.averageStability,
        4,
      ),
    anomalyRate:
      roundTo(
        scoped.length
          ? outcomeStats
              .anomalyExperiments /
            scoped.length
          : 0,
        4,
      ),
    compatibilityBreadth:
      roundTo(
        compatibilityBreadth,
        4,
      ),
    durationAnalytics:
      ([3, 7, 30, 90] as const).map(
        (durationDays) =>
          calculateDurationAnalytics(
            formula,
            scoped,
            durationDays,
          ),
      ),
  };
}
