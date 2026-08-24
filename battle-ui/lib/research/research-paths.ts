// battle-ui/lib/research/research-paths.ts

import type {
  MutationFamily,
  ResearchPath,
} from "./research-types";

/**
 * Research paths define what biological direction the player is attempting
 * to push the specimen toward.
 *
 * A selected path does NOT guarantee mutations from that family.
 *
 * Instead, it modifies the relative weight of mutation families before
 * individual mutations are selected.
 */

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export type ResearchPathDefinition = {
  id: ResearchPath;

  label: string;

  description: string;

  /**
   * Relative family weights.
   *
   * 1.00 = neutral
   * > 1.00 = favored
   * < 1.00 = suppressed
   */
  familyWeights: Record<MutationFamily, number>;

  /**
   * Useful later for UI, phenotype generation, formula discovery,
   * and research reports.
   */
  phenotypeThemes: string[];

  /**
   * General biological concepts associated with this path.
   */
  tags: string[];
};

/* -------------------------------------------------------------------------- */
/*                             DEFAULT WEIGHTS                                */
/* -------------------------------------------------------------------------- */

const NEUTRAL_FAMILY_WEIGHTS: Record<
  MutationFamily,
  number
> = {
  Structural: 1,
  Metabolic: 1,
  Neural: 1,
  "Cross-Species": 1,
  Elemental: 1,
  Defensive: 1,
  Offensive: 1,
  Mobility: 1,
  Wildcard: 1,
};

/* -------------------------------------------------------------------------- */
/*                              RESEARCH PATHS                                */
/* -------------------------------------------------------------------------- */

export const RESEARCH_PATHS: Record<
  ResearchPath,
  ResearchPathDefinition
> = {
  Structural: {
    id: "Structural",

    label: "Structural Research",

    description:
      "Focuses on skeletal development, body mass, armor geometry, horns, plating, musculature, and other major anatomical changes.",

    familyWeights: {
      ...NEUTRAL_FAMILY_WEIGHTS,

      Structural: 2.6,
      Defensive: 1.45,
      Offensive: 1.25,
      Metabolic: 1.1,

      Neural: 0.8,
      Mobility: 0.85,
      Elemental: 0.8,
      "Cross-Species": 0.9,
      Wildcard: 0.65,
    },

    phenotypeThemes: [
      "skeletal restructuring",
      "increased body mass",
      "cranial development",
      "bone reinforcement",
      "armor growth",
      "muscular development",
    ],

    tags: [
      "bone",
      "armor",
      "mass",
      "horns",
      "muscle",
      "anatomy",
    ],
  },

  Metabolic: {
    id: "Metabolic",

    label: "Metabolic Research",

    description:
      "Focuses on biological efficiency, regeneration, endurance, internal chemistry, energy production, heat regulation, and recovery.",

    familyWeights: {
      ...NEUTRAL_FAMILY_WEIGHTS,

      Metabolic: 2.6,
      Defensive: 1.25,
      Mobility: 1.2,
      Elemental: 1.15,

      Structural: 0.95,
      Offensive: 0.95,
      Neural: 0.9,
      "Cross-Species": 0.85,
      Wildcard: 0.7,
    },

    phenotypeThemes: [
      "enhanced circulation",
      "rapid tissue recovery",
      "metabolic acceleration",
      "thermal regulation",
      "internal gland development",
      "energy storage",
    ],

    tags: [
      "regeneration",
      "endurance",
      "energy",
      "glands",
      "recovery",
      "metabolism",
    ],
  },

  Neural: {
    id: "Neural",

    label: "Neural Research",

    description:
      "Focuses on perception, reaction speed, coordination, sensory processing, behavioral adaptation, and neurological development.",

    familyWeights: {
      ...NEUTRAL_FAMILY_WEIGHTS,

      Neural: 2.6,
      Mobility: 1.45,
      Offensive: 1.15,
      Metabolic: 1.1,

      Defensive: 0.85,
      Structural: 0.8,
      Elemental: 0.95,
      "Cross-Species": 0.9,
      Wildcard: 0.75,
    },

    phenotypeThemes: [
      "expanded sensory organs",
      "cranial neural development",
      "heightened reflexes",
      "enhanced coordination",
      "predatory awareness",
      "behavioral adaptation",
    ],

    tags: [
      "reflex",
      "senses",
      "coordination",
      "intelligence",
      "reaction",
      "neural",
    ],
  },

  "Cross-Species": {
    id: "Cross-Species",

    label: "Cross-Species Research",

    description:
      "Introduces compatible biological traits inspired by other organisms, producing unusual anatomical and functional combinations.",

    familyWeights: {
      ...NEUTRAL_FAMILY_WEIGHTS,

      "Cross-Species": 2.7,
      Structural: 1.35,
      Defensive: 1.15,
      Offensive: 1.15,
      Mobility: 1.1,

      Metabolic: 0.95,
      Neural: 0.95,
      Elemental: 0.85,
      Wildcard: 1.05,
    },

    phenotypeThemes: [
      "hybrid anatomy",
      "foreign biological traits",
      "specialized appendages",
      "novel defensive structures",
      "predatory adaptations",
      "unusual body geometry",
    ],

    tags: [
      "hybrid",
      "splice",
      "horns",
      "shell",
      "claws",
      "adaptation",
    ],
  },

  Elemental: {
    id: "Elemental",

    label: "Elemental Research",

    description:
      "Focuses on the specimen's elemental biology and the development of specialized glands, organs, tissues, or structures related to elemental expression.",

    familyWeights: {
      ...NEUTRAL_FAMILY_WEIGHTS,

      Elemental: 2.8,
      Metabolic: 1.35,
      Offensive: 1.25,
      Defensive: 1.1,

      Structural: 0.9,
      Neural: 0.9,
      Mobility: 0.9,
      "Cross-Species": 0.75,
      Wildcard: 0.8,
    },

    phenotypeThemes: [
      "elemental gland development",
      "energy-producing organs",
      "elemental pigmentation",
      "reactive tissues",
      "specialized vents",
      "elemental discharge structures",
    ],

    tags: [
      "element",
      "energy",
      "glands",
      "discharge",
      "reactive",
      "elemental",
    ],
  },

  Defensive: {
    id: "Defensive",

    label: "Defensive Research",

    description:
      "Focuses on survivability through armor, tissue reinforcement, impact resistance, defensive anatomy, and biological resilience.",

    familyWeights: {
      ...NEUTRAL_FAMILY_WEIGHTS,

      Defensive: 2.7,
      Structural: 1.55,
      Metabolic: 1.25,

      Offensive: 0.85,
      Neural: 0.85,
      Mobility: 0.75,
      Elemental: 0.95,
      "Cross-Species": 0.95,
      Wildcard: 0.65,
    },

    phenotypeThemes: [
      "dermal armor",
      "reinforced plating",
      "dense bone growth",
      "impact resistance",
      "protective structures",
      "resilient tissue",
    ],

    tags: [
      "armor",
      "defense",
      "resistance",
      "plating",
      "durability",
      "survival",
    ],
  },

  Offensive: {
    id: "Offensive",

    label: "Offensive Research",

    description:
      "Focuses on attack potential through stronger jaws, claws, horns, musculature, striking anatomy, and destructive biological adaptations.",

    familyWeights: {
      ...NEUTRAL_FAMILY_WEIGHTS,

      Offensive: 2.7,
      Structural: 1.4,
      Metabolic: 1.2,
      Elemental: 1.2,

      Defensive: 0.8,
      Neural: 1.05,
      Mobility: 1.05,
      "Cross-Species": 1,
      Wildcard: 0.7,
    },

    phenotypeThemes: [
      "jaw reinforcement",
      "claw development",
      "predatory musculature",
      "striking anatomy",
      "weaponized skeletal growth",
      "aggressive biological structures",
    ],

    tags: [
      "attack",
      "claws",
      "bite",
      "horns",
      "power",
      "predatory",
    ],
  },

  Mobility: {
    id: "Mobility",

    label: "Mobility Research",

    description:
      "Focuses on speed, agility, balance, locomotion, tendon efficiency, limb geometry, and rapid movement.",

    familyWeights: {
      ...NEUTRAL_FAMILY_WEIGHTS,

      Mobility: 2.7,
      Neural: 1.5,
      Metabolic: 1.3,
      Structural: 1.05,

      Defensive: 0.7,
      Offensive: 1.05,
      Elemental: 0.9,
      "Cross-Species": 1,
      Wildcard: 0.7,
    },

    phenotypeThemes: [
      "elongated limbs",
      "lighter skeletal geometry",
      "reinforced tendons",
      "improved balance",
      "agile body structure",
      "rapid locomotion",
    ],

    tags: [
      "speed",
      "agility",
      "legs",
      "balance",
      "movement",
      "mobility",
    ],
  },

  Wildcard: {
    id: "Wildcard",

    label: "Wildcard Research",

    description:
      "Minimizes directed control and intentionally preserves a broad experimental search space for unusual or unexpected biological outcomes.",

    familyWeights: {
      Structural: 1.15,
      Metabolic: 1.15,
      Neural: 1.15,
      "Cross-Species": 1.25,
      Elemental: 1.15,
      Defensive: 1.15,
      Offensive: 1.15,
      Mobility: 1.15,
      Wildcard: 2.4,
    },

    phenotypeThemes: [
      "unexpected anatomical expression",
      "unclassified biological traits",
      "rare developmental patterns",
      "mixed phenotype expression",
      "unusual genetic activity",
      "unstable morphology",
    ],

    tags: [
      "experimental",
      "unknown",
      "rare",
      "anomaly",
      "unpredictable",
      "wildcard",
    ],
  },
};

/* -------------------------------------------------------------------------- */
/*                              PATH HELPERS                                  */
/* -------------------------------------------------------------------------- */

export const RESEARCH_PATH_LIST =
  Object.values(RESEARCH_PATHS);

/**
 * Returns the complete definition for a research path.
 */
export function getResearchPath(
  path: ResearchPath,
): ResearchPathDefinition {
  return RESEARCH_PATHS[path];
}

/**
 * Returns the raw family multiplier for a selected path.
 *
 * Example:
 *
 * getResearchFamilyWeight("Defensive", "Structural")
 * -> 1.55
 */
export function getResearchFamilyWeight(
  researchPath: ResearchPath,
  mutationFamily: MutationFamily,
): number {
  return (
    RESEARCH_PATHS[researchPath]
      .familyWeights[mutationFamily] ?? 1
  );
}

/**
 * Returns all mutation families ordered from most favored to least favored
 * for the selected path.
 */
export function getRankedFamiliesForPath(
  researchPath: ResearchPath,
) {
  const definition =
    RESEARCH_PATHS[researchPath];

  return Object.entries(
    definition.familyWeights,
  )
    .map(([family, weight]) => ({
      family: family as MutationFamily,
      weight,
    }))
    .sort((a, b) => b.weight - a.weight);
}

/**
 * Gives us an easy way to determine which families count as the major
 * biological directions of a research path.
 *
 * This will be useful for:
 * - research UI
 * - clone reports
 * - formula creation
 * - outcome trees
 */
export function getFavoredFamilies(
  researchPath: ResearchPath,
  minimumWeight = 1.2,
) {
  return getRankedFamiliesForPath(
    researchPath,
  ).filter(
    ({ weight }) =>
      weight >= minimumWeight,
  );
}