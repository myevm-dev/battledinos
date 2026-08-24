// battle-ui/lib/research/mutation-library-adapter.ts

import {
  MUTATIONS,
  MUTATION_COUNT,
  type MutationDefinition,
} from "../mutation-library";

import type {
  OutcomeMutation,
} from "./research-outcomes";

import type {
  MutationFamily,
  MutationRarity,
} from "./research-types";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export type MutationLibraryValidationIssue = {
  index: number;
  mutationId?: string;
  field: string;
  message: string;
};

export type MutationLibrarySummary = {
  count: number;
  expectedCount: number;
  valid: boolean;
  issues: MutationLibraryValidationIssue[];
  familyCounts: Record<MutationFamily, number>;
  rarityCounts: Record<MutationRarity, number>;
  statBiasRange: {
    min: number;
    max: number;
  };
};

/* -------------------------------------------------------------------------- */
/*                              VALID CONSTANTS                               */
/* -------------------------------------------------------------------------- */

const FAMILIES: MutationFamily[] = [
  "Structural",
  "Metabolic",
  "Neural",
  "Cross-Species",
  "Elemental",
  "Defensive",
  "Offensive",
  "Mobility",
  "Wildcard",
];

const RARITIES: MutationRarity[] = [
  "Common",
  "Uncommon",
  "Rare",
  "Epic",
  "Legendary",
];

const FAMILY_SET = new Set<string>(FAMILIES);
const RARITY_SET = new Set<string>(RARITIES);

/* -------------------------------------------------------------------------- */
/*                                  ADAPTER                                   */
/* -------------------------------------------------------------------------- */

/**
 * The existing mutation library already has the exact fields required by the
 * research engine. This adapter gives the research layer one canonical typed
 * view without duplicating the 600 records.
 */
export function adaptMutation(
  mutation: MutationDefinition,
): OutcomeMutation {
  return {
    id: mutation.id,
    name: mutation.name,
    family: mutation.family as MutationFamily,
    rarity: mutation.rarity as MutationRarity,
    description: mutation.description,
    visualEffect: mutation.visualEffect,
    statBias: {
      health: mutation.statBias.health,
      attack: mutation.statBias.attack,
      defense: mutation.statBias.defense,
      speed: mutation.statBias.speed,
    },
    movePowerMultiplier: mutation.movePowerMultiplier,
    tags: [...mutation.tags],
    evolutionInfluence: mutation.evolutionInfluence,
  };
}

export const RESEARCH_MUTATIONS: OutcomeMutation[] =
  MUTATIONS.map(adaptMutation);

export const RESEARCH_MUTATION_COUNT =
  RESEARCH_MUTATIONS.length;

const RESEARCH_MUTATIONS_BY_ID =
  new Map(
    RESEARCH_MUTATIONS.map(
      (mutation) => [mutation.id, mutation],
    ),
  );

export function getResearchMutationById(
  mutationId: string,
): OutcomeMutation | undefined {
  return RESEARCH_MUTATIONS_BY_ID.get(
    mutationId,
  );
}

export function getResearchMutationsByIds(
  mutationIds: readonly string[],
): OutcomeMutation[] {
  return mutationIds
    .map(getResearchMutationById)
    .filter(
      (mutation): mutation is OutcomeMutation =>
        mutation !== undefined,
    );
}

/* -------------------------------------------------------------------------- */
/*                                VALIDATION                                  */
/* -------------------------------------------------------------------------- */

export function validateMutationLibrary(): MutationLibrarySummary {
  const issues: MutationLibraryValidationIssue[] = [];

  const familyCounts = Object.fromEntries(
    FAMILIES.map((family) => [family, 0]),
  ) as Record<MutationFamily, number>;

  const rarityCounts = Object.fromEntries(
    RARITIES.map((rarity) => [rarity, 0]),
  ) as Record<MutationRarity, number>;

  const ids = new Set<string>();
  let minStatBias = Number.POSITIVE_INFINITY;
  let maxStatBias = Number.NEGATIVE_INFINITY;

  MUTATIONS.forEach((mutation, index) => {
    if (!mutation.id.trim()) {
      issues.push({
        index,
        field: "id",
        message: "Mutation ID is empty.",
      });
    }

    if (ids.has(mutation.id)) {
      issues.push({
        index,
        mutationId: mutation.id,
        field: "id",
        message: "Duplicate mutation ID.",
      });
    }

    ids.add(mutation.id);

    if (!FAMILY_SET.has(mutation.family)) {
      issues.push({
        index,
        mutationId: mutation.id,
        field: "family",
        message: `Unknown mutation family: ${mutation.family}`,
      });
    } else {
      familyCounts[
        mutation.family as MutationFamily
      ] += 1;
    }

    if (!RARITY_SET.has(mutation.rarity)) {
      issues.push({
        index,
        mutationId: mutation.id,
        field: "rarity",
        message: `Unknown mutation rarity: ${mutation.rarity}`,
      });
    } else {
      rarityCounts[
        mutation.rarity as MutationRarity
      ] += 1;
    }

    const statValues = [
      mutation.statBias.health,
      mutation.statBias.attack,
      mutation.statBias.defense,
      mutation.statBias.speed,
    ];

    for (const value of statValues) {
      if (!Number.isFinite(value)) {
        issues.push({
          index,
          mutationId: mutation.id,
          field: "statBias",
          message: "Mutation contains a non-finite stat bias.",
        });
        continue;
      }

      minStatBias = Math.min(minStatBias, value);
      maxStatBias = Math.max(maxStatBias, value);
    }

    if (
      !Number.isFinite(mutation.movePowerMultiplier) ||
      mutation.movePowerMultiplier <= 0
    ) {
      issues.push({
        index,
        mutationId: mutation.id,
        field: "movePowerMultiplier",
        message: "Move power multiplier must be positive and finite.",
      });
    }
  });

  if (MUTATION_COUNT !== MUTATIONS.length) {
    issues.push({
      index: -1,
      field: "MUTATION_COUNT",
      message:
        `MUTATION_COUNT reports ${MUTATION_COUNT} but MUTATIONS contains ${MUTATIONS.length}.`,
    });
  }

  return {
    count: MUTATIONS.length,
    expectedCount: MUTATION_COUNT,
    valid: issues.length === 0,
    issues,
    familyCounts,
    rarityCounts,
    statBiasRange: {
      min:
        minStatBias === Number.POSITIVE_INFINITY
          ? 0
          : minStatBias,
      max:
        maxStatBias === Number.NEGATIVE_INFINITY
          ? 0
          : maxStatBias,
    },
  };
}
