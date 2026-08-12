export type DinoElement =
  | "Ember"
  | "Frost"
  | "Storm"
  | "Stone"
  | "Venom"
  | "Shadow"
  | "Primal"
  | "Solar"
  | "Tide"
  | "Void";

export type BattleMove = {
  slot: number;
  name: string;
  power: number;
};

export type FighterSnapshot = {
  token_id: number;
  base_id: number;
  name: string;
  edition: number;
  edition_supply: number;
  element: DinoElement;

  battle_stats: {
    health: number;
    attack: number;
    defense: number;
    speed: number;
  };

  moves: BattleMove[];
};

export type BattleIntensity =
  | "close"
  | "clear"
  | "dominant"
  | "overwhelming";

export type BattleEventResult =
  | "hit"
  | "miss"
  | "critical"
  | "finisher";

export type BattleEvent = {
  attacker_token_id: number;
  attacker: string;
  move: string;
  result: BattleEventResult;
};

export type BattleResult = {
  seed: string;

  fighter_a: {
    token_id: number;
    name: string;
    edition: string;
    element: DinoElement;
    base_score: number;
    element_modifier: number;
    random_modifier: number;
    final_score: number;
  };

  fighter_b: {
    token_id: number;
    name: string;
    edition: string;
    element: DinoElement;
    base_score: number;
    element_modifier: number;
    random_modifier: number;
    final_score: number;
  };

  winner_token_id: number;
  winner: string;

  loser_token_id: number;
  loser: string;

  battle_intensity: BattleIntensity;

  margin_percent: number;

  sequence: BattleEvent[];
};

/*
  Temporary balanced element ring.

  Every element is:
  - strong against 1 element
  - weak against 1 element
  - neutral against the other 8

  We can rebalance this later.
*/
const ELEMENT_BEATS: Record<DinoElement, DinoElement> = {
  Ember: "Frost",
  Frost: "Tide",
  Tide: "Stone",
  Stone: "Storm",
  Storm: "Solar",
  Solar: "Shadow",
  Shadow: "Primal",
  Primal: "Venom",
  Venom: "Void",
  Void: "Ember",
};

const STRONG_ELEMENT_MODIFIER = 1.07;
const WEAK_ELEMENT_MODIFIER = 0.93;
const NEUTRAL_ELEMENT_MODIFIER = 1.0;

/*
  Convert a string into a deterministic integer seed.
*/
function hashString(value: string): number {
  let hash = 2166136261;

  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

/*
  Deterministic pseudo-random generator.

  Same seed = same sequence of random numbers.
*/
function createRandom(seed: string) {
  let state = hashString(seed);

  return function random() {
    state += 0x6d2b79f5;

    let t = state;

    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function round(value: number, decimals = 2) {
  const factor = 10 ** decimals;

  return Math.round(value * factor) / factor;
}

export function calculateBattleScore(fighter: FighterSnapshot) {
  const { health, attack, defense, speed } = fighter.battle_stats;

  const averageMovePower =
    fighter.moves.reduce((sum, move) => sum + move.power, 0) /
    fighter.moves.length;

  const score =
    health * 0.25 +
    attack * 0.3 +
    defense * 0.2 +
    speed * 0.15 +
    averageMovePower * 0.1;

  return round(score);
}

export function getElementModifier(
  attacker: DinoElement,
  defender: DinoElement,
) {
  if (ELEMENT_BEATS[attacker] === defender) {
    return STRONG_ELEMENT_MODIFIER;
  }

  if (ELEMENT_BEATS[defender] === attacker) {
    return WEAK_ELEMENT_MODIFIER;
  }

  return NEUTRAL_ELEMENT_MODIFIER;
}

/*
  Battle luck ranges from:

  0.90 → 1.10
*/
function getRandomModifier(random: () => number) {
  return round(0.9 + random() * 0.2, 4);
}

/*
  Higher-power moves are more likely to be selected.
*/
function chooseWeightedMove(
  fighter: FighterSnapshot,
  random: () => number,
): BattleMove {
  const totalPower = fighter.moves.reduce(
    (sum, move) => sum + move.power,
    0,
  );

  let roll = random() * totalPower;

  for (const move of fighter.moves) {
    roll -= move.power;

    if (roll <= 0) {
      return move;
    }
  }

  return fighter.moves[fighter.moves.length - 1];
}

function getBattleIntensity(
  winnerScore: number,
  loserScore: number,
): {
  intensity: BattleIntensity;
  marginPercent: number;
} {
  const marginPercent =
    loserScore <= 0
      ? 100
      : ((winnerScore - loserScore) / loserScore) * 100;

  if (marginPercent <= 5) {
    return {
      intensity: "close",
      marginPercent: round(marginPercent),
    };
  }

  if (marginPercent <= 15) {
    return {
      intensity: "clear",
      marginPercent: round(marginPercent),
    };
  }

  if (marginPercent <= 25) {
    return {
      intensity: "dominant",
      marginPercent: round(marginPercent),
    };
  }

  return {
    intensity: "overwhelming",
    marginPercent: round(marginPercent),
  };
}

function createEvent(
  fighter: FighterSnapshot,
  result: BattleEventResult,
  random: () => number,
): BattleEvent {
  const move = chooseWeightedMove(fighter, random);

  return {
    attacker_token_id: fighter.token_id,
    attacker: fighter.name,
    move: move.name,
    result,
  };
}

function generateBattleSequence(
  winner: FighterSnapshot,
  loser: FighterSnapshot,
  intensity: BattleIntensity,
  random: () => number,
): BattleEvent[] {
  /*
    Winner is already locked before this runs.

    This sequence only describes HOW the battle looked.
  */

  switch (intensity) {
    case "close":
      return [
        createEvent(loser, "hit", random),
        createEvent(winner, "hit", random),
        createEvent(loser, "hit", random),
        createEvent(winner, "critical", random),
        createEvent(winner, "finisher", random),
      ];

    case "clear":
      return [
        createEvent(winner, "hit", random),
        createEvent(loser, "hit", random),
        createEvent(winner, "hit", random),
        createEvent(loser, "miss", random),
        createEvent(winner, "finisher", random),
      ];

    case "dominant":
      return [
        createEvent(winner, "hit", random),
        createEvent(loser, "miss", random),
        createEvent(winner, "critical", random),
        createEvent(loser, "miss", random),
        createEvent(winner, "finisher", random),
      ];

    case "overwhelming":
      return [
        createEvent(winner, "critical", random),
        createEvent(loser, "miss", random),
        createEvent(winner, "hit", random),
        createEvent(winner, "finisher", random),
      ];
  }
}

export function runBattle(
  fighterA: FighterSnapshot,
  fighterB: FighterSnapshot,
  seed: string,
): BattleResult {
  if (fighterA.token_id === fighterB.token_id) {
    throw new Error("A dinosaur cannot battle itself.");
  }

  if (fighterA.moves.length !== 3 || fighterB.moves.length !== 3) {
    throw new Error("Each fighter must have exactly 3 moves.");
  }

  const random = createRandom(seed);

  /*
    STEP 1
    Calculate current fighter scores.
  */
  const baseScoreA = calculateBattleScore(fighterA);
  const baseScoreB = calculateBattleScore(fighterB);

  /*
    STEP 2
    Element matchup.
  */
  const elementModifierA = getElementModifier(
    fighterA.element,
    fighterB.element,
  );

  const elementModifierB = getElementModifier(
    fighterB.element,
    fighterA.element,
  );

  /*
    STEP 3
    Seeded battle luck.
  */
  const randomModifierA = getRandomModifier(random);
  const randomModifierB = getRandomModifier(random);

  /*
    STEP 4
    Final battle scores.
  */
  const finalScoreA = round(
    baseScoreA * elementModifierA * randomModifierA,
  );

  const finalScoreB = round(
    baseScoreB * elementModifierB * randomModifierB,
  );

  /*
    STEP 5
    Determine winner.

    Extremely unlikely exact ties are broken by another
    deterministic roll from the same seed.
  */
  let winner: FighterSnapshot;
  let loser: FighterSnapshot;
  let winnerScore: number;
  let loserScore: number;

  if (finalScoreA === finalScoreB) {
    if (random() >= 0.5) {
      winner = fighterA;
      loser = fighterB;
      winnerScore = finalScoreA;
      loserScore = finalScoreB;
    } else {
      winner = fighterB;
      loser = fighterA;
      winnerScore = finalScoreB;
      loserScore = finalScoreA;
    }
  } else if (finalScoreA > finalScoreB) {
    winner = fighterA;
    loser = fighterB;
    winnerScore = finalScoreA;
    loserScore = finalScoreB;
  } else {
    winner = fighterB;
    loser = fighterA;
    winnerScore = finalScoreB;
    loserScore = finalScoreA;
  }

  /*
    STEP 6
    Determine how close the battle was.
  */
  const { intensity, marginPercent } = getBattleIntensity(
    winnerScore,
    loserScore,
  );

  /*
    STEP 7
    Build the canonical battle sequence.
  */
  const sequence = generateBattleSequence(
    winner,
    loser,
    intensity,
    random,
  );

  return {
    seed,

    fighter_a: {
      token_id: fighterA.token_id,
      name: fighterA.name,
      edition: `${fighterA.edition}/${fighterA.edition_supply}`,
      element: fighterA.element,
      base_score: baseScoreA,
      element_modifier: elementModifierA,
      random_modifier: randomModifierA,
      final_score: finalScoreA,
    },

    fighter_b: {
      token_id: fighterB.token_id,
      name: fighterB.name,
      edition: `${fighterB.edition}/${fighterB.edition_supply}`,
      element: fighterB.element,
      base_score: baseScoreB,
      element_modifier: elementModifierB,
      random_modifier: randomModifierB,
      final_score: finalScoreB,
    },

    winner_token_id: winner.token_id,
    winner: winner.name,

    loser_token_id: loser.token_id,
    loser: loser.name,

    battle_intensity: intensity,

    margin_percent: marginPercent,

    sequence,
  };
}