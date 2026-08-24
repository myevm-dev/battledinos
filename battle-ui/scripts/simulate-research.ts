// battle-ui/scripts/simulate-research.ts
// Run with: npx tsx scripts/simulate-research.ts

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

const ITERATIONS = 2_000;

const specimen: SpecimenResearchState = {
  tokenId: 8472,
  baseId: 1,
  name: "Echoguard",
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
      name: "Primal Chomp",
      power: 82,
    },
    {
      slot: 2,
      name: "Wild Claw",
      power: 44,
    },
    {
      slot: 3,
      name: "Primal Rush",
      power: 64,
    },
  ],
  mutations: [],
};

const mutationLibrary =
  MUTATIONS.map(adaptMutation);

const formula =
  createExperimentalFormula({
    id: "sim-ironbloom",
    name: "Ironbloom",
    code: "IRONBLOOM-SIM",
    origin: "project",
    creator: {
      type: "project",
      displayName: "SPECIMEN",
    },
    primaryPath: "Defensive",
    secondaryPath: "Structural",
    catalystPath: "Metabolic",
    seed: "ironbloom-genesis-formula",
    mutations: mutationLibrary,
  });

function runScenario({
  durationDays,
  useSerum,
}: {
  durationDays: ResearchDurationDays;
  useSerum: boolean;
}) {
  const mutationCounts =
    new Map<string, number>();

  const familyCounts =
    new Map<string, number>();

  const rarityCounts =
    new Map<string, number>();

  const expressionValues: number[] = [];
  const stabilityValues: number[] = [];

  let anomalies = 0;
  let zeroMutations = 0;
  let totalMutationExpressions = 0;

  for (
    let index = 0;
    index < ITERATIONS;
    index += 1
  ) {
    const result = runResearch({
      request: {
        researchId:
          `sim-${durationDays}-${index}`,
        specimen,
        input: {
          specimenId:
            String(specimen.tokenId),
          path: "Defensive",
          secondaryPath:
            "Structural",
          serumId:
            useSerum
              ? formula.id
              : undefined,
          intensity: "standard",
          durationDays,
          mode: "clone",
        },
        seed:
          `simulation:${durationDays}:${useSerum}:${index}`,
        startedAt: 0,
      },
      mutations: mutationLibrary,
      formula:
        useSerum
          ? formula
          : undefined,
    });

    const expressions = [
      ...result.outcome.mutations,
      ...(result.outcome.anomaly
        ? [result.outcome.anomaly]
        : []),
    ];

    if (
      result.outcome.mutations.length ===
      0
    ) {
      zeroMutations += 1;
    }

    if (result.outcome.anomaly) {
      anomalies += 1;
    }

    totalMutationExpressions +=
      expressions.length;

    for (const expression of expressions) {
      mutationCounts.set(
        expression.mutationId,
        (mutationCounts.get(
          expression.mutationId,
        ) ?? 0) + 1,
      );

      familyCounts.set(
        expression.family,
        (familyCounts.get(
          expression.family,
        ) ?? 0) + 1,
      );

      rarityCounts.set(
        expression.rarity,
        (rarityCounts.get(
          expression.rarity,
        ) ?? 0) + 1,
      );

      expressionValues.push(
        expression.expressionStrength,
      );

      stabilityValues.push(
        expression.stability,
      );
    }
  }

  const topMutations =
    Array.from(
      mutationCounts.entries(),
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id, count]) => ({
        id,
        count,
        percentOfExperiments:
          Number(
            (
              (count / ITERATIONS) *
              100
            ).toFixed(2),
          ),
      }));

  const sortedRecord = (
    map: Map<string, number>,
  ) =>
    Object.fromEntries(
      Array.from(map.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([key, count]) => [
          key,
          Number(
            (
              (count /
                Math.max(
                  1,
                  totalMutationExpressions,
                )) *
              100
            ).toFixed(2),
          ),
        ]),
    );

  const average = (
    values: number[],
  ) =>
    values.length
      ? values.reduce(
          (sum, value) => sum + value,
          0,
        ) / values.length
      : 0;

  const variance = (
    values: number[],
  ) => {
    if (!values.length) return 0;
    const mean = average(values);
    return (
      values.reduce(
        (sum, value) =>
          sum +
          (value - mean) ** 2,
        0,
      ) / values.length
    );
  };

  return {
    durationDays,
    serum: useSerum,
    experiments: ITERATIONS,
    anomalyRate:
      Number(
        (
          (anomalies / ITERATIONS) *
          100
        ).toFixed(2),
      ),
    zeroMutationRate:
      Number(
        (
          (zeroMutations /
            ITERATIONS) *
          100
        ).toFixed(2),
      ),
    averageMutationCount:
      Number(
        (
          totalMutationExpressions /
          ITERATIONS
        ).toFixed(3),
      ),
    averageExpression:
      Number(
        average(
          expressionValues,
        ).toFixed(4),
      ),
    expressionStdDev:
      Number(
        Math.sqrt(
          variance(
            expressionValues,
          ),
        ).toFixed(4),
      ),
    averageStability:
      Number(
        average(
          stabilityValues,
        ).toFixed(4),
      ),
    families:
      sortedRecord(familyCounts),
    rarities:
      sortedRecord(rarityCounts),
    topMutations,
  };
}

const validation =
  validateMutationLibrary();

console.log(
  "Mutation library validation:",
  validation,
);

for (
  const durationDays
  of [3, 7, 30, 90] as const
) {
  console.log("\n========================================");
  console.log(
    `${durationDays} DAY / NO SERUM`,
  );
  console.dir(
    runScenario({
      durationDays,
      useSerum: false,
    }),
    { depth: null },
  );

  console.log("\n----------------------------------------");
  console.log(
    `${durationDays} DAY / WITH SERUM`,
  );
  console.dir(
    runScenario({
      durationDays,
      useSerum: true,
    }),
    { depth: null },
  );
}
