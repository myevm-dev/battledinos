// battle-ui/lib/research/discovery-record.ts

import type {
  DiscoveryCandidate,
  LabResearchState,
  MutationDiscoveryRecord,
} from "./discovery-types";

import type {
  CanonicalResearchResult,
} from "./research-engine";

import type {
  SpecimenResearchState,
} from "./research-types";

/* -------------------------------------------------------------------------- */
/*                            RECORD CONSTRUCTION                             */
/* -------------------------------------------------------------------------- */

function sanitizeIdPart(
  value: string,
) {
  return value
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .slice(0, 80);
}

export function createMutationDiscoveryRecord({
  lab,
  specimen,
  result,
  candidate,
  globallyDiscoveredMutationIds = [],
}: {
  lab: LabResearchState;
  specimen: SpecimenResearchState;
  result: CanonicalResearchResult;
  candidate: DiscoveryCandidate;
  globallyDiscoveredMutationIds?: readonly string[];
}): MutationDiscoveryRecord {
  const globallyKnown = new Set(
    globallyDiscoveredMutationIds,
  );

  const pathHours =
    lab.researchHours[
      result.outcome.path
    ] ?? 0;

  return {
    discoveryId:
      `DISC-${sanitizeIdPart(
        lab.labId,
      )}-${sanitizeIdPart(
        result.outcome.researchId,
      )}-${sanitizeIdPart(
        candidate.mutation.id,
      )}`,

    mutationId:
      candidate.mutation.id,
    mutationName:
      candidate.mutation.name,
    family:
      candidate.mutation.family,
    rarity:
      candidate.mutation.rarity,
    pathAlignment:
      candidate.breakdown
        .pathAlignment,

    labId: lab.labId,
    walletAddress:
      lab.walletAddress,

    specimenTokenId:
      specimen.tokenId,
    specimenBaseId:
      specimen.baseId,

    researchId:
      result.outcome.researchId,
    path:
      result.outcome.path,
    secondaryPath:
      result.outcome.secondaryPath,
    durationDays:
      result.outcome.durationDays,
    intensity:
      result.outcome.intensity,

    researchHoursAtDiscovery:
      pathHours,
    requiredResearchHours:
      candidate.breakdown
        .requiredResearchHours,

    discoveredAt:
      result.outcome.completedAt,

    firstGlobalDiscovery:
      !globallyKnown.has(
        candidate.mutation.id,
      ),
  };
}

/* -------------------------------------------------------------------------- */
/*                              LAB REGISTRATION                              */
/* -------------------------------------------------------------------------- */

export function registerMutationDiscovery({
  lab,
  discovery,
}: {
  lab: LabResearchState;
  discovery: MutationDiscoveryRecord;
}): LabResearchState {
  if (
    lab.discoveredMutationIds.includes(
      discovery.mutationId,
    )
  ) {
    return lab;
  }

  return {
    ...lab,
    discoveredMutationIds: [
      ...lab.discoveredMutationIds,
      discovery.mutationId,
    ],
    discoveries: [
      ...lab.discoveries,
      discovery,
    ],
    updatedAt:
      Math.max(
        lab.updatedAt,
        discovery.discoveredAt,
      ),
  };
}
