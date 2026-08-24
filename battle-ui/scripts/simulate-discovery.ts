// battle-ui/scripts/simulate-discovery.ts
// Run with: npx tsx scripts/simulate-discovery.ts

import {
  MUTATIONS,
} from "../lib/mutation-library";

import {
  adaptMutation,
} from "../lib/research/mutation-library-adapter";

import {
  createLabResearchState,
} from "../lib/research/lab-research";

import {
  resolveResearchDiscovery,
} from "../lib/research/discovery-engine";

import {
  runResearch,
} from "../lib/research/research-engine";

import type {
  CanonicalResearchResult,
} from "../lib/research/research-engine";

import type {
  LabResearchState,
  MutationDiscoveryRecord,
  MutationDiscoveryReason,
} from "../lib/research/discovery-types";

import type {
  MutationFamily,
  MutationRarity,
  ResearchDurationDays,
  SpecimenResearchState,
} from "../lib/research/research-types";

const DURATIONS = [
  3,
  7,
  30,
  90,
] as const;

/**
 * 10,000 experiments total.
 *
 * We split them across many independent labs instead of putting thousands of
 * experiments into one lab. That gives a better picture of normal player/lab
 * progression while still exposing pool exhaustion when it appears.
 */
const TOTAL_EXPERIMENTS = 10_000;

const EXPERIMENTS_PER_DURATION =
  Math.max(
    1,
    Math.floor(
      TOTAL_EXPERIMENTS /
        DURATIONS.length,
    ),
  );

const LABS_PER_DURATION = 100;

const EXPERIMENTS_PER_LAB =
  Math.max(
    1,
    Math.ceil(
      EXPERIMENTS_PER_DURATION /
        LABS_PER_DURATION,
    ),
  );

const mutationLibrary =
  MUTATIONS.map(adaptMutation);

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
    lifetime: 1_000_000,
    spent: 0,
    available: 1_000_000,
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

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Discovery does not depend on the random mutation expression rolled by the
 * specimen research engine. It depends on the locked research settings and
 * compatibility. Running the full 600-mutation expression engine 10,000 times
 * would make this analytics script unnecessarily slow.
 *
 * We therefore resolve one canonical template per duration, then give every
 * discovery opportunity its own research ID, seed, and timestamps. The
 * discovery engine still receives unique deterministic seeds for every run.
 */
function createResearchTemplate(
  durationDays: ResearchDurationDays,
): CanonicalResearchResult {
  return runResearch({
    request: {
      researchId:
        `discovery-template-${durationDays}`,
      specimen,
      input: {
        specimenId:
          String(specimen.tokenId),
        path: "Defensive",
        secondaryPath:
          "Structural",
        intensity: "standard",
        durationDays,
        mode: "standard",
      },
      seed:
        `discovery-template:${durationDays}`,
      startedAt: 0,
    },
    mutations: mutationLibrary,
  });
}

function createResearchRun({
  template,
  durationDays,
  labIndex,
  experimentIndex,
}: {
  template: CanonicalResearchResult;
  durationDays: ResearchDurationDays;
  labIndex: number;
  experimentIndex: number;
}): CanonicalResearchResult {
  const researchId =
    `discovery-${durationDays}-${labIndex}-${experimentIndex}`;

  const seed =
    `discovery-sim:${durationDays}:${labIndex}:${experimentIndex}`;

  const startedAt =
    experimentIndex *
    durationDays *
    DAY_MS;

  const completedAt =
    startedAt +
    durationDays *
    DAY_MS;

  return {
    ...template,
    outcome: {
      ...template.outcome,
      researchId,
      seed,
      startedAt,
      completedAt,
    },
    timing: {
      ...template.timing,
      startedAt,
      completesAt: completedAt,
      durationDays,
    },
  };
}

function round(
  value: number,
  places = 2,
) {
  const factor =
    10 ** places;

  return Math.round(
    value * factor,
  ) / factor;
}

function percent(
  part: number,
  total: number,
) {
  if (total <= 0) {
    return 0;
  }

  return round(
    (part / total) * 100,
    2,
  );
}

function countBy<T extends string>(
  values: readonly T[],
) {
  const map = new Map<T, number>();

  for (const value of values) {
    map.set(
      value,
      (map.get(value) ?? 0) + 1,
    );
  }

  return Object.fromEntries(
    Array.from(map.entries())
      .sort((a, b) => b[1] - a[1]),
  );
}

function countWithPercent<
  T extends string,
>(
  values: readonly T[],
) {
  const counts = countBy(values);

  return Object.fromEntries(
    Object.entries(counts).map(
      ([key, count]) => [
        key,
        {
          count,
          percent:
            percent(
              count,
              values.length,
            ),
        },
      ],
    ),
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
    ) /
    values.length
  );
}

function runDurationScenario(
  durationDays: ResearchDurationDays,
) {
  const template =
    createResearchTemplate(
      durationDays,
    );

  const discoveries:
    MutationDiscoveryRecord[] = [];

  const reasons:
    MutationDiscoveryReason[] = [];

  const labUniqueCounts:
    number[] = [];

  const labLevels:
    number[] = [];

  let totalResearchHours = 0;
  let totalExperiments = 0;

  for (
    let labIndex = 0;
    labIndex < LABS_PER_DURATION;
    labIndex += 1
  ) {
    let lab: LabResearchState =
      createLabResearchState({
        labId:
          `sim-lab-${durationDays}-${labIndex}`,
        walletAddress:
          `0xSIM${labIndex}`,
        createdAt: 0,
      });

    for (
      let experimentIndex = 0;
      experimentIndex < EXPERIMENTS_PER_LAB &&
      totalExperiments <
        EXPERIMENTS_PER_DURATION;
      experimentIndex += 1
    ) {
      const research =
        createResearchRun({
          template,
          durationDays,
          labIndex,
          experimentIndex,
        });

      const resolution =
        resolveResearchDiscovery({
          lab,
          specimen,
          result: research,
          mutations:
            mutationLibrary,
        });

      lab = resolution.lab;

      reasons.push(
        resolution.discovery.reason,
      );

      if (
        resolution.discovery
          .discovery
      ) {
        discoveries.push(
          resolution.discovery
            .discovery,
        );
      }

      totalExperiments += 1;
    }

    totalResearchHours +=
      lab.totalResearchHours;

    labUniqueCounts.push(
      lab.discoveredMutationIds
        .length,
    );

    labLevels.push(
      lab.researchLevel,
    );
  }

  const discoveredMutationIds =
    new Set(
      discoveries.map(
        (discovery) =>
          discovery.mutationId,
      ),
    );

  const onPath =
    discoveries.filter(
      (discovery) =>
        discovery.pathAlignment ===
        "on-path",
    ).length;

  const offPath =
    discoveries.filter(
      (discovery) =>
        discovery.pathAlignment ===
        "off-path",
    ).length;

  const wildcard =
    discoveries.filter(
      (discovery) =>
        discovery.pathAlignment ===
        "wildcard",
    ).length;

  const misses =
    reasons.filter(
      (reason) =>
        reason ===
        "discovery-roll-missed",
    ).length;

  const noEligible =
    reasons.filter(
      (reason) =>
        reason ===
        "no-eligible-mutations",
    ).length;

  const exhausted =
    reasons.filter(
      (reason) =>
        reason ===
        "preferred-pool-exhausted",
    ).length;

  const legendaryCount =
    discoveries.filter(
      (discovery) =>
        discovery.rarity ===
        "Legendary",
    ).length;

  return {
    durationDays,
    experiments:
      totalExperiments,
    labs:
      LABS_PER_DURATION,
    experimentsPerLab:
      EXPERIMENTS_PER_LAB,

    totalResearchHours,

    discoveries:
      discoveries.length,
    discoveryRatePerExperiment:
      percent(
        discoveries.length,
        totalExperiments,
      ),
    discoveriesPer1000ResearchHours:
      totalResearchHours > 0
        ? round(
            discoveries.length /
              totalResearchHours *
              1000,
            3,
          )
        : 0,

    averageUniqueDiscoveriesPerLab:
      round(
        average(
          labUniqueCounts,
        ),
        2,
      ),
    uniqueMutationsAcrossLabs:
      discoveredMutationIds.size,

    pathAlignment: {
      onPath: {
        count: onPath,
        percent:
          percent(
            onPath,
            discoveries.length,
          ),
      },
      offPath: {
        count: offPath,
        percent:
          percent(
            offPath,
            discoveries.length,
          ),
      },
      wildcard: {
        count: wildcard,
        percent:
          percent(
            wildcard,
            discoveries.length,
          ),
      },
    },

    rarityDistribution:
      countWithPercent(
        discoveries.map(
          (discovery) =>
            discovery.rarity,
        ) as MutationRarity[],
      ),

    legendary: {
      count: legendaryCount,
      percentOfDiscoveries:
        percent(
          legendaryCount,
          discoveries.length,
        ),
      per1000Experiments:
        round(
          legendaryCount /
            totalExperiments *
            1000,
          3,
        ),
    },

    familyDistribution:
      countWithPercent(
        discoveries.map(
          (discovery) =>
            discovery.family,
        ) as MutationFamily[],
      ),

    noDiscovery: {
      rollMisses: misses,
      noEligible,
      preferredPoolExhausted:
        exhausted,
      exhaustionRate:
        percent(
          exhausted,
          totalExperiments,
        ),
    },

    averageFinalResearchLevel:
      round(
        average(labLevels),
        2,
      ),


  };
}

console.log(
  "========================================",
);
console.log(
  "SPECIMEN MUTATION DISCOVERY SIMULATION",
);
console.log({
  requestedTotalExperiments:
    TOTAL_EXPERIMENTS,
  experimentsPerDuration:
    EXPERIMENTS_PER_DURATION,
  labsPerDuration:
    LABS_PER_DURATION,
  experimentsPerLab:
    EXPERIMENTS_PER_LAB,
  researchPath: "Defensive",
  secondaryPath: "Structural",
});

for (
  const durationDays
  of DURATIONS
) {
  console.log(
    "\n========================================",
  );
  console.log(
    `${durationDays} DAY DISCOVERY SIMULATION`,
  );
  console.dir(
    runDurationScenario(
      durationDays,
    ),
    { depth: null },
  );
}
