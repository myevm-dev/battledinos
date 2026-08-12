"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Dices,
  RefreshCw,
  Shuffle,
  Swords,
  Trophy,
} from "lucide-react";

import {
  runBattle,
  type BattleResult,
  type FighterSnapshot,
} from "@/lib/battle-engine";

import { AppNavigation } from "@/components/battle-dinos/nav";

/*
  These are real generated Edition #1 fighter snapshots
  from the Battle Dinos edition supply.

  Images are resolved from:

  /public/dinos/{base_id}.png

  Example:
  Echoguard base_id 1 -> /dinos/1.png
  Vortexwarden base_id 108 -> /dinos/108.png
*/
const TEST_FIGHTERS: FighterSnapshot[] = [
  {
    token_id: 1,
    base_id: 1,
    name: "Echoguard",
    edition: 1,
    edition_supply: 99,
    element: "Primal",

    battle_stats: {
      health: 82,
      attack: 85,
      defense: 70,
      speed: 70,
    },

    moves: [
      {
        slot: 1,
        name: "Primal Chomp",
        power: 80,
      },
      {
        slot: 2,
        name: "Wild Claw",
        power: 47,
      },
      {
        slot: 3,
        name: "Primal Rush",
        power: 67,
      },
    ],
  },

  {
    token_id: 100,
    base_id: 2,
    name: "Jadetooth",
    edition: 1,
    edition_supply: 110,
    element: "Primal",

    battle_stats: {
      health: 87,
      attack: 64,
      defense: 78,
      speed: 68,
    },

    moves: [
      {
        slot: 1,
        name: "Alpha Spike Jab",
        power: 92,
      },
      {
        slot: 2,
        name: "Savage Sprint Strike",
        power: 70,
      },
      {
        slot: 3,
        name: "Alpha Shell",
        power: 88,
      },
    ],
  },

  {
    token_id: 210,
    base_id: 3,
    name: "Runeshard",
    edition: 1,
    edition_supply: 97,
    element: "Venom",

    battle_stats: {
      health: 92,
      attack: 88,
      defense: 78,
      speed: 51,
    },

    moves: [
      {
        slot: 1,
        name: "Acid Bite",
        power: 76,
      },
      {
        slot: 2,
        name: "Acid Bellow",
        power: 52,
      },
      {
        slot: 3,
        name: "Viper Tail Slam",
        power: 53,
      },
    ],
  },

  {
    token_id: 307,
    base_id: 4,
    name: "Ashfang",
    edition: 1,
    edition_supply: 105,
    element: "Void",

    battle_stats: {
      health: 81,
      attack: 79,
      defense: 61,
      speed: 78,
    },

    moves: [
      {
        slot: 1,
        name: "Null Horn Breaker",
        power: 87,
      },
      {
        slot: 2,
        name: "Rift Jaw",
        power: 51,
      },
      {
        slot: 3,
        name: "Abyss Bellow",
        power: 46,
      },
    ],
  },

  {
    token_id: 412,
    base_id: 5,
    name: "Wildscar",
    edition: 1,
    edition_supply: 26,
    element: "Void",

    battle_stats: {
      health: 70,
      attack: 75,
      defense: 49,
      speed: 100,
    },

    moves: [
      {
        slot: 1,
        name: "Null Rake",
        power: 81,
      },
      {
        slot: 2,
        name: "Null Pounce",
        power: 83,
      },
      {
        slot: 3,
        name: "Void Sidestep",
        power: 93,
      },
    ],
  },

  {
    token_id: 438,
    base_id: 6,
    name: "Grimcrest",
    edition: 1,
    edition_supply: 97,
    element: "Venom",

    battle_stats: {
      health: 59,
      attack: 81,
      defense: 57,
      speed: 100,
    },

    moves: [
      {
        slot: 1,
        name: "Toxic Rake",
        power: 65,
      },
      {
        slot: 2,
        name: "Toxic Leap",
        power: 48,
      },
      {
        slot: 3,
        name: "Viper Sidestep",
        power: 51,
      },
    ],
  },

  {
    token_id: 535,
    base_id: 7,
    name: "Coppertail",
    edition: 1,
    edition_supply: 42,
    element: "Stone",

    battle_stats: {
      health: 81,
      attack: 78,
      defense: 61,
      speed: 78,
    },

    moves: [
      {
        slot: 1,
        name: "Granite Talon",
        power: 47,
      },
      {
        slot: 2,
        name: "Boulder Chomp",
        power: 88,
      },
      {
        slot: 3,
        name: "Boulder Snap Lunge",
        power: 76,
      },
    ],
  },

  {
    token_id: 577,
    base_id: 8,
    name: "Ghosttail",
    edition: 1,
    edition_supply: 178,
    element: "Frost",

    battle_stats: {
      health: 75,
      attack: 76,
      defense: 72,
      speed: 77,
    },

    moves: [
      {
        slot: 1,
        name: "Winter Talon",
        power: 73,
      },
      {
        slot: 2,
        name: "Glacier Chomp",
        power: 77,
      },
      {
        slot: 3,
        name: "Winter Lunge",
        power: 77,
      },
    ],
  },

  {
    token_id: 10562,
    base_id: 108,
    name: "Vortexwarden",
    edition: 1,
    edition_supply: 157,
    element: "Tide",

    battle_stats: {
      health: 67,
      attack: 69,
      defense: 56,
      speed: 98,
    },

    moves: [
      {
        slot: 1,
        name: "Riptide Talon",
        power: 46,
      },
      {
        slot: 2,
        name: "Torrent Leap",
        power: 74,
      },
      {
        slot: 3,
        name: "Tidal Fakeout",
        power: 66,
      },
    ],
  },
];

function createSeed() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

function pickRandomFighters(): [
  FighterSnapshot,
  FighterSnapshot,
] {
  const firstIndex = Math.floor(
    Math.random() * TEST_FIGHTERS.length,
  );

  let secondIndex = Math.floor(
    Math.random() * TEST_FIGHTERS.length,
  );

  while (secondIndex === firstIndex) {
    secondIndex = Math.floor(
      Math.random() * TEST_FIGHTERS.length,
    );
  }

  return [
    TEST_FIGHTERS[firstIndex],
    TEST_FIGHTERS[secondIndex],
  ];
}

export default function BattleTestPage() {
  const [fighterA, setFighterA] =
    useState<FighterSnapshot>(TEST_FIGHTERS[0]);

  const [fighterB, setFighterB] =
    useState<FighterSnapshot>(
      TEST_FIGHTERS[TEST_FIGHTERS.length - 1],
    );

  const [result, setResult] =
    useState<BattleResult | null>(null);

  const [seed, setSeed] = useState(
    "battle-dinos-test-1",
  );

  function handleBattle() {
    const battle = runBattle(
      fighterA,
      fighterB,
      seed,
    );

    setResult(battle);
  }

  function handleRandomBattle() {
    const nextSeed = createSeed();

    setSeed(nextSeed);

    const battle = runBattle(
      fighterA,
      fighterB,
      nextSeed,
    );

    setResult(battle);
  }

  function handleRandomCompetitors() {
    const [nextA, nextB] = pickRandomFighters();

    setFighterA(nextA);
    setFighterB(nextB);

    setSeed(createSeed());
    setResult(null);
  }

  return (
    <div className="min-h-screen bg-[#040a10] pb-24 text-white md:pb-10">
      <AppNavigation />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* HEADER */}
        <div className="mb-8">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">
            Developer Test
          </div>

          <h1 className="bd-title mt-2 text-4xl font-black">
            Battle Simulator
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Same fighters + same seed = same battle.
          </p>
        </div>

        {/* RANDOM COMPETITORS */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleRandomCompetitors}
            className="flex items-center gap-2 rounded-xl border border-purple-400/30 bg-purple-500/10 px-5 py-3 text-sm font-black text-purple-200 transition hover:bg-purple-500/20"
          >
            <Shuffle size={18} />
            Random Competitors
          </button>

          <div className="text-xs text-slate-600">
            Testing {TEST_FIGHTERS.length} generated editions
          </div>
        </div>

        {/* MATCHUP */}
        <div className="grid gap-5 md:grid-cols-[1fr_auto_1fr]">
          <DinoCard
            dino={fighterA}
            side="Fighter A"
          />

          <div className="flex items-center justify-center">
            <div className="grid size-14 place-items-center rounded-full border border-amber-400/30 bg-amber-500/10 text-amber-300 shadow-[0_0_30px_rgba(242,165,38,0.12)]">
              <Swords size={26} />
            </div>
          </div>

          <DinoCard
            dino={fighterB}
            side="Fighter B"
          />
        </div>

        {/* BATTLE CONTROLS */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-500">
            Battle Seed
          </label>

          <input
            value={seed}
            onChange={(event) =>
              setSeed(event.target.value)
            }
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm text-slate-200 outline-none transition focus:border-amber-400/40"
          />

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleBattle}
              className="flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-black text-black transition hover:bg-amber-300"
            >
              <Swords size={18} />
              Run Battle
            </button>

            <button
              type="button"
              onClick={handleRandomBattle}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/[0.08]"
            >
              <Dices size={18} />
              Random Seed + Battle
            </button>

            <button
              type="button"
              onClick={handleRandomCompetitors}
              className="flex items-center gap-2 rounded-xl border border-purple-400/20 bg-purple-500/[0.06] px-5 py-3 text-sm font-bold text-purple-200 transition hover:bg-purple-500/15"
            >
              <Shuffle size={18} />
              New Competitors
            </button>

            {result && (
              <button
                type="button"
                onClick={() => setResult(null)}
                className="flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-slate-500 transition hover:text-slate-300"
              >
                <RefreshCw size={17} />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* RESULT */}
        {result && (
          <BattleResultPanel result={result} />
        )}
      </main>
    </div>
  );
}

function DinoCard({
  dino,
  side,
}: {
  dino: FighterSnapshot;
  side: string;
}) {
  const imageSrc = `/dinos/${dino.base_id}.png`;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      {/* DINO ART */}
      <div className="relative aspect-[16/10] overflow-hidden bg-black">
        <Image
          src={imageSrc}
          alt={`${dino.name} #${dino.edition}/${dino.edition_supply}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 45vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#080d13] via-[#080d13]/10 to-transparent" />

        {/* SIDE BADGE */}
        <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-slate-300 backdrop-blur">
          {side}
        </div>

        {/* TOKEN ID */}
        <div className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/60 px-3 py-1 font-mono text-[10px] text-slate-400 backdrop-blur">
          Token #{dino.token_id}
        </div>

        {/* NAME */}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="text-xs font-black uppercase tracking-[0.15em] text-amber-400">
            {dino.element}
          </div>

          <h2 className="mt-1 text-3xl font-black text-white">
            {dino.name}
          </h2>

          <div className="mt-1 flex items-center gap-2 text-sm text-slate-300">
            <span>
              #{dino.edition}/{dino.edition_supply}
            </span>

            <span className="text-slate-600">
              •
            </span>

            <span className="text-slate-500">
              Base #{dino.base_id}
            </span>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="p-5">
        <div className="grid grid-cols-2 gap-2">
          <Stat
            label="Health"
            value={dino.battle_stats.health}
          />

          <Stat
            label="Attack"
            value={dino.battle_stats.attack}
          />

          <Stat
            label="Defense"
            value={dino.battle_stats.defense}
          />

          <Stat
            label="Speed"
            value={dino.battle_stats.speed}
          />
        </div>

        {/* MOVES */}
        <div className="mt-5 space-y-2">
          {dino.moves.map((move) => (
            <div
              key={move.slot}
              className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-black/20 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-6 place-items-center rounded-md bg-white/[0.04] text-[10px] font-black text-slate-600">
                  {move.slot}
                </span>

                <span className="text-sm font-bold text-slate-300">
                  {move.name}
                </span>
              </div>

              <div className="text-right">
                <div className="text-[9px] font-black uppercase tracking-wider text-slate-600">
                  Power
                </div>

                <div className="font-black text-amber-300">
                  {move.power}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl bg-black/20 p-3">
      <div className="text-[10px] font-black uppercase tracking-wider text-slate-600">
        {label}
      </div>

      <div className="mt-1 text-xl font-black text-white">
        {value}
      </div>
    </div>
  );
}

function BattleResultPanel({
  result,
}: {
  result: BattleResult;
}) {
  return (
    <div className="mt-6 space-y-5">
      {/* WINNER */}
      <div className="rounded-2xl border border-amber-400/20 bg-amber-500/[0.06] p-6 text-center shadow-[0_0_40px_rgba(242,165,38,0.05)]">
        <Trophy
          size={34}
          className="mx-auto text-amber-300"
        />

        <div className="mt-3 text-xs font-black uppercase tracking-[0.2em] text-amber-400">
          Winner
        </div>

        <div className="bd-title mt-1 text-4xl font-black">
          {result.winner}
        </div>

        <div className="mt-2 text-sm capitalize text-slate-400">
          {result.battle_intensity} Battle
        </div>

        <div className="mt-1 text-xs text-slate-600">
          Margin {result.margin_percent}%
        </div>
      </div>

      {/* SCORE BREAKDOWN */}
      <div className="grid gap-4 md:grid-cols-2">
        <ScoreCard
          name={result.fighter_a.name}
          edition={result.fighter_a.edition}
          baseScore={result.fighter_a.base_score}
          elementModifier={
            result.fighter_a.element_modifier
          }
          randomModifier={
            result.fighter_a.random_modifier
          }
          finalScore={
            result.fighter_a.final_score
          }
        />

        <ScoreCard
          name={result.fighter_b.name}
          edition={result.fighter_b.edition}
          baseScore={result.fighter_b.base_score}
          elementModifier={
            result.fighter_b.element_modifier
          }
          randomModifier={
            result.fighter_b.random_modifier
          }
          finalScore={
            result.fighter_b.final_score
          }
        />
      </div>

      {/* BATTLE LOG */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-lg font-black">
          Battle Log
        </h2>

        <div className="mt-4 space-y-2">
          {result.sequence.map(
            (event, index) => (
              <div
                key={`${event.attacker_token_id}-${index}`}
                className="flex flex-wrap items-center gap-2 rounded-xl border border-white/[0.06] bg-black/20 px-4 py-3"
              >
                <span className="grid size-7 place-items-center rounded-lg bg-white/[0.05] text-xs font-black text-slate-500">
                  {index + 1}
                </span>

                <span className="font-black text-white">
                  {event.attacker}
                </span>

                <span className="text-slate-600">
                  used
                </span>

                <span className="font-bold text-amber-300">
                  {event.move}
                </span>

                <span
                  className={`ml-auto rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                    event.result ===
                    "finisher"
                      ? "bg-amber-500/15 text-amber-300"
                      : event.result ===
                          "critical"
                        ? "bg-purple-500/15 text-purple-300"
                        : event.result ===
                            "miss"
                          ? "bg-slate-500/10 text-slate-500"
                          : "bg-lime-500/10 text-lime-300"
                  }`}
                >
                  {event.result}
                </span>
              </div>
            ),
          )}
        </div>
      </div>

      {/* SEED */}
      <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4">
        <div className="text-[10px] font-black uppercase tracking-wider text-slate-600">
          Seed
        </div>

        <div className="mt-1 break-all font-mono text-xs text-slate-400">
          {result.seed}
        </div>
      </div>
    </div>
  );
}

function ScoreCard({
  name,
  edition,
  baseScore,
  elementModifier,
  randomModifier,
  finalScore,
}: {
  name: string;
  edition: string;
  baseScore: number;
  elementModifier: number;
  randomModifier: number;
  finalScore: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-black">
            {name}
          </div>

          <div className="text-xs text-slate-600">
            #{edition}
          </div>
        </div>

        <div className="text-3xl font-black text-amber-300">
          {finalScore}
        </div>
      </div>

      <div className="mt-4 space-y-2 text-xs">
        <ScoreLine
          label="Base score"
          value={baseScore}
        />

        <ScoreLine
          label="Element"
          value={`× ${elementModifier}`}
        />

        <ScoreLine
          label="Battle luck"
          value={`× ${randomModifier}`}
        />

        <ScoreLine
          label="Final score"
          value={finalScore}
          strong
        />
      </div>
    </div>
  );
}

function ScoreLine({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string | number;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-600">
        {label}
      </span>

      <span
        className={
          strong
            ? "font-black text-amber-300"
            : "font-mono text-slate-400"
        }
      >
        {value}
      </span>
    </div>
  );
}