// battle-ui/scripts/simulate-battle-public.ts
//
// SPECIMEN public battle benchmark.
//
// Run from battle-ui:
//
// npx tsx scripts/simulate-battle-public.ts \
//   > public/battle/simulations/battle-benchmark-v1.txt
//
// This benchmark mirrors the currently documented canonical V1 trial rules:
// - Health 25%
// - Attack 30%
// - Defense 20%
// - Speed 15%
// - Average move power 10%
// - Element modifiers 1.03 / 1.00 / 0.97
// - Seeded performance multiplier from 0.90 through 1.10
// - Trial intensity based on final score gap
//
// It intentionally uses generic benchmark specimens and prints aggregate
// statistics only. No production seeds, wallets, token IDs, mutations,
// hidden specimen data, or unreleased content are emitted.
//
// IMPORTANT:
// This is a public RULE benchmark. When battle orchestration exports a stable
// production trial resolver, this script should be switched to call that
// resolver directly while preserving the same report format.

type BattleStats = {
  health: number;
  attack: number;
  defense: number;
  speed: number;
};

type Move = {
  slot: 1 | 2 | 3;
  power: number;
};

type Fighter = {
  label: string;
  stats: BattleStats;
  moves: [Move, Move, Move];
};

type ElementState =
  | "advantaged"
  | "neutral"
  | "disadvantaged";

type TrialIntensity =
  | "close"
  | "clear"
  | "dominant"
  | "overwhelming";

type TrialResult = {
  winner: "A" | "B" | "tie";
  scoreA: number;
  scoreB: number;
  baseScoreA: number;
  baseScoreB: number;
  elementMultiplierA: number;
  elementMultiplierB: number;
  performanceMultiplierA: number;
  performanceMultiplierB: number;
  gapPercent: number;
  intensity: TrialIntensity;
};

const TRIALS_PER_SCENARIO = 100_000;
const RANDOMNESS_SAMPLES = 100_000;
const MOVE_SELECTION_SAMPLES = 100_000;
const DETERMINISM_SAMPLES = 10_000;

const SCORE_WEIGHTS = {
  health: 0.25,
  attack: 0.30,
  defense: 0.20,
  speed: 0.15,
  averageMovePower: 0.10,
} as const;

const ELEMENT_MULTIPLIERS = {
  advantaged: 1.03,
  neutral: 1.00,
  disadvantaged: 0.97,
} as const satisfies Record<ElementState, number>;

const PERFORMANCE_MIN = 0.90;
const PERFORMANCE_MAX = 1.10;

const benchmarkFighter: Fighter = {
  label: "Benchmark Specimen",
  stats: {
    health: 82,
    attack: 79,
    defense: 73,
    speed: 73,
  },
  moves: [
    { slot: 1, power: 82 },
    { slot: 2, power: 44 },
    { slot: 3, power: 64 },
  ],
};

function round(
  value: number,
  digits = 4,
) {
  return Number(
    value.toFixed(digits),
  );
}

/* -------------------------------------------------------------------------- */
/*                         DETERMINISTIC RANDOMNESS                           */
/* -------------------------------------------------------------------------- */

function hashSeed(
  value: string,
) {
  let hash = 2166136261;

  for (
    let index = 0;
    index < value.length;
    index += 1
  ) {
    hash ^= value.charCodeAt(index);

    hash = Math.imul(
      hash,
      16777619,
    );
  }

  return hash >>> 0;
}

function deriveSeed(
  seed: string,
  ...parts: Array<
    string | number
  >
) {
  return [
    seed,
    ...parts.map(String),
  ].join("::");
}

function mulberry32(
  seed: number,
) {
  let state = seed >>> 0;

  return function next() {
    state += 0x6d2b79f5;

    let value = state;

    value = Math.imul(
      value ^ (value >>> 15),
      value | 1,
    );

    value ^=
      value +
      Math.imul(
        value ^ (value >>> 7),
        value | 61,
      );

    return (
      (
        value ^
        (value >>> 14)
      ) >>> 0
    ) / 4294967296;
  };
}

function seededUnit(
  seed: string,
) {
  return mulberry32(
    hashSeed(seed),
  )();
}

function seededFloat(
  seed: string,
  min: number,
  max: number,
) {
  return (
    min +
    seededUnit(seed) *
      (max - min)
  );
}

/* -------------------------------------------------------------------------- */
/*                               TRIAL SCORE                                  */
/* -------------------------------------------------------------------------- */

function averageMovePower(
  fighter: Fighter,
) {
  return (
    fighter.moves.reduce(
      (sum, move) =>
        sum + move.power,
      0,
    ) /
    fighter.moves.length
  );
}

function calculateBaseScore(
  fighter: Fighter,
) {
  const moves =
    averageMovePower(
      fighter,
    );

  return (
    fighter.stats.health *
      SCORE_WEIGHTS.health +
    fighter.stats.attack *
      SCORE_WEIGHTS.attack +
    fighter.stats.defense *
      SCORE_WEIGHTS.defense +
    fighter.stats.speed *
      SCORE_WEIGHTS.speed +
    moves *
      SCORE_WEIGHTS
        .averageMovePower
  );
}

function performanceMultiplier(
  seed: string,
) {
  return seededFloat(
    seed,
    PERFORMANCE_MIN,
    PERFORMANCE_MAX,
  );
}

function classifyIntensity(
  gapPercent: number,
): TrialIntensity {
  if (gapPercent < 5) {
    return "close";
  }

  if (gapPercent < 15) {
    return "clear";
  }

  if (gapPercent < 25) {
    return "dominant";
  }

  return "overwhelming";
}

function resolveTrial({
  seed,
  fighterA,
  fighterB,
  elementA,
  elementB,
}: {
  seed: string;
  fighterA: Fighter;
  fighterB: Fighter;
  elementA: ElementState;
  elementB: ElementState;
}): TrialResult {
  const baseScoreA =
    calculateBaseScore(
      fighterA,
    );

  const baseScoreB =
    calculateBaseScore(
      fighterB,
    );

  const elementMultiplierA =
    ELEMENT_MULTIPLIERS[
      elementA
    ];

  const elementMultiplierB =
    ELEMENT_MULTIPLIERS[
      elementB
    ];

  const performanceMultiplierA =
    performanceMultiplier(
      deriveSeed(
        seed,
        "specimen-a-performance",
      ),
    );

  const performanceMultiplierB =
    performanceMultiplier(
      deriveSeed(
        seed,
        "specimen-b-performance",
      ),
    );

  const scoreA =
    baseScoreA *
    elementMultiplierA *
    performanceMultiplierA;

  const scoreB =
    baseScoreB *
    elementMultiplierB *
    performanceMultiplierB;

  let winner:
    | "A"
    | "B"
    | "tie";

  if (scoreA > scoreB) {
    winner = "A";
  } else if (scoreB > scoreA) {
    winner = "B";
  } else {
    winner = "tie";
  }

  const winnerScore =
    Math.max(
      scoreA,
      scoreB,
    );

  const loserScore =
    Math.min(
      scoreA,
      scoreB,
    );

  const gapPercent =
    loserScore === 0
      ? 0
      : (
          (
            winnerScore -
            loserScore
          ) /
          loserScore
        ) * 100;

  return {
    winner,
    scoreA,
    scoreB,
    baseScoreA,
    baseScoreB,
    elementMultiplierA,
    elementMultiplierB,
    performanceMultiplierA,
    performanceMultiplierB,
    gapPercent,
    intensity:
      classifyIntensity(
        gapPercent,
      ),
  };
}

/* -------------------------------------------------------------------------- */
/*                              STAT HELPERS                                  */
/* -------------------------------------------------------------------------- */

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
    return (
      sorted[lower] ?? 0
    );
  }

  const lowerValue =
    sorted[lower] ?? 0;

  const upperValue =
    sorted[upper] ??
    lowerValue;

  return (
    lowerValue +
    (
      upperValue -
      lowerValue
    ) *
      (position - lower)
  );
}

/* -------------------------------------------------------------------------- */
/*                           SCENARIO BENCHMARK                               */
/* -------------------------------------------------------------------------- */

function runScenario({
  id,
  elementA,
  elementB,
}: {
  id: string;
  elementA: ElementState;
  elementB: ElementState;
}) {
  let aWins = 0;
  let bWins = 0;
  let ties = 0;

  const intensityCounts:
    Record<
      TrialIntensity,
      number
    > = {
      close: 0,
      clear: 0,
      dominant: 0,
      overwhelming: 0,
    };

  const gaps:
    number[] = [];

  for (
    let index = 0;
    index <
    TRIALS_PER_SCENARIO;
    index += 1
  ) {
    const result =
      resolveTrial({
        seed:
          `public-battle-v1:${id}:${index}`,

        fighterA:
          benchmarkFighter,

        fighterB:
          benchmarkFighter,

        elementA,
        elementB,
      });

    if (
      result.winner === "A"
    ) {
      aWins += 1;
    } else if (
      result.winner === "B"
    ) {
      bWins += 1;
    } else {
      ties += 1;
    }

    intensityCounts[
      result.intensity
    ] += 1;

    gaps.push(
      result.gapPercent,
    );
  }

  const asPercent =
    (count: number) =>
      round(
        (
          count /
          TRIALS_PER_SCENARIO
        ) * 100,
        2,
      );

  return {
    id,

    trials:
      TRIALS_PER_SCENARIO,

    elementState: {
      specimenA:
        elementA,

      specimenB:
        elementB,

      multiplierA:
        ELEMENT_MULTIPLIERS[
          elementA
        ],

      multiplierB:
        ELEMENT_MULTIPLIERS[
          elementB
        ],
    },

    winDistribution: {
      specimenA: {
        count: aWins,
        percent:
          asPercent(aWins),
      },

      specimenB: {
        count: bWins,
        percent:
          asPercent(bWins),
      },

      ties: {
        count: ties,
        percent:
          asPercent(ties),
      },
    },

    intensityDistribution:
      Object.fromEntries(
        (
          Object.entries(
            intensityCounts,
          ) as Array<
            [
              TrialIntensity,
              number,
            ]
          >
        ).map(
          ([key, count]) => [
            key,
            {
              count,
              percent:
                asPercent(
                  count,
                ),
            },
          ],
        ),
      ),

    scoreGap: {
      averagePercent:
        round(
          average(gaps),
          3,
        ),

      p50:
        round(
          quantile(
            gaps,
            0.50,
          ),
          3,
        ),

      p90:
        round(
          quantile(
            gaps,
            0.90,
          ),
          3,
        ),

      p99:
        round(
          quantile(
            gaps,
            0.99,
          ),
          3,
        ),
    },
  };
}

/* -------------------------------------------------------------------------- */
/*                         RANDOMNESS BENCHMARK                               */
/* -------------------------------------------------------------------------- */

function runRandomnessBenchmark() {
  const values:
    number[] = [];

  for (
    let index = 0;
    index <
    RANDOMNESS_SAMPLES;
    index += 1
  ) {
    values.push(
      performanceMultiplier(
        `public-randomness-v1:${index}`,
      ),
    );
  }

  return {
    samples:
      RANDOMNESS_SAMPLES,

    configuredRange: {
      min:
        PERFORMANCE_MIN,
      max:
        PERFORMANCE_MAX,
    },

    observed: {
      min:
        round(
          Math.min(
            ...values,
          ),
          6,
        ),

      max:
        round(
          Math.max(
            ...values,
          ),
          6,
        ),

      average:
        round(
          average(values),
          6,
        ),

      p10:
        round(
          quantile(
            values,
            0.10,
          ),
          6,
        ),

      p50:
        round(
          quantile(
            values,
            0.50,
          ),
          6,
        ),

      p90:
        round(
          quantile(
            values,
            0.90,
          ),
          6,
        ),
    },
  };
}

/* -------------------------------------------------------------------------- */
/*                           MOVE SELECTION TEST                              */
/* -------------------------------------------------------------------------- */

function weightedMoveSelection(
  seed: string,
  fighter: Fighter,
) {
  const total =
    fighter.moves.reduce(
      (sum, move) =>
        sum + move.power,
      0,
    );

  const target =
    seededUnit(seed) *
    total;

  let cursor = 0;

  for (
    const move
    of fighter.moves
  ) {
    cursor +=
      move.power;

    if (target < cursor) {
      return move.slot;
    }
  }

  return fighter.moves[
    fighter.moves.length - 1
  ].slot;
}

function runMoveSelectionBenchmark() {
  const counts: Record<
    1 | 2 | 3,
    number
  > = {
    1: 0,
    2: 0,
    3: 0,
  };

  const totalWeight =
    benchmarkFighter.moves.reduce(
      (sum, move) =>
        sum + move.power,
      0,
    );

  for (
    let index = 0;
    index <
    MOVE_SELECTION_SAMPLES;
    index += 1
  ) {
    const slot =
      weightedMoveSelection(
        `public-move-v1:${index}`,
        benchmarkFighter,
      );

    counts[slot] += 1;
  }

  return {
    samples:
      MOVE_SELECTION_SAMPLES,

    moveWeights:
      benchmarkFighter.moves.map(
        (move) => ({
          slot:
            move.slot,

          weight:
            move.power,

          expectedPercent:
            round(
              (
                move.power /
                totalWeight
              ) * 100,
              2,
            ),

          observedPercent:
            round(
              (
                counts[
                  move.slot
                ] /
                MOVE_SELECTION_SAMPLES
              ) * 100,
              2,
            ),
        }),
      ),
  };
}

/* -------------------------------------------------------------------------- */
/*                            DETERMINISM TEST                                */
/* -------------------------------------------------------------------------- */

function stableComparable(
  result: TrialResult,
) {
  return JSON.stringify({
    winner:
      result.winner,

    scoreA:
      result.scoreA,

    scoreB:
      result.scoreB,

    performanceMultiplierA:
      result
        .performanceMultiplierA,

    performanceMultiplierB:
      result
        .performanceMultiplierB,

    gapPercent:
      result.gapPercent,

    intensity:
      result.intensity,
  });
}

function runDeterminismBenchmark() {
  let mismatches = 0;

  for (
    let index = 0;
    index <
    DETERMINISM_SAMPLES;
    index += 1
  ) {
    const seed =
      `public-determinism-v1:${index}`;

    const first =
      resolveTrial({
        seed,
        fighterA:
          benchmarkFighter,
        fighterB:
          benchmarkFighter,
        elementA:
          "neutral",
        elementB:
          "neutral",
      });

    const second =
      resolveTrial({
        seed,
        fighterA:
          benchmarkFighter,
        fighterB:
          benchmarkFighter,
        elementA:
          "neutral",
        elementB:
          "neutral",
      });

    if (
      stableComparable(first) !==
      stableComparable(second)
    ) {
      mismatches += 1;
    }
  }

  return {
    repeatedTrials:
      DETERMINISM_SAMPLES,

    mismatches,

    reproducibilityPercent:
      round(
        (
          (
            DETERMINISM_SAMPLES -
            mismatches
          ) /
          DETERMINISM_SAMPLES
        ) * 100,
        4,
      ),
  };
}

/* -------------------------------------------------------------------------- */
/*                                 OUTPUT                                     */
/* -------------------------------------------------------------------------- */

const baseScore =
  calculateBaseScore(
    benchmarkFighter,
  );

const scenarios = [
  runScenario({
    id: "equal-neutral",
    elementA:
      "neutral",
    elementB:
      "neutral",
  }),

  runScenario({
    id:
      "equal-a-advantaged",
    elementA:
      "advantaged",
    elementB:
      "disadvantaged",
  }),

  runScenario({
    id:
      "equal-a-disadvantaged",
    elementA:
      "disadvantaged",
    elementB:
      "advantaged",
  }),
];

const randomness =
  runRandomnessBenchmark();

const moveSelection =
  runMoveSelectionBenchmark();

const determinism =
  runDeterminismBenchmark();

console.log(
  "========================================",
);

console.log(
  "SPECIMEN PUBLIC BATTLE BENCHMARK V1",
);

console.log(
  JSON.stringify(
    {
      benchmarkType:
        "canonical published-rule reference",

      totalScenarioTrials:
        TRIALS_PER_SCENARIO *
        scenarios.length,

      trialsPerScenario:
        TRIALS_PER_SCENARIO,

      randomnessSamples:
        RANDOMNESS_SAMPLES,

      moveSelectionSamples:
        MOVE_SELECTION_SAMPLES,

      determinismSamples:
        DETERMINISM_SAMPLES,

      scoreWeights:
        SCORE_WEIGHTS,

      elementMultipliers:
        ELEMENT_MULTIPLIERS,

      performanceRange: {
        min:
          PERFORMANCE_MIN,
        max:
          PERFORMANCE_MAX,
      },

      intensityThresholds: {
        close:
          "0% <= gap < 5%",

        clear:
          "5% <= gap < 15%",

        dominant:
          "15% <= gap < 25%",

        overwhelming:
          "gap >= 25%",
      },

      benchmarkFighter: {
        stats:
          benchmarkFighter.stats,

        movePowers:
          benchmarkFighter
            .moves.map(
              (move) =>
                move.power,
            ),

        baseScore:
          round(
            baseScore,
            4,
          ),
      },

      publicSafety:
        "aggregate benchmark data only",
    },
    null,
    2,
  ),
);

console.log(
  "\n========================================",
);

console.log(
  "DETERMINISM",
);

console.log(
  JSON.stringify(
    determinism,
    null,
    2,
  ),
);

console.log(
  "\n========================================",
);

console.log(
  "PERFORMANCE RANDOMNESS",
);

console.log(
  JSON.stringify(
    randomness,
    null,
    2,
  ),
);

console.log(
  "\n========================================",
);

console.log(
  "WEIGHTED MOVE SELECTION",
);

console.log(
  JSON.stringify(
    moveSelection,
    null,
    2,
  ),
);

for (
  const scenario
  of scenarios
) {
  console.log(
    "\n========================================",
  );

  console.log(
    scenario.id
      .toUpperCase()
      .replaceAll("-", " "),
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
  "INTERPRETATION",
);

console.log(
  [
    "Identical neutral specimens should approach a 50 / 50 win distribution across a large seed set.",
    "Same snapshots plus the same seed must reproduce the same canonical result.",
    "Performance randomness is configured from 0.90 through 1.10 and should center near 1.00.",
    "Element modifiers should produce a measurable strategic advantage without changing the underlying specimen metadata.",
    "Trial intensity is derived from the final score gap and controls replay direction after the winner is already locked.",
    "This public V1 script mirrors the documented battle rules. Once the production trial resolver has a stable exported interface, benchmark that resolver directly using this same report format.",
  ].join("\n"),
);
