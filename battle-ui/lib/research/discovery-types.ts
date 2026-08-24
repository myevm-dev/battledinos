// battle-ui/lib/research/discovery-types.ts

import type {
  MutationFamily,
  MutationRarity,
  ResearchDurationDays,
  ResearchIntensity,
  ResearchPath,
} from "./research-types";

/* -------------------------------------------------------------------------- */
/*                               MUTATION POOL                                */
/* -------------------------------------------------------------------------- */

/**
 * Minimal mutation shape required by the discovery layer.
 *
 * OutcomeMutation from research-outcomes.ts is structurally compatible with
 * this type, so the existing 600-mutation library can be passed directly into
 * discovery functions without duplicating the content library.
 */
export type DiscoveryMutation = {
  id: string;
  name: string;
  family: MutationFamily;
  rarity: MutationRarity;
  tags?: string[];

  /**
   * Optional per-mutation discovery overrides.
   *
   * Most of the 600 launch mutations should use the global rarity defaults.
   * Only special mutations need custom discovery tuning.
   */
  discovery?: {
    baseHours?: number;
    minimumResearchLevel?: number;
    discoveryWeight?: number;

    /**
     * Hard authored restriction for special mutations.
     * When supplied, the active primary or secondary path must be listed.
     */
    primaryPaths?: ResearchPath[];
  };
};

/* -------------------------------------------------------------------------- */
/*                               LAB RESEARCH                                 */
/* -------------------------------------------------------------------------- */

export type LabResearchHours = Record<ResearchPath, number>;

export type ResearchHourCredit = {
  durationDays: ResearchDurationDays;
  baseHours: number;
  primaryPath: ResearchPath;
  primaryHours: number;
  secondaryPath?: ResearchPath;
  secondaryHours: number;
  totalCreditedHours: number;
};

export type DiscoveryPathAlignment =
  | "on-path"
  | "off-path"
  | "wildcard";

export type MutationDiscoveryRecord = {
  discoveryId: string;

  mutationId: string;
  mutationName: string;
  family: MutationFamily;
  rarity: MutationRarity;

  /**
   * Whether the discovery came from the favored biological direction,
   * controlled serendipity, or unrestricted Wildcard research.
   */
  pathAlignment: DiscoveryPathAlignment;

  labId: string;
  walletAddress?: string;

  specimenTokenId: number;
  specimenBaseId: number;

  researchId: string;
  path: ResearchPath;
  secondaryPath?: ResearchPath;
  durationDays: ResearchDurationDays;
  intensity: ResearchIntensity;

  /**
   * Cumulative hours in the primary path after this completed experiment was
   * credited to the lab.
   */
  researchHoursAtDiscovery: number;

  /**
   * Eligibility threshold for this mutation during this discovery.
   */
  requiredResearchHours: number;

  discoveredAt: number;

  /**
   * This is calculated against the supplied global-discovery snapshot.
   * Persistence should confirm this atomically before presenting a permanent
   * "first global discovery" badge.
   */
  firstGlobalDiscovery: boolean;
};

export type LabResearchState = {
  labId: string;
  walletAddress?: string;

  researchHours: LabResearchHours;

  /**
   * Canonical list of mutations this lab has discovered.
   */
  discoveredMutationIds: string[];

  researchLevel: number;
  totalExperiments: number;
  totalResearchHours: number;

  discoveries: MutationDiscoveryRecord[];

  createdAt: number;
  updatedAt: number;
};

/* -------------------------------------------------------------------------- */
/*                            DISCOVERY CANDIDATES                            */
/* -------------------------------------------------------------------------- */

export type DiscoveryCandidateBreakdown = {
  mutationId: string;
  mutationName: string;
  family: MutationFamily;
  rarity: MutationRarity;

  pathAlignment: DiscoveryPathAlignment;

  requiredResearchHours: number;
  availableResearchHours: number;

  /**
   * Informational global rarity weight. Rarity is rolled separately before
   * selecting the exact candidate, so this is NOT multiplied into finalWeight.
   */
  rarityWeight: number;

  primaryPathMultiplier: number;
  secondaryPathMultiplier: number;
  compatibilityMultiplier: number;
  elementMultiplier: number;
  customMultiplier: number;
  wildcardMultiplier: number;

  finalWeight: number;
};

export type DiscoveryCandidate = {
  mutation: DiscoveryMutation;
  weight: number;
  probability?: number;
  percent?: number;
  breakdown: DiscoveryCandidateBreakdown;
};

/* -------------------------------------------------------------------------- */
/*                              DISCOVERY RESULT                              */
/* -------------------------------------------------------------------------- */

export type MutationDiscoveryReason =
  | "clone-research"
  | "no-eligible-mutations"
  | "preferred-pool-exhausted"
  | "discovery-roll-missed"
  | "discovered";

export type MutationDiscoveryResult = {
  occurred: boolean;
  reason: MutationDiscoveryReason;

  chance: number;
  eligibleMutationCount: number;
  eligibleOnPathCount: number;
  eligibleOffPathCount: number;

  /**
   * Normal research uses the duration-specific serendipity allowance.
   * Wildcard is unrestricted and reports 1 here.
   */
  offPathAllowance: number;

  selectedAlignment?: DiscoveryPathAlignment;
  selectedRarity?: MutationRarity;

  /**
   * Intentionally does not expose the full undiscovered candidate list.
   * The player-facing UI should preserve mystery around the hidden pool.
   */
  discovery?: MutationDiscoveryRecord;
};

export type ResearchDiscoveryResolution = {
  lab: LabResearchState;
  hourCredit: ResearchHourCredit;
  discovery: MutationDiscoveryResult;
};
