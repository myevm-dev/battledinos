// battle-ui/lib/research/discovery-engine.ts

import {
  BASE_DISCOVERY_CHANCE_BY_DURATION,
  DISCOVERY_HOURS_BY_RARITY,
  DISCOVERY_INTENSITY_MULTIPLIER,
  DISCOVERY_SATURATION,
  MAX_DISCOVERY_CHANCE,
  MIN_DISCOVERY_CHANCE,
  OFF_PATH_DISCOVERY_CHANCE_BY_DURATION,
  WILDCARD_DISCOVERY_CHANCE_MULTIPLIER,
} from "./discovery-config";

import {
  createMutationDiscoveryRecord,
  registerMutationDiscovery,
} from "./discovery-record";

import type {
  DiscoveryCandidate,
  DiscoveryMutation,
  DiscoveryPathAlignment,
  LabResearchState,
  MutationDiscoveryResult,
  ResearchDiscoveryResolution,
} from "./discovery-types";

import {
  buildDiscoveryCandidateTable,
  partitionDiscoveryCandidates,
  rollDiscoveryCandidate,
  rollDiscoveryRarity,
} from "./discovery-weights";

import {
  applyResearchHourCredit,
} from "./lab-research";

import {
  deriveSeed,
  seededChance,
} from "./research-rng";

import type {
  CanonicalResearchResult,
} from "./research-engine";

import type {
  SpecimenResearchState,
} from "./research-types";

/* -------------------------------------------------------------------------- */
/*                          DISCOVERY CHANCE                                  */
/* -------------------------------------------------------------------------- */

function clamp(
  value: number,
  min: number,
  max: number,
) {
  return Math.min(
    max,
    Math.max(min, value),
  );
}

export function calculateDiscoveryChance({
  result,
  eligibleMutationCount,
  discoveredRelevantCount,
}: {
  result: CanonicalResearchResult;
  eligibleMutationCount: number;
  discoveredRelevantCount: number;
}) {
  if (
    eligibleMutationCount <= 0
  ) {
    return 0;
  }

  const durationChance =
    BASE_DISCOVERY_CHANCE_BY_DURATION[
      result.outcome.durationDays
    ];

  const intensityMultiplier =
    DISCOVERY_INTENSITY_MULTIPLIER[
      result.outcome.intensity
    ];

  const compatibilityMultiplier =
    0.85 +
    clamp(
      result.outcome.compatibility
        .overall,
      0,
      1,
    ) * 0.3;

  const wildcardMultiplier =
    result.outcome.path ===
    "Wildcard"
      ? WILDCARD_DISCOVERY_CHANCE_MULTIPLIER
      : 1;

  const totalRelevantKnownAndUnknown =
    eligibleMutationCount +
    discoveredRelevantCount;

  const discoveredShare =
    totalRelevantKnownAndUnknown > 0
      ? discoveredRelevantCount /
        totalRelevantKnownAndUnknown
      : 0;

  const saturationMultiplier =
    Math.max(
      DISCOVERY_SATURATION
        .minimumMultiplier,
      1 -
        discoveredShare *
          DISCOVERY_SATURATION
            .strength,
    );

  const chance =
    durationChance *
    intensityMultiplier *
    compatibilityMultiplier *
    wildcardMultiplier *
    saturationMultiplier;

  return clamp(
    chance,
    MIN_DISCOVERY_CHANCE,
    MAX_DISCOVERY_CHANCE,
  );
}

/* -------------------------------------------------------------------------- */
/*                           POOL SELECTION                                   */
/* -------------------------------------------------------------------------- */

function selectDiscoveryPool({
  result,
  onPath,
  offPath,
  wildcard,
}: {
  result: CanonicalResearchResult;
  onPath: readonly DiscoveryCandidate[];
  offPath: readonly DiscoveryCandidate[];
  wildcard: readonly DiscoveryCandidate[];
}): {
  candidates: readonly DiscoveryCandidate[];
  alignment: DiscoveryPathAlignment;
  offPathAllowance: number;
} {
  if (
    result.outcome.path ===
    "Wildcard"
  ) {
    return {
      candidates:
        wildcard.length > 0
          ? wildcard
          : [...onPath, ...offPath],
      alignment: "wildcard",
      offPathAllowance: 1,
    };
  }

  const offPathAllowance =
    OFF_PATH_DISCOVERY_CHANCE_BY_DURATION[
      result.outcome.durationDays
    ];

  const useOffPath =
    offPath.length > 0 &&
    seededChance(
      deriveSeed(
        result.outcome.seed,
        "mutation-discovery",
        "path-alignment",
      ),
      offPathAllowance,
    );

  if (useOffPath) {
    return {
      candidates: offPath,
      alignment: "off-path",
      offPathAllowance,
    };
  }

  return {
    candidates: onPath,
    alignment: "on-path",
    offPathAllowance,
  };
}

/* -------------------------------------------------------------------------- */
/*                          COMPLETE RESOLUTION                               */
/* -------------------------------------------------------------------------- */

/**
 * Resolves the discovery layer AFTER canonical specimen research has already
 * been calculated.
 *
 * This separation is intentional:
 *
 * specimen research outcome seed
 *        ↓
 * mutation expression
 *        ↓
 * separate scoped discovery seed
 *        ↓
 * lab knowledge / provenance
 *
 * Adding or tuning discoveries therefore does not change historical mutation
 * expression outcomes.
 */
export function resolveResearchDiscovery({
  lab,
  specimen,
  result,
  mutations,
  globallyDiscoveredMutationIds = [],
}: {
  lab: LabResearchState;
  specimen: SpecimenResearchState;
  result: CanonicalResearchResult;
  mutations: readonly DiscoveryMutation[];
  globallyDiscoveredMutationIds?: readonly string[];
}): ResearchDiscoveryResolution {
  const credited =
    applyResearchHourCredit({
      lab,
      result,
    });

  /**
   * Clone research can produce formula evidence and previews, but it does not
   * advance the canonical mutation discovery tree.
   */
  if (
    result.outcome.mode === "clone"
  ) {
    return {
      lab: credited.lab,
      hourCredit:
        credited.credit,
      discovery: {
        occurred: false,
        reason: "clone-research",
        chance: 0,
        eligibleMutationCount: 0,
        eligibleOnPathCount: 0,
        eligibleOffPathCount: 0,
        offPathAllowance: 0,
      },
    };
  }

  const candidates =
    buildDiscoveryCandidateTable({
      lab: credited.lab,
      specimen,
      mutations,
      primaryPath:
        result.outcome.path,
      secondaryPath:
        result.outcome.secondaryPath,
      compatibility:
        result.outcome.compatibility,
      rarityHours:
        DISCOVERY_HOURS_BY_RARITY,
    });

  const partitioned =
    partitionDiscoveryCandidates(
      candidates,
    );

  const normalResearch =
    result.outcome.path !==
    "Wildcard";

  const activeOnPathCount =
    normalResearch
      ? partitioned.onPath.length
      : partitioned.wildcard.length;

  const activeOffPathCount =
    normalResearch
      ? partitioned.offPath.length
      : 0;

  const offPathAllowance =
    normalResearch
      ? OFF_PATH_DISCOVERY_CHANCE_BY_DURATION[
          result.outcome.durationDays
        ]
      : 1;

  if (
    candidates.length === 0
  ) {
    return {
      lab: credited.lab,
      hourCredit:
        credited.credit,
      discovery: {
        occurred: false,
        reason:
          "no-eligible-mutations",
        chance: 0,
        eligibleMutationCount: 0,
        eligibleOnPathCount: 0,
        eligibleOffPathCount: 0,
        offPathAllowance,
      },
    };
  }

  /**
   * Critical anti-convergence rule:
   *
   * Normal research does not widen indefinitely into unrelated biology when
   * its favored pool is exhausted. The experiment still earns research hours,
   * evidence, compatibility observations, and formula data, but no new
   * mutation is discovered from an unrelated family solely because the
   * preferred pool ran dry.
   */
  if (
    normalResearch &&
    partitioned.onPath.length === 0
  ) {
    return {
      lab: credited.lab,
      hourCredit:
        credited.credit,
      discovery: {
        occurred: false,
        reason:
          "preferred-pool-exhausted",
        chance: 0,
        eligibleMutationCount:
          candidates.length,
        eligibleOnPathCount: 0,
        eligibleOffPathCount:
          partitioned.offPath.length,
        offPathAllowance,
      },
    };
  }

  const candidateIds = new Set(
    candidates.map(
      (candidate) =>
        candidate.mutation.id,
    ),
  );

  /**
   * Approximate current saturation against the active biological search
   * direction. Known mutations discovered through this research path make
   * future novelty somewhat harder.
   */
  const discoveredRelevantCount =
    credited.lab.discoveries.filter(
      (discovery) =>
        discovery.path ===
          result.outcome.path ||
        candidateIds.has(
          discovery.mutationId,
        ),
    ).length;

  const chance =
    calculateDiscoveryChance({
      result,
      eligibleMutationCount:
        normalResearch
          ? partitioned.onPath.length
          : candidates.length,
      discoveredRelevantCount,
    });

  const occurred =
    seededChance(
      deriveSeed(
        result.outcome.seed,
        "mutation-discovery",
        "chance",
      ),
      chance,
    );

  if (!occurred) {
    return {
      lab: credited.lab,
      hourCredit:
        credited.credit,
      discovery: {
        occurred: false,
        reason:
          "discovery-roll-missed",
        chance,
        eligibleMutationCount:
          candidates.length,
        eligibleOnPathCount:
          activeOnPathCount,
        eligibleOffPathCount:
          activeOffPathCount,
        offPathAllowance,
      },
    };
  }

  const pool =
    selectDiscoveryPool({
      result,
      onPath:
        partitioned.onPath,
      offPath:
        partitioned.offPath,
      wildcard:
        partitioned.wildcard,
    });

  if (
    pool.candidates.length === 0
  ) {
    return {
      lab: credited.lab,
      hourCredit:
        credited.credit,
      discovery: {
        occurred: false,
        reason:
          "preferred-pool-exhausted",
        chance,
        eligibleMutationCount:
          candidates.length,
        eligibleOnPathCount:
          activeOnPathCount,
        eligibleOffPathCount:
          activeOffPathCount,
        offPathAllowance:
          pool.offPathAllowance,
      },
    };
  }

  const selectedRarity =
    rollDiscoveryRarity(
      deriveSeed(
        result.outcome.seed,
        "mutation-discovery",
        "rarity",
        pool.alignment,
      ),
      pool.candidates,
    );

  const selected =
    rollDiscoveryCandidate(
      deriveSeed(
        result.outcome.seed,
        "mutation-discovery",
        "selection",
        pool.alignment,
        selectedRarity,
      ),
      pool.candidates,
      selectedRarity,
    );

  const discovery =
    createMutationDiscoveryRecord({
      lab: credited.lab,
      specimen,
      result,
      candidate: selected,
      globallyDiscoveredMutationIds,
    });

  const updatedLab =
    registerMutationDiscovery({
      lab: credited.lab,
      discovery,
    });

  const discoveryResult:
    MutationDiscoveryResult = {
    occurred: true,
    reason: "discovered",
    chance,
    eligibleMutationCount:
      candidates.length,
    eligibleOnPathCount:
      activeOnPathCount,
    eligibleOffPathCount:
      activeOffPathCount,
    offPathAllowance:
      pool.offPathAllowance,
    selectedAlignment:
      discovery.pathAlignment,
    selectedRarity:
      discovery.rarity,
    discovery,
  };

  return {
    lab: updatedLab,
    hourCredit:
      credited.credit,
    discovery:
      discoveryResult,
  };
}

/* -------------------------------------------------------------------------- */
/*                        PLAYER-SAFE DISCOVERY VIEW                          */
/* -------------------------------------------------------------------------- */

/**
 * Use this shape in player-facing APIs before a discovery occurs.
 * It deliberately reports only how much undocumented biology remains, never
 * the IDs/names of hidden mutations.
 */
export function getDiscoveryResearchSummary({
  lab,
  path,
  totalLibraryCount,
}: {
  lab: LabResearchState;
  path: keyof LabResearchState["researchHours"];
  totalLibraryCount: number;
}) {
  const discoveredCount =
    lab.discoveredMutationIds.length;

  return {
    path,
    researchHours:
      lab.researchHours[path] ?? 0,
    researchLevel:
      lab.researchLevel,
    knownMutations:
      discoveredCount,
    undocumentedSignatures:
      Math.max(
        0,
        totalLibraryCount -
          discoveredCount,
      ),
  };
}
