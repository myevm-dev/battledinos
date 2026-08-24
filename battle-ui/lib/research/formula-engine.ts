// battle-ui/lib/research/formula-engine.ts

import {
  getResearchFamilyWeight,
} from "./research-paths";

import {
  createSeededRandom,
  deriveSeed,
} from "./research-rng";

import type {
  OutcomeMutation,
} from "./research-outcomes";

import type {
  MutationFamily,
  ResearchPath,
} from "./research-types";

import type {
  FormulaCreator,
  SerumFormula,
  SerumOrigin,
  SerumResearchRecord,
} from "./serum-types";

import {
  calculateFormulaAnalytics,
} from "./formula-analytics";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export type CreateExperimentalFormulaInput = {
  id: string;
  name: string;
  code?: string;
  origin?: SerumOrigin;
  creator: FormulaCreator;
  primaryPath: ResearchPath;
  secondaryPath?: ResearchPath;
  catalystPath?: ResearchPath;
  seed: string;
  mutations: readonly OutcomeMutation[];
  description?: string;
  createdAt?: number;
};

/* -------------------------------------------------------------------------- */
/*                                 HELPERS                                    */
/* -------------------------------------------------------------------------- */

const FAMILIES: MutationFamily[] = [
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

function makeCode(name: string) {
  const normalized =
    name
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 18);

  return normalized || "FORMULA";
}

function buildFamilyWeights({
  primaryPath,
  secondaryPath,
  catalystPath,
}: {
  primaryPath: ResearchPath;
  secondaryPath?: ResearchPath;
  catalystPath?: ResearchPath;
}) {
  return Object.fromEntries(
    FAMILIES.map((family) => {
      const primary =
        getResearchFamilyWeight(
          primaryPath,
          family,
        );

      const secondary =
        secondaryPath
          ? getResearchFamilyWeight(
              secondaryPath,
              family,
            )
          : 1;

      const catalyst =
        catalystPath
          ? getResearchFamilyWeight(
              catalystPath,
              family,
            )
          : 1;

      const combined =
        1 +
        (primary - 1) * 0.58 +
        (secondary - 1) * 0.27 +
        (catalyst - 1) * 0.15;

      return [
        family,
        clamp(
          combined,
          0.5,
          2.4,
        ),
      ];
    }),
  ) as Partial<
    Record<MutationFamily, number>
  >;
}

function chooseFormulaMutationWeights({
  mutations,
  familyWeights,
  seed,
}: {
  mutations: readonly OutcomeMutation[];
  familyWeights: Partial<
    Record<MutationFamily, number>
  >;
  seed: string;
}) {
  const rng =
    createSeededRandom(
      deriveSeed(
        seed,
        "formula-mutation-profile",
      ),
    );

  const candidates =
    mutations
      .map((mutation) => ({
        mutation,
        score:
          (familyWeights[
            mutation.family
          ] ?? 1) *
          (0.85 +
            rng.next() * 0.3),
      }))
      .filter(
        ({ score }) => score > 1.05,
      )
      .sort(
        (a, b) =>
          b.score - a.score,
      );

  const targetCount =
    Math.min(
      6,
      Math.max(
        3,
        Math.floor(
          3 + rng.next() * 4,
        ),
      ),
    );

  const selected =
    candidates.slice(
      0,
      targetCount,
    );

  return Object.fromEntries(
    selected.map(
      ({ mutation }, index) => {
        const descending =
          2.25 - index * 0.18;

        const variation =
          0.92 + rng.next() * 0.16;

        return [
          mutation.id,
          clamp(
            descending * variation,
            1.12,
            2.4,
          ),
        ];
      },
    ),
  );
}

/* -------------------------------------------------------------------------- */
/*                            FORMULA CREATION                                */
/* -------------------------------------------------------------------------- */

/**
 * Creates a lab formula programmatically from chosen research directions.
 *
 * The player chooses the experiment direction. The system derives the actual
 * mutation-bias profile. This prevents users from simply typing "Iron Hide"
 * and manufacturing a guaranteed Iron Hide serum.
 */
export function createExperimentalFormula({
  id,
  name,
  code,
  origin = "lab",
  creator,
  primaryPath,
  secondaryPath,
  catalystPath,
  seed,
  mutations,
  description,
  createdAt = Date.now(),
}: CreateExperimentalFormulaInput): SerumFormula {
  const familyWeights =
    buildFamilyWeights({
      primaryPath,
      secondaryPath,
      catalystPath,
    });

  const mutationWeights =
    chooseFormulaMutationWeights({
      mutations,
      familyWeights,
      seed,
    });

  const rng =
    createSeededRandom(
      deriveSeed(
        seed,
        "formula-properties",
      ),
    );

  const stabilityModifier =
    clamp(
      -0.03 + rng.next() * 0.1,
      -0.15,
      0.15,
    );

  const expressionModifier =
    clamp(
      0.97 + rng.next() * 0.08,
      0.85,
      1.15,
    );

  return {
    id,
    name,
    code:
      code ?? makeCode(name),
    version: 1,
    origin,
    status: "experimental",
    creator,
    description,
    profile: {
      primaryPath,
      secondaryPath,
      catalystPath,
      familyWeights,
      mutationWeights,
      stabilityModifier,
      expressionModifier,
    },
    discovery: {
      experimentCount: 0,
      researchWeight: 0,
      uniqueSpecimens: 0,
      uniqueBaseTemplates: 0,
    },
    outcomes: {
      successfulExperiments: 0,
      zeroMutationExperiments: 0,
      anomalyExperiments: 0,
      mutationObservations: [],
      familyObservations: [],
      averageStability: 0,
      averageMutationCount: 0,
    },
    tags: [
      primaryPath.toLowerCase(),
      ...(secondaryPath
        ? [
            secondaryPath.toLowerCase(),
          ]
        : []),
      ...(catalystPath
        ? [
            catalystPath.toLowerCase(),
          ]
        : []),
      "experimental",
    ],
    createdAt,
    updatedAt: createdAt,
  };
}

/* -------------------------------------------------------------------------- */
/*                          RESEARCH DATA REFRESH                             */
/* -------------------------------------------------------------------------- */

/**
 * Updates the evidence summary for the CURRENT formula version without
 * silently changing its underlying biological weights.
 *
 * Research evidence improves knowledge and market confidence. It does not
 * magically make the formula stronger.
 */
export function refreshFormulaResearchData({
  formula,
  records,
  updatedAt = Date.now(),
}: {
  formula: SerumFormula;
  records: readonly SerumResearchRecord[];
  updatedAt?: number;
}): SerumFormula {
  const analytics =
    calculateFormulaAnalytics({
      formula,
      records,
    });

  const scoped =
    records.filter(
      (record) =>
        record.formulaId ===
          formula.id &&
        record.formulaVersion ===
          formula.version,
    );

  const firstObservedAt =
    scoped.length
      ? Math.min(
          ...scoped.map(
            (record) =>
              record.completedAt,
          ),
        )
      : undefined;

  const lastObservedAt =
    scoped.length
      ? Math.max(
          ...scoped.map(
            (record) =>
              record.completedAt,
          ),
        )
      : undefined;

  return {
    ...formula,
    discovery: {
      ...formula.discovery,
      experimentCount:
        analytics.experiments,
      researchWeight:
        analytics
          .researchWeightApproximation,
      uniqueSpecimens:
        analytics.uniqueSpecimens,
      uniqueBaseTemplates:
        analytics.uniqueBaseTemplates,
      firstObservedAt,
      lastObservedAt,
    },
    outcomes:
      analytics.outcomeStats,
    updatedAt,
  };
}

/* -------------------------------------------------------------------------- */
/*                          FORMULA VERSIONING                                */
/* -------------------------------------------------------------------------- */

/**
 * Creates a new formula version after deliberate lab refinement.
 *
 * The old version and its research record should remain immutable in storage.
 * The new version starts a new evidence history.
 */
export function createRefinedFormulaVersion({
  formula,
  seed,
  mutations,
  createdAt = Date.now(),
}: {
  formula: SerumFormula;
  seed: string;
  mutations: readonly OutcomeMutation[];
  createdAt?: number;
}): SerumFormula {
  const analyticsTargets =
    formula.outcomes
      .mutationObservations
      .slice(0, 5);

  const rng =
    createSeededRandom(
      deriveSeed(
        seed,
        formula.id,
        formula.version + 1,
      ),
    );

  const nextMutationWeights = {
    ...formula.profile
      .mutationWeights,
  };

  for (
    const observation
    of analyticsTargets
  ) {
    const current =
      nextMutationWeights[
        observation.mutationId
      ] ?? 1;

    const evidenceBoost =
      1 +
      observation.observedRate *
        0.35;

    nextMutationWeights[
      observation.mutationId
    ] = clamp(
      current *
        evidenceBoost *
        (0.97 + rng.next() * 0.06),
      0.5,
      3.2,
    );
  }

  return {
    ...formula,
    version:
      formula.version + 1,
    status: "experimental",
    profile: {
      ...formula.profile,
      mutationWeights:
        nextMutationWeights,
    },
    discovery: {
      experimentCount: 0,
      researchWeight: 0,
      uniqueSpecimens: 0,
      uniqueBaseTemplates: 0,
    },
    outcomes: {
      successfulExperiments: 0,
      zeroMutationExperiments: 0,
      anomalyExperiments: 0,
      mutationObservations: [],
      familyObservations: [],
      averageStability: 0,
      averageMutationCount: 0,
    },
    createdAt,
    updatedAt: createdAt,
  };
}
