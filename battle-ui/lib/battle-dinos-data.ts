export type BattleModeId = "duel" | "arena-run";

export type BattleMode = {
  id: BattleModeId;
  eyebrow: string;
  title: string;
  description: string;
  availability: string;
  accent: "teal" | "blue";
};

export type Arena = {
  name: string;
  image: string;
  description: string;
};

export const battleModes: BattleMode[] = [
  {
    id: "duel",
    eyebrow: "Fast matchmaking",
    title: "1v1 Duel",
    description:
      "Lock in one dino and match against another queued fighter. Opponents do not need to be online at the same time.",
    availability: "Queue anytime",
    accent: "teal",
  },
  {
    id: "arena-run",
    eyebrow: "Always available",
    title: "Arena Run",
    description:
      "Enter a three-battle gauntlet against dinos already in the arena pool. Survive all three to finish the run.",
    availability: "No live opponent required",
    accent: "blue",
  },
];

export const arenas: Arena[] = [
  {
    name: "Frostfang Arena",
    image: "/arenas/frostfang-arena.png",
    description: "Frozen ruins beneath towering glacier cliffs.",
  },
  {
    name: "Verdant Maw Arena",
    image: "/arenas/verdant-maw-arena.png",
    description: "Ancient jungle temple reclaimed by waterfalls.",
  },
  {
    name: "Sunscorch Citadel",
    image: "/arenas/sunscorch-citadel.png",
    description: "A brutal red-rock fortress under a burning sky.",
  },
  {
    name: "Stormforge Caldera",
    image: "/arenas/stormforge-caldera.png",
    description: "Volcanic stone, molten rivers, and violent storms.",
  },
  {
    name: "Skyfall Coliseum",
    image: "/arenas/skyfall-coliseum.png",
    description: "A monumental arena suspended among ancient citadels.",
  },
];

export const selectedDino = {
  tokenId: 108,
  name: "Vortexwarden",
  species: "Velociraptor",
  rarity: "Common",
  image: "/dinos/1.png",
  record: "12-7",
  rating: 1247,
  moves: [
    { name: "Riptide Talon", power: 47 },
    { name: "Torrent Leap", power: 78 },
    { name: "Tidal Fakeout", power: 66 },
  ],
};

export const recentBattles = [
  {
    result: "Victory",
    opponent: "Ironmaw #244",
    mode: "1v1 Duel",
    time: "2m ago",
    change: "+18",
  },
  {
    result: "Defeat",
    opponent: "Ashspike #071",
    mode: "Arena Run",
    time: "18m ago",
    change: "-9",
  },
  {
    result: "Victory",
    opponent: "Frostclaw #190",
    mode: "1v1 Duel",
    time: "42m ago",
    change: "+15",
  },
];
