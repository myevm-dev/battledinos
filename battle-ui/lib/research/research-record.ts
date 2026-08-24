// battle-ui/lib/research/research-record.ts

import type {
  CanonicalResearchResult,
} from "./research-engine";

import type {
  SerumResearchRecord,
} from "./serum-types";

import type {
  SpecimenResearchState,
} from "./research-types";

/**
 * Converts one completed real serum-assisted research result into the compact
 * evidence record consumed by formula analytics/certification.
 */
export function createSerumResearchRecord({
  specimen,
  result,
}: {
  specimen: SpecimenResearchState;
  result: CanonicalResearchResult;
}): SerumResearchRecord {
  if (!result.serum) {
    throw new Error(
      "Cannot create a serum research record for research that did not use a serum/formula.",
    );
  }

  if (result.outcome.mode === "clone") {
    throw new Error(
      "Clone simulations are predictive and should not be counted as completed real-world serum evidence.",
    );
  }

  const expressions = [
    ...result.outcome.mutations,
    ...(result.outcome.anomaly
      ? [result.outcome.anomaly]
      : []),
  ];

  const averageExpressionStrength =
    expressions.length
      ? expressions.reduce(
          (sum, mutation) =>
            sum +
            mutation.expressionStrength,
          0,
        ) /
        expressions.length
      : 0;

  const averageStability =
    expressions.length
      ? expressions.reduce(
          (sum, mutation) =>
            sum + mutation.stability,
          0,
        ) /
        expressions.length
      : result.outcome.stability;

  return {
    researchId:
      result.outcome.researchId,
    formulaId:
      result.serum.formulaId,
    formulaVersion:
      result.serum.formulaVersion,
    serumBatchId:
      result.outcome.serumId,
    specimenTokenId:
      specimen.tokenId,
    specimenBaseId:
      specimen.baseId,
    specimenElement:
      specimen.element,
    compatibility:
      result.outcome
        .compatibility.overall,
    mutationIds:
      expressions.map(
        (mutation) =>
          mutation.mutationId,
      ),
    mutationFamilies:
      expressions.map(
        (mutation) =>
          mutation.family,
      ),
    averageExpressionStrength,
    averageStability,
    anomalyOccurred:
      Boolean(
        result.outcome.anomaly,
      ),
    durationDays:
      result.outcome.durationDays,
    completedAt:
      result.outcome.completedAt,
  };
}
