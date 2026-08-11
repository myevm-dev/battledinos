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

export type DinoRarity =
  | "Common"
  | "Uncommon"
  | "Rare"
  | "Epic"
  | "Legendary";

export type BattleStats = {
  health: number;
  attack: number;
  defense: number;
  speed: number;
};

export type BaseMove = {
  slot: 1 | 2 | 3;
  name: string;
  base_power: number;
};

export type StartingState = {
  level: 1;
  xp: 0;
  evolution_stage: 0;
  mutations: [];
};

export type BaseDinoArchetype = {
  base_id: number;
  name: string;
  description: string;
  species: string;
  rarity: DinoRarity;
  element: DinoElement;
  image: string;
  visual: {
    palette: string;
    description: string;
    arena: string;
  };
  base_battle_stats: BattleStats;
  moves: [BaseMove, BaseMove, BaseMove];
  starting_state: StartingState;
  image_prompt: string;
};

// Used later when one archetype is expanded into individual collectibles.
export type EditionGenetics = {
  health: number;
  attack: number;
  defense: number;
  speed: number;
  move_1: number;
  move_2: number;
  move_3: number;
};

export type MutationRecord = {
  id: string;
  name: string;
  family: string;
  acquired_at_level: number;
  evolution_stage: number;
};

export type DinoEdition = {
  token_id: number;
  base_id: number;
  name: string;
  edition: number;
  edition_supply: number;
  finish: "standard" | "holo" | "reverse_holo" | "special";
  image: string;
  genetics: EditionGenetics;
  battle_stats: BattleStats;
  moves: {
    slot: 1 | 2 | 3;
    name: string;
    power: number;
  }[];
  level: number;
  xp: number;
  evolution_stage: number;
  mutations: MutationRecord[];
};
