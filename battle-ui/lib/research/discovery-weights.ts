// battle-ui/lib/research/discovery-weights.ts

import {
  DISCOVERY_RARITY_WEIGHTS,
  ELEMENT_TAG_DISCOVERY_MULTIPLIER,
  FAVORED_DISCOVERY_AFFINITY_THRESHOLD,
  SECONDARY_DISCOVERY_WEIGHT_STRENGTH,
  WILDCARD_FAMILY_DISCOVERY_MULTIPLIER,
} from "./discovery-config";

import type {
  DiscoveryCandidate,
  DiscoveryMutation,
  DiscoveryPathAlignment,
  LabResearchState,
} from "./discovery-types";

import {
  getResearchFamilyWeight,
} from "./research-paths";

import {
  normalizeWeights,
  weightedRandom,
} from "./research-rng";

import type {
  MutationRarity,
  ResearchCompatibility,
  ResearchPath,
  SpecimenResearchState,
} from "./research-types";

/* -------------------------------------------------------------------------- */
/*                                 HELPERS                                    */
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

function applySecondaryInfluence(
  rawWeight: number,
) {
  return 1 +
    (rawWeight - 1) *
      SECONDARY_DISCOVERY_WEIGHT_STRENGTH;
}

function getElementMultiplier(
  specimen: SpecimenResearchState,
  mutation: DiscoveryMutation,
) {
  if (!mutation.tags?.length) {
    return 1;
  }

  const element =
    specimen.element
      .trim()
      .toLowerCase();

  const matches =
    mutation.tags.some(
      (tag) =>
        tag.trim().toLowerCase() ===
        element,
    );

  return matches
    ? ELEMENT_TAG_DISCOVERY_MULTIPLIER
    : 1;
}

function getCompatibilityMultiplier({
  mutation,
  compatibility,
}: {
  mutation: DiscoveryMutation;
  compatibility: ResearchCompatibility;
}) {
  const familyCompatibility =
    compatibility.familyCompatibility[
      mutation.family
    ] ?? compatibility.overall;

  /**
   * 0 compatibility -> 0.80x
   * 0.50             -> 1.00x
   * 1.00             -> 1.20x
   */
  return 0.8 +
    clamp(
      familyCompatibility,
      0,
      1,
    ) * 0.4;
}

function getRequiredHours(
  mutation: DiscoveryMutation,
  defaultHours: number,
) {
  return Math.max(
    0,
    mutation.discovery?.baseHours ??
      defaultHours,
  );
}

/* -------------------------------------------------------------------------- */
/*                             PATH ALIGNMENT                                 */
/* -------------------------------------------------------------------------- */

/**
 * Classifies a mutation as favored by the active experiment or as a possible
 * serendipitous off-path discovery.
 *
 * Wildcard research is intentionally unrestricted.
 */
export function getDiscoveryPathAlignment({
  mutation,
  primaryPath,
  secondaryPath,
}: {
  mutation: DiscoveryMutation;
  primaryPath: ResearchPath;
  secondaryPath?: ResearchPath;
}): DiscoveryPathAlignment {
  if (primaryPath === "Wildcard") {
    return "wildcard";
  }

  const primaryAffinity =
    getResearchFamilyWeight(
      primaryPath,
      mutation.family,
    );

  const secondaryAffinity =
    secondaryPath
      ? getResearchFamilyWeight(
          secondaryPath,
          mutation.family,
        )
      : 0;

  const favored =
    primaryAffinity >
      FAVORED_DISCOVERY_AFFINITY_THRESHOLD ||
    secondaryAffinity >
      FAVORED_DISCOVERY_AFFINITY_THRESHOLD;

  return favored
    ? "on-path"
    : "off-path";
}

/* -------------------------------------------------------------------------- */
/*                           CANDIDATE GENERATION                             */
/* -------------------------------------------------------------------------- */

export function buildDiscoveryCandidateTable({
  lab,
  specimen,
  mutations,
  primaryPath,
  secondaryPath,
  compatibility,
  rarityHours,
  includeProbabilities = false,
}: {
  lab: LabResearchState;
  specimen: SpecimenResearchState;
  mutations: readonly DiscoveryMutation[];
  primaryPath: ResearchPath;
  secondaryPath?: ResearchPath;
  compatibility: ResearchCompatibility;
  rarityHours: Record<
    DiscoveryMutation["rarity"],
    number
  >;

  /**
   * Player-facing analytics can request normalized probabilities. Canonical
   * discovery resolution only needs raw weights, so leaving this false avoids
   * sorting and normalizing hundreds of candidates on every experiment.
   */
  includeProbabilities?: boolean;
}): DiscoveryCandidate[] {
  const known = new Set(
    lab.discoveredMutationIds,
  );

  const availableResearchHours =
    lab.researchHours[
      primaryPath
    ] ?? 0;

  const candidates = mutations
    .filter(
      (mutation) =>
        !known.has(mutation.id),
    )
    .filter((mutation) => {
      const minimumLevel =
        mutation.discovery
          ?.minimumResearchLevel ?? 1;

      return (
        lab.researchLevel >=
        minimumLevel
      );
    })
    .filter((mutation) => {
      const requiredHours =
        getRequiredHours(
          mutation,
          rarityHours[
            mutation.rarity
          ],
        );

      return (
        availableResearchHours >=
        requiredHours
      );
    })
    .filter((mutation) => {
      /**
       * Explicit mutation path restrictions are hard authored rules.
       * Generic family alignment is handled later as on/off-path weighting.
       */
      const explicitPaths =
        mutation.discovery
          ?.primaryPaths;

      if (!explicitPaths?.length) {
        return true;
      }

      return (
        explicitPaths.includes(
          primaryPath,
        ) ||
        Boolean(
          secondaryPath &&
          explicitPaths.includes(
            secondaryPath,
          ),
        )
      );
    })
    .map((mutation) => {
      const requiredResearchHours =
        getRequiredHours(
          mutation,
          rarityHours[
            mutation.rarity
          ],
        );

      const rarityWeight =
        DISCOVERY_RARITY_WEIGHTS[
          mutation.rarity
        ];

      const primaryPathMultiplier =
        Math.max(
          0.2,
          getResearchFamilyWeight(
            primaryPath,
            mutation.family,
          ),
        );

      const secondaryPathMultiplier =
        secondaryPath
          ? Math.max(
              0.5,
              applySecondaryInfluence(
                getResearchFamilyWeight(
                  secondaryPath,
                  mutation.family,
                ),
              ),
            )
          : 1;

      const compatibilityMultiplier =
        getCompatibilityMultiplier({
          mutation,
          compatibility,
        });

      const elementMultiplier =
        getElementMultiplier(
          specimen,
          mutation,
        );

      const customMultiplier =
        Math.max(
          0.05,
          mutation.discovery
            ?.discoveryWeight ?? 1,
        );

      const wildcardMultiplier =
        primaryPath === "Wildcard" &&
        mutation.family === "Wildcard"
          ? WILDCARD_FAMILY_DISCOVERY_MULTIPLIER
          : 1;

      const pathAlignment =
        getDiscoveryPathAlignment({
          mutation,
          primaryPath,
          secondaryPath,
        });

      /**
       * Rarity is deliberately NOT multiplied here. The engine rolls rarity
       * first so authored mutation counts cannot distort global discovery
       * rarity.
       */
      const finalWeight =
        primaryPathMultiplier *
        secondaryPathMultiplier *
        compatibilityMultiplier *
        elementMultiplier *
        customMultiplier *
        wildcardMultiplier;

      return {
        mutation,
        weight: Math.max(
          0,
          finalWeight,
        ),
        breakdown: {
          mutationId: mutation.id,
          mutationName:
            mutation.name,
          family: mutation.family,
          rarity: mutation.rarity,
          pathAlignment,
          requiredResearchHours,
          availableResearchHours,
          rarityWeight,
          primaryPathMultiplier,
          secondaryPathMultiplier,
          compatibilityMultiplier,
          elementMultiplier,
          customMultiplier,
          wildcardMultiplier,
          finalWeight: Math.max(
            0,
            finalWeight,
          ),
        },
      } satisfies DiscoveryCandidate;
    })
    .filter(
      (candidate) =>
        Number.isFinite(
          candidate.weight,
        ) &&
        candidate.weight > 0,
    );

  if (!includeProbabilities) {
    return candidates;
  }

  const normalized =
    normalizeWeights(
      candidates.map(
        (candidate) => ({
          item:
            candidate.mutation.id,
          weight:
            candidate.weight,
        }),
      ),
    );

  const probabilities = new Map(
    normalized.map(
      ({
        item,
        probability,
        percent,
      }) => [
        item,
        {
          probability,
          percent,
        },
      ],
    ),
  );

  return candidates
    .map((candidate) => ({
      ...candidate,
      probability:
        probabilities.get(
          candidate.mutation.id,
        )?.probability ?? 0,
      percent:
        probabilities.get(
          candidate.mutation.id,
        )?.percent ?? 0,
    }))
    .sort(
      (a, b) =>
        b.weight - a.weight,
    );
}

/* -------------------------------------------------------------------------- */
/*                               PARTITIONING                                 */
/* -------------------------------------------------------------------------- */

export function partitionDiscoveryCandidates(
  candidates: readonly DiscoveryCandidate[],
) {
  const onPath =
    candidates.filter(
      (candidate) =>
        candidate.breakdown
          .pathAlignment ===
        "on-path",
    );

  const offPath =
    candidates.filter(
      (candidate) =>
        candidate.breakdown
          .pathAlignment ===
        "off-path",
    );

  const wildcard =
    candidates.filter(
      (candidate) =>
        candidate.breakdown
          .pathAlignment ===
        "wildcard",
    );

  return {
    onPath,
    offPath,
    wildcard,
  };
}

/* -------------------------------------------------------------------------- */
/*                               RARITY ROLL                                  */
/* -------------------------------------------------------------------------- */

export function rollDiscoveryRarity(
  seed: string,
  candidates: readonly DiscoveryCandidate[],
): MutationRarity {
  if (candidates.length === 0) {
    throw new Error(
      "No candidates are available for a discovery rarity roll.",
    );
  }

  const availableRarities =
    new Set<MutationRarity>(
      candidates.map(
        (candidate) =>
          candidate.mutation.rarity,
      ),
    );

  const weighted =
    (
      Object.entries(
        DISCOVERY_RARITY_WEIGHTS,
      ) as Array<
        [MutationRarity, number]
      >
    )
      .filter(
        ([rarity]) =>
          availableRarities.has(
            rarity,
          ),
      )
      .map(
        ([item, weight]) => ({
          item,
          weight,
        }),
      );

  return weightedRandom(
    seed,
    weighted,
  );
}

/* -------------------------------------------------------------------------- */
/*                              CANDIDATE ROLL                                */
/* -------------------------------------------------------------------------- */

export function rollDiscoveryCandidate(
  seed: string,
  candidates: readonly DiscoveryCandidate[],
  rarity?: MutationRarity,
): DiscoveryCandidate {
  const eligible = rarity
    ? candidates.filter(
        (candidate) =>
          candidate.mutation.rarity ===
          rarity,
      )
    : [...candidates];

  if (eligible.length === 0) {
    throw new Error(
      rarity
        ? `No eligible ${rarity} mutation discoveries are available.`
        : "No eligible mutation discoveries are available.",
    );
  }

  const mutation = weightedRandom(
    seed,
    eligible.map(
      (candidate) => ({
        item: candidate.mutation,
        weight: candidate.weight,
      }),
    ),
  );

  const candidate =
    eligible.find(
      (entry) =>
        entry.mutation.id ===
        mutation.id,
    );

  if (!candidate) {
    throw new Error(
      `Selected discovery ${mutation.id} could not be found in its candidate table.`,
    );
  }

  return candidate;
}
