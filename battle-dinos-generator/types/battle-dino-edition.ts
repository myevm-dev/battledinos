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

export type DinoFinish =
  | "standard"
  | "holo"
  | "reverse_holo"
  | "special";

export type EditionGenetics = {
  health: number;
  attack: number;
  defense: number;
  speed: number;
  move_1: number;
  move_2: number;
  move_3: number;
};

export type BattleStats = {
  health: number;
  attack: number;
  defense: number;
  speed: number;
};

export type EditionMove = {
  slot: number;
  name: string;
  power: number;
};

export type XPState = {
  lifetime: number;
  spent: number;
  available: number;
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
  edition_label: string;
  finish: DinoFinish;
  species: string;
  rarity: DinoRarity;
  element: DinoElement;
  image: string;
  genetics: EditionGenetics;
  battle_stats: BattleStats;
  moves: EditionMove[];
  level: number;
  xp: XPState;
  evolution_stage: number;
  mutations: MutationRecord[];
};

export type SupplyManifestEntry = {
  base_id: number;
  name: string;
  species: string;
  rarity: DinoRarity;
  element: DinoElement;
  standard_supply: number;
  image: string;
};
