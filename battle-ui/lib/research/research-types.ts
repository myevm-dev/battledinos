// battle-ui/lib/research/research-types.ts

export type ResearchPath =
  | "Structural"
  | "Metabolic"
  | "Neural"
  | "Cross-Species"
  | "Elemental"
  | "Defensive"
  | "Offensive"
  | "Mobility"
  | "Wildcard";

export type MutationFamily = ResearchPath;

export type MutationRarity =
  | "Common"
  | "Uncommon"
  | "Rare"
  | "Epic"
  | "Legendary";

export type ResearchIntensity =
  | "low"
  | "standard"
  | "high";

export type ResearchDurationDays =
  | 3
  | 7
  | 30
  | 90;

export type ResearchMode =
  | "standard"
  | "clone"
  | "archived";

export type EvolutionStage =
  | 0
  | 1
  | 2
  | 3;

export type EvolutionLabel =
  | "GENESIS"
  | "EVO_I"
  | "EVO_II"
  | "EVO_III";

export type MutationSource =
  | "organic"
  | "primary"
  | "secondary"
  | "serum"
  | "anomaly";

export type ResearchStatus =
  | "pending"
  | "active"
  | "complete"
  | "cancelled";

export type StatBlock = {
  health: number;
  attack: number;
  defense: number;
  speed: number;
};

export type MoveState = {
  slot: number;
  name: string;
  power: number;
};

export type SpecimenGenetics = {
  health: number;
  attack: number;
  defense: number;
  speed: number;

  move_1?: number;
  move_2?: number;
  move_3?: number;
};

export type MutationExpression = {
  mutationId: string;

  family: MutationFamily;
  rarity: MutationRarity;

  source: MutationSource;

  compatibility: number;
  expressionStrength: number;
  stability: number;

  acquiredAtLevel?: number;
  acquiredAtStage: EvolutionStage;

  researchId: string;
};

export type SpecimenResearchState = {
  tokenId: number;
  baseId: number;

  name: string;

  edition: number;
  editionSupply: number;

  element: string;
  species?: string;

  level: number;

  xp: {
    lifetime: number;
    spent: number;
    available: number;
  };

  researchLevel?: number;
  researchXp?: number;

  evolutionStage: EvolutionStage;

  genetics: SpecimenGenetics;

  battleStats: StatBlock;

  moves: MoveState[];

  mutations: MutationExpression[];

  currentImage?: string;
};

export type ResearchInput = {
  specimenId: string;

  path: ResearchPath;

  secondaryPath?: ResearchPath;

  serumId?: string;

  intensity: ResearchIntensity;

  durationDays: ResearchDurationDays;

  mode: ResearchMode;
};

export type ResearchRequest = {
  researchId: string;

  specimen: SpecimenResearchState;

  input: ResearchInput;

  seed: string;

  startedAt: number;
};

export type ResearchCompatibility = {
  overall: number;

  familyCompatibility: Partial<
    Record<MutationFamily, number>
  >;

  serumCompatibility?: number;

  stabilityModifier: number;

  notes?: string[];
};

export type ResearchStatChanges = StatBlock;

export type ResearchOutcome = {
  researchId: string;

  seed: string;

  specimenId: string;

  path: ResearchPath;

  secondaryPath?: ResearchPath;

  serumId?: string;

  intensity: ResearchIntensity;

  durationDays: ResearchDurationDays;

  mode: ResearchMode;

  compatibility: ResearchCompatibility;

  mutations: MutationExpression[];

  anomaly?: MutationExpression;

  statChanges: ResearchStatChanges;

  stability: number;

  phenotypeInfluences: string[];

  previousEvolutionStage: EvolutionStage;

  nextEvolutionStage: EvolutionStage;

  startedAt: number;

  completedAt: number;
};

export type ResearchHistoryEntry = {
  researchId: string;

  path: ResearchPath;

  secondaryPath?: ResearchPath;

  serumId?: string;

  intensity: ResearchIntensity;

  durationDays: ResearchDurationDays;

  mode: ResearchMode;

  status: ResearchStatus;

  seed: string;

  startedAt: number;

  completedAt?: number;

  outcome?: ResearchOutcome;
};

export type EvolutionSnapshot = {
  tokenId: number;

  stage: EvolutionStage;

  label: EvolutionLabel;

  createdAt: number;

  image?: string;
  imageCid?: string;

  level: number;

  battleStats: StatBlock;

  moves: MoveState[];

  mutations: MutationExpression[];

  phenotypeInfluences: string[];

  researchId?: string;

  serumId?: string;
};

export type CloneMutationEstimate = {
  mutationId: string;

  family: MutationFamily;

  occurrences: number;

  observedRate: number;

  averageExpressionStrength: number;

  averageStability: number;
};

export type CloneFamilyEstimate = {
  family: MutationFamily;

  occurrences: number;

  observedRate: number;
};

export type CloneResearchResult = {
  cloneResearchId: string;

  specimenId: string;

  simulations: number;

  input: ResearchInput;

  mutationEstimates: CloneMutationEstimate[];

  familyEstimates: CloneFamilyEstimate[];

  averageStatChanges: StatBlock;

  averageStability: number;

  generatedAt: number;

  previewImage?: string;
};

export type ResearchTreeNode = {
  id: string;

  label: string;

  observedRate: number;

  count?: number;

  children?: ResearchTreeNode[];
};