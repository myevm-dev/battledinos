// battle-ui/scripts/simulate-research-public.ts
// Public SPECIMEN research-outcome benchmark.
//
// Run from battle-ui:
// npx tsx scripts/simulate-research-public.ts > public/research/simulations/research-outcomes-benchmark-v1.txt
//
// This public benchmark intentionally outputs aggregate statistics only.
// It does NOT print mutation IDs, mutation names, formula mutation weights,
// production seeds, or other hidden discovery information.

import {
  MUTATIONS,
} from "../lib/mutation-library";

import {
  adaptMutation,
  validateMutationLibrary,
} from "../lib/research/mutation-library-adapter";

import {
  createExperimentalFormula,
} from "../lib/research/formula-engine";

import {
  runResearch,
} from "../lib/research/research-engine";

import type {
  ResearchDurationDays,
  SpecimenResearchState,
} from "../lib/research/research-types";

const EXPERIMENTS_PER_SCENARIO = 2_500;

const DURATIONS = [
  3,
  7,
  30,
  90,
] as const satisfies readonly ResearchDurationDays[];

const specimen: SpecimenResearchState = {
  tokenId: 8472,
  baseId: 1,
  name: "Benchmark Specimen",
  edition: 37,
  editionSupply: 99,
  element: "Primal",
  species: "Allosaurus",
  level: 18,
  xp: {
    lifetime: 20_000,
    spent: 1_000,
    available: 19_000,
  },
  evolutionStage: 0,
  genetics: {
    health: 1.02,
    attack: 0.98,
    defense: 1.04,
    speed: 1.01,
    move_1: 1.05,
    move_2: 0.97,
    move_3: 1.02,
  },
  battleStats: {
    health: 82,
    attack: 79,
    defense: 73,
    speed: 73,
  },
  moves: [
    {
      slot: 1,
      name: "Benchmark Move 1",
      power: 82,
    },
    {
      slot: 2,
      name: "Benchmark Move 2",
      power: 44,
    },
    {
      slot: 3,
      name: "Benchmark Move 3",
      power: 64,
    },
  ],
  mutations: [],
};

const mutationLibrary =
  MUTATIONS.map(adaptMutation);

/**
 * This is a fixed project reference formula used only to measure how a
 * serum changes aggregate research behavior.
 *
 * The public report does not reveal the formula's mutation targets or
 * internal weights.
 */
const referenceFormula =
  createExperimentalFormula({
    id: "public-reference-serum-v1",
    name: "Reference Defensive Serum",
    code: "PUBLIC-REFERENCE-V1",
    origin: "project",
    creator: {
      type: "project",
      displayName: "SPECIMEN",
    },
    primaryPath: "Defensive",
    secondaryPath: "Structural",
    catalystPath: "Metabolic",
    seed: "specimen-public-reference-formula-v1",
    mutations: mutationLibrary,
  });

type PublicScenarioResult = {
  durationDays: ResearchDurationDays;
  serum: boolean;
  experiments: number;

  anomalyRate: number;
  zeroMutationRate: number;
  averageMutationCount: number;

  averageExpression: number;
  expressionStdDev: number;
  expressionP10: number;
  expressionP50: number;
  expressionP90: number;

  averageStability: number;
  stabilityP10: number;
  stabilityP50: number;
  stabilityP90: number;

  targetDirectionShare: number;
  referenceClusterShare: number;

  familyDistribution: Record<string, number>;
  rarityDistribution: Record<string, number>;
};

function round(
  value: number,
  digits = 2,
) {
  return Number(
    value.toFixed(digits),
  );
}

function average(
  values: readonly number[],
) {
  if (values.length === 0) {
    return 0;
  }

  return (
    values.reduce(
      (sum, value) =>
        sum + value,
      0,
    ) / values.length
  );
}

function variance(
  values: readonly number[],
) {
  if (values.length === 0) {
    return 0;
  }

  const mean =
    average(values);

  return (
    values.reduce(
      (sum, value) =>
        sum +
        (value - mean) ** 2,
      0,
    ) / values.length
  );
}

function quantile(
  values: readonly number[],
  q: number,
) {
  if (values.length === 0) {
    return 0;
  }

  const sorted =
    [...values].sort(
      (a, b) => a - b,
    );

  const position =
    (sorted.length - 1) * q;

  const lower =
    Math.floor(position);

  const upper =
    Math.ceil(position);

  if (lower === upper) {
    return sorted[lower] ?? 0;
  }

  const lowerValue =
    sorted[lower] ?? 0;

  const upperValue =
    sorted[upper] ?? lowerValue;

  const fraction =
    position - lower;

  return (
    lowerValue +
    (upperValue - lowerValue) *
      fraction
  );
}

function percentageRecord(
  map: Map<string, number>,
  denominator: number,
) {
  return Object.fromEntries(
    Array.from(map.entries())
      .sort(
        (a, b) =>
          b[1] - a[1],
      )
      .map(
        ([key, count]) => [
          key,
          round(
            (
              count /
              Math.max(
                1,
                denominator,
              )
            ) * 100,
            2,
          ),
        ],
      ),
  );
}

function runScenario({
  durationDays,
  useSerum,
}: {
  durationDays: ResearchDurationDays;
  useSerum: boolean;
}): PublicScenarioResult {
  const familyCounts =
    new Map<string, number>();

  const rarityCounts =
    new Map<string, number>();

  const expressionValues:
    number[] = [];

  const stabilityValues:
    number[] = [];

  let anomalies = 0;
  let zeroMutations = 0;
  let totalMutationExpressions = 0;

  for (
    let index = 0;
    index <
    EXPERIMENTS_PER_SCENARIO;
    index += 1
  ) {
    const result =
      runResearch({
        request: {
          researchId:
            `public-benchmark-${durationDays}-${useSerum ? "serum" : "raw"}-${index}`,

          specimen,

          input: {
            specimenId:
              String(
                specimen.tokenId,
              ),

            path:
              "Defensive",

            secondaryPath:
              "Structural",

            serumId:
              useSerum
                ? referenceFormula.id
                : undefined,

            intensity:
              "standard",

            durationDays,

            mode:
              "clone",
          },

          seed:
            `public-benchmark-v1:${durationDays}:${useSerum}:${index}`,

          startedAt: 0,
        },

        mutations:
          mutationLibrary,

        formula:
          useSerum
            ? referenceFormula
            : undefined,
      });

    const expressions = [
      ...result.outcome.mutations,

      ...(result.outcome.anomaly
        ? [
            result.outcome
              .anomaly,
          ]
        : []),
    ];

    if (
      result.outcome
        .mutations.length === 0
    ) {
      zeroMutations += 1;
    }

    if (
      result.outcome.anomaly
    ) {
      anomalies += 1;
    }

    totalMutationExpressions +=
      expressions.length;

    for (
      const expression
      of expressions
    ) {
      familyCounts.set(
        expression.family,

        (
          familyCounts.get(
            expression.family,
          ) ?? 0
        ) + 1,
      );

      rarityCounts.set(
        expression.rarity,

        (
          rarityCounts.get(
            expression.rarity,
          ) ?? 0
        ) + 1,
      );

      expressionValues.push(
        expression
          .expressionStrength,
      );

      stabilityValues.push(
        expression.stability,
      );
    }
  }

  const familyDistribution =
    percentageRecord(
      familyCounts,
      totalMutationExpressions,
    );

  const rarityDistribution =
    percentageRecord(
      rarityCounts,
      totalMutationExpressions,
    );

  const targetDirectionShare =
    (
      familyDistribution
        .Defensive ?? 0
    ) +
    (
      familyDistribution
        .Structural ?? 0
    );

  const referenceClusterShare =
    targetDirectionShare +
    (
      familyDistribution
        .Metabolic ?? 0
    );

  return {
    durationDays,
    serum:
      useSerum,
    experiments:
      EXPERIMENTS_PER_SCENARIO,

    anomalyRate:
      round(
        (
          anomalies /
          EXPERIMENTS_PER_SCENARIO
        ) * 100,
        2,
      ),

    zeroMutationRate:
      round(
        (
          zeroMutations /
          EXPERIMENTS_PER_SCENARIO
        ) * 100,
        2,
      ),

    averageMutationCount:
      round(
        totalMutationExpressions /
          EXPERIMENTS_PER_SCENARIO,
        3,
      ),

    averageExpression:
      round(
        average(
          expressionValues,
        ),
        4,
      ),

    expressionStdDev:
      round(
        Math.sqrt(
          variance(
            expressionValues,
          ),
        ),
        4,
      ),

    expressionP10:
      round(
        quantile(
          expressionValues,
          0.10,
        ),
        4,
      ),

    expressionP50:
      round(
        quantile(
          expressionValues,
          0.50,
        ),
        4,
      ),

    expressionP90:
      round(
        quantile(
          expressionValues,
          0.90,
        ),
        4,
      ),

    averageStability:
      round(
        average(
          stabilityValues,
        ),
        4,
      ),

    stabilityP10:
      round(
        quantile(
          stabilityValues,
          0.10,
        ),
        4,
      ),

    stabilityP50:
      round(
        quantile(
          stabilityValues,
          0.50,
        ),
        4,
      ),

    stabilityP90:
      round(
        quantile(
          stabilityValues,
          0.90,
        ),
        4,
      ),

    targetDirectionShare:
      round(
        targetDirectionShare,
        2,
      ),

    referenceClusterShare:
      round(
        referenceClusterShare,
        2,
      ),

    familyDistribution,

    rarityDistribution,
  };
}

function getLegendaryRate(
  scenario: PublicScenarioResult,
) {
  return (
    scenario
      .rarityDistribution
      .Legendary ?? 0
  );
}

function buildComparison(
  noSerum:
    PublicScenarioResult,
  withSerum:
    PublicScenarioResult,
) {
  return {
    durationDays:
      noSerum.durationDays,

    targetDirection: {
      noSerum:
        noSerum
          .targetDirectionShare,

      withSerum:
        withSerum
          .targetDirectionShare,

      serumDelta:
        round(
          withSerum
            .targetDirectionShare -
            noSerum
              .targetDirectionShare,
          2,
        ),
    },

    expressionVariance: {
      noSerumStdDev:
        noSerum
          .expressionStdDev,

      withSerumStdDev:
        withSerum
          .expressionStdDev,

      delta:
        round(
          withSerum
            .expressionStdDev -
            noSerum
              .expressionStdDev,
          4,
        ),
    },

    averageStability: {
      noSerum:
        noSerum
          .averageStability,

      withSerum:
        withSerum
          .averageStability,

      delta:
        round(
          withSerum
            .averageStability -
            noSerum
              .averageStability,
          4,
        ),
    },

    legendaryShare: {
      noSerum:
        getLegendaryRate(
          noSerum,
        ),

      withSerum:
        getLegendaryRate(
          withSerum,
        ),

      delta:
        round(
          getLegendaryRate(
            withSerum,
          ) -
            getLegendaryRate(
              noSerum,
            ),
          2,
        ),
    },
  };
}

const validation =
  validateMutationLibrary();

if (!validation.valid) {
  throw new Error(
    `Mutation library validation failed: ${validation.issues.join(
      "; ",
    )}`,
  );
}

const results:
  PublicScenarioResult[] = [];

for (
  const durationDays
  of DURATIONS
) {
  results.push(
    runScenario({
      durationDays,
      useSerum: false,
    }),
  );

  results.push(
    runScenario({
      durationDays,
      useSerum: true,
    }),
  );
}

const comparisons =
  DURATIONS.map(
    (durationDays) => {
      const noSerum =
        results.find(
          (scenario) =>
            scenario
              .durationDays ===
              durationDays &&
            !scenario.serum,
        );

      const withSerum =
        results.find(
          (scenario) =>
            scenario
              .durationDays ===
              durationDays &&
            scenario.serum,
        );

      if (
        !noSerum ||
        !withSerum
      ) {
        throw new Error(
          `Missing benchmark scenario for ${durationDays} days.`,
        );
      }

      return buildComparison(
        noSerum,
        withSerum,
      );
    },
  );

console.log(
  "========================================",
);

console.log(
  "SPECIMEN RESEARCH OUTCOME BENCHMARK V1",
);

console.log(
  JSON.stringify(
    {
      requestedTotalExperiments:
        EXPERIMENTS_PER_SCENARIO *
        DURATIONS.length *
        2,

      experimentsPerScenario:
        EXPERIMENTS_PER_SCENARIO,

      scenarios:
        DURATIONS.length *
        2,

      mutationLibraryCount:
        validation.count,

      mutationLibraryValid:
        validation.valid,

      researchPath:
        "Defensive",

      secondaryPath:
        "Structural",

      intensity:
        "standard",

      serumComparison:
        "project reference formula",

      publicSafety:
        "aggregate statistics only",
    },
    null,
    2,
  ),
);

for (
  const scenario
  of results
) {
  console.log(
    "\n========================================",
  );

  console.log(
    `${scenario.durationDays} DAY / ${
      scenario.serum
        ? "WITH REFERENCE SERUM"
        : "NO SERUM"
    }`,
  );

  console.log(
    JSON.stringify(
      scenario,
      null,
      2,
    ),
  );
}

console.log(
  "\n========================================",
);

console.log(
  "SERUM COMPARISON BY DURATION",
);

console.log(
  JSON.stringify(
    comparisons,
    null,
    2,
  ),
);

console.log(
  "\n========================================",
);

console.log(
  "INTERPRETATION",
);

console.log(
  [
    "Duration is intended to increase control and narrow expression variance rather than directly increase mutation rarity.",
    "The reference serum is intended to concentrate outcomes toward its research direction while preserving mutation diversity.",
    "Rarity percentages are observed benchmark results, not guarantees for an individual experiment.",
    "No mutation names, mutation IDs, formula mutation targets, or production seeds are included in this public report.",
  ].join("\n"),
);
