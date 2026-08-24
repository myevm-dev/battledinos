// battle-ui/lib/research/formula-certification.ts

import {
  DEFAULT_FORMULA_CERTIFICATION_REQUIREMENTS,
  type FormulaCertificationRequirements,
  type FormulaStatus,
  type SerumFormula,
  type SerumResearchRecord,
} from "./serum-types";

import {
  calculateFormulaAnalytics,
  type FormulaAnalytics,
} from "./formula-analytics";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export type FormulaCertificationCheck = {
  key: string;
  label: string;
  passed: boolean;
  current: number;
  required: number;
};

export type FormulaCertificationResult = {
  eligible: boolean;
  suggestedStatus: FormulaStatus;
  checks: FormulaCertificationCheck[];
  analytics: FormulaAnalytics;
};

/* -------------------------------------------------------------------------- */
/*                              CERTIFICATION                                 */
/* -------------------------------------------------------------------------- */

export function evaluateFormulaCertification({
  formula,
  records,
  discoveredMutationIds,
  requirements =
    DEFAULT_FORMULA_CERTIFICATION_REQUIREMENTS,
}: {
  formula: SerumFormula;
  records: readonly SerumResearchRecord[];

  /**
   * Lab formulas may only certify intentional mutation targets that the lab
   * has actually discovered. Broad family-only formulas do not require a
   * mutation target.
   */
  discoveredMutationIds?: readonly string[];

  requirements?: FormulaCertificationRequirements;
}): FormulaCertificationResult {
  const analytics =
    calculateFormulaAnalytics({
      formula,
      records,
    });

  const maximumAnomalyRate =
    requirements.maximumAnomalyRate ??
    1;

  const targetedMutationIds =
    Object.keys(
      formula.profile.mutationWeights,
    );

  const discoveredSet = new Set(
    discoveredMutationIds ?? [],
  );

  const knowledgeCheckRequired =
    formula.origin === "lab" &&
    targetedMutationIds.length > 0;

  const knownTargetCount =
    targetedMutationIds.filter(
      (mutationId) =>
        discoveredSet.has(
          mutationId,
        ),
    ).length;

  const checks: FormulaCertificationCheck[] = [
    {
      key: "experiments",
      label: "Completed Experiments",
      passed:
        analytics.experiments >=
        requirements.minimumExperiments,
      current:
        analytics.experiments,
      required:
        requirements.minimumExperiments,
    },
    {
      key: "unique-specimens",
      label: "Unique Specimens",
      passed:
        analytics.uniqueSpecimens >=
        requirements.minimumUniqueSpecimens,
      current:
        analytics.uniqueSpecimens,
      required:
        requirements.minimumUniqueSpecimens,
    },
    {
      key: "base-templates",
      label: "Unique Genetic Templates",
      passed:
        analytics.uniqueBaseTemplates >=
        requirements.minimumUniqueBaseTemplates,
      current:
        analytics.uniqueBaseTemplates,
      required:
        requirements.minimumUniqueBaseTemplates,
    },
    {
      key: "research-weight",
      label: "Research Evidence Weight",
      passed:
        analytics.researchWeightApproximation >=
        requirements.minimumResearchWeight,
      current:
        analytics.researchWeightApproximation,
      required:
        requirements.minimumResearchWeight,
    },
    {
      key: "anomaly-rate",
      label: "Maximum Anomaly Rate",
      passed:
        analytics.anomalyRate <=
        maximumAnomalyRate,
      current:
        analytics.anomalyRate,
      required:
        maximumAnomalyRate,
    },
    ...(knowledgeCheckRequired
      ? [
          {
            key: "discovered-targets",
            label: "Discovered Mutation Targets",
            passed:
              knownTargetCount ===
              targetedMutationIds.length,
            current:
              knownTargetCount,
            required:
              targetedMutationIds.length,
          },
        ]
      : []),
  ];

  const eligible =
    checks.every(
      (check) => check.passed,
    );

  let suggestedStatus: FormulaStatus =
    "experimental";

  if (eligible) {
    suggestedStatus = "certified";
  } else if (
    analytics.experiments >= 5 &&
    analytics.uniqueSpecimens >= 3
  ) {
    suggestedStatus = "observed";
  }

  if (formula.status === "retired") {
    suggestedStatus = "retired";
  }

  return {
    eligible,
    suggestedStatus,
    checks,
    analytics,
  };
}
