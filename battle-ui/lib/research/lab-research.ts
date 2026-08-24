// battle-ui/lib/research/lab-research.ts

import {
  DISCOVERY_HOURS_BY_RARITY,
  DISCOVERY_PATHS,
  LAB_RESEARCH_LEVEL_THRESHOLDS,
  PRIMARY_RESEARCH_HOUR_CREDIT,
  SECONDARY_RESEARCH_HOUR_CREDIT,
} from "./discovery-config";

import type {
  LabResearchHours,
  LabResearchState,
  ResearchHourCredit,
} from "./discovery-types";

import type {
  CanonicalResearchResult,
} from "./research-engine";

import type {
  MutationRarity,
  ResearchPath,
} from "./research-types";

/* -------------------------------------------------------------------------- */
/*                               EMPTY STATE                                  */
/* -------------------------------------------------------------------------- */

export function createEmptyResearchHours(): LabResearchHours {
  return Object.fromEntries(
    DISCOVERY_PATHS.map(
      (path) => [path, 0],
    ),
  ) as LabResearchHours;
}

export function createLabResearchState({
  labId,
  walletAddress,
  createdAt = Date.now(),
}: {
  labId: string;
  walletAddress?: string;
  createdAt?: number;
}): LabResearchState {
  return {
    labId,
    walletAddress,
    researchHours:
      createEmptyResearchHours(),
    discoveredMutationIds: [],
    researchLevel: 1,
    totalExperiments: 0,
    totalResearchHours: 0,
    discoveries: [],
    createdAt,
    updatedAt: createdAt,
  };
}

/* -------------------------------------------------------------------------- */
/*                              LEVEL HELPERS                                 */
/* -------------------------------------------------------------------------- */

export function getLabResearchLevel(
  totalResearchHours: number,
) {
  let level = 1;

  for (
    const threshold
    of LAB_RESEARCH_LEVEL_THRESHOLDS
  ) {
    if (
      totalResearchHours >=
      threshold.totalHours
    ) {
      level = threshold.level;
    }
  }

  return level;
}

export function getRarityResearchHours(
  rarity: MutationRarity,
) {
  return DISCOVERY_HOURS_BY_RARITY[
    rarity
  ];
}

export function getUnlockedDiscoveryRarities(
  researchHours: number,
): MutationRarity[] {
  return (
    Object.entries(
      DISCOVERY_HOURS_BY_RARITY,
    ) as Array<
      [MutationRarity, number]
    >
  )
    .filter(
      ([, requiredHours]) =>
        researchHours >=
        requiredHours,
    )
    .map(([rarity]) => rarity);
}

export function getPathResearchHours(
  lab: LabResearchState,
  path: ResearchPath,
) {
  return lab.researchHours[path] ?? 0;
}

/* -------------------------------------------------------------------------- */
/*                            RESEARCH HOUR CREDIT                            */
/* -------------------------------------------------------------------------- */

export function calculateResearchHourCredit(
  result: CanonicalResearchResult,
): ResearchHourCredit {
  const durationDays =
    result.outcome.durationDays;

  const baseHours =
    durationDays * 24;

  /**
   * Clone research is predictive intelligence. It must not let a player buy
   * thousands of cheap simulations and instantly unlock the canonical
   * mutation discovery tree.
   */
  if (
    result.outcome.mode === "clone"
  ) {
    return {
      durationDays,
      baseHours,
      primaryPath:
        result.outcome.path,
      primaryHours: 0,
      secondaryPath:
        result.outcome.secondaryPath,
      secondaryHours: 0,
      totalCreditedHours: 0,
    };
  }

  const primaryHours =
    baseHours *
    PRIMARY_RESEARCH_HOUR_CREDIT;

  const secondaryHours =
    result.outcome.secondaryPath
      ? baseHours *
        SECONDARY_RESEARCH_HOUR_CREDIT
      : 0;

  return {
    durationDays,
    baseHours,
    primaryPath:
      result.outcome.path,
    primaryHours,
    secondaryPath:
      result.outcome.secondaryPath,
    secondaryHours,
    totalCreditedHours:
      primaryHours +
      secondaryHours,
  };
}

export function applyResearchHourCredit({
  lab,
  result,
  completedAt = result.outcome.completedAt,
}: {
  lab: LabResearchState;
  result: CanonicalResearchResult;
  completedAt?: number;
}) {
  const credit =
    calculateResearchHourCredit(
      result,
    );

  if (
    credit.totalCreditedHours === 0
  ) {
    return {
      lab,
      credit,
    };
  }

  const researchHours = {
    ...lab.researchHours,
    [credit.primaryPath]:
      (lab.researchHours[
        credit.primaryPath
      ] ?? 0) +
      credit.primaryHours,
  };

  if (
    credit.secondaryPath &&
    credit.secondaryHours > 0
  ) {
    researchHours[
      credit.secondaryPath
    ] =
      (researchHours[
        credit.secondaryPath
      ] ?? 0) +
      credit.secondaryHours;
  }

  const totalResearchHours =
    lab.totalResearchHours +
    credit.totalCreditedHours;

  const nextLab: LabResearchState = {
    ...lab,
    researchHours,
    totalResearchHours,
    totalExperiments:
      lab.totalExperiments + 1,
    researchLevel:
      getLabResearchLevel(
        totalResearchHours,
      ),
    updatedAt: completedAt,
  };

  return {
    lab: nextLab,
    credit,
  };
}
