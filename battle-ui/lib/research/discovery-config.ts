// battle-ui/lib/research/discovery-config.ts

import type {
  MutationRarity,
  ResearchDurationDays,
  ResearchIntensity,
  ResearchPath,
} from "./research-types";

/* -------------------------------------------------------------------------- */
/*                           RESEARCH-HOUR DEPTH                              */
/* -------------------------------------------------------------------------- */

/**
 * Hours unlock ELIGIBILITY for a rarity tier. They never guarantee a
 * discovery and never guarantee a mutation of that rarity.
 *
 * 24h   -> Common biology can be discovered
 * 72h   -> Uncommon biology can be discovered
 * 168h  -> Rare biology can be discovered
 * 720h  -> Epic biology can be discovered
 * 2160h -> Legendary biology can be discovered
 */
export const DISCOVERY_HOURS_BY_RARITY = {
  Common: 24,
  Uncommon: 72,
  Rare: 168,
  Epic: 720,
  Legendary: 2160,
} satisfies Record<MutationRarity, number>;

/**
 * Primary path receives full elapsed research credit.
 * Secondary path receives partial scientific credit because it was not the
 * dominant experimental direction.
 */
export const PRIMARY_RESEARCH_HOUR_CREDIT = 1;
export const SECONDARY_RESEARCH_HOUR_CREDIT = 0.25;

/* -------------------------------------------------------------------------- */
/*                            DISCOVERY OPPORTUNITY                           */
/* -------------------------------------------------------------------------- */

/**
 * One completed real experiment creates one discovery opportunity.
 *
 * Longer studies are more likely to reveal an undocumented signature per
 * completed experiment, while shorter studies remain more efficient per
 * research hour because many more experiments can be completed.
 */
export const BASE_DISCOVERY_CHANCE_BY_DURATION = {
  3: 0.22,
  7: 0.36,
  30: 0.56,
  90: 0.74,
} satisfies Record<ResearchDurationDays, number>;

export const DISCOVERY_INTENSITY_MULTIPLIER = {
  low: 0.9,
  standard: 1,
  high: 1.12,
} satisfies Record<ResearchIntensity, number>;

/**
 * Wildcard work is deliberately better at finding unusual biology, while the
 * rarity and eligibility rules still control what can actually be selected.
 */
export const WILDCARD_DISCOVERY_CHANCE_MULTIPLIER = 1.18;

/**
 * Normal research can occasionally discover biology outside the selected
 * direction. That serendipity falls sharply as duration increases.
 *
 * This is the middle ground between two bad outcomes:
 * - every lab eventually converges on the entire mutation library
 * - research becomes so narrow that every evolved specimen looks the same
 *
 * Wildcard research does not use this restriction.
 */
export const OFF_PATH_DISCOVERY_CHANCE_BY_DURATION = {
  3: 0.25,
  7: 0.15,
  30: 0.08,
  90: 0.04,
} satisfies Record<ResearchDurationDays, number>;

/**
 * A family is considered favored by a path when its path weight is above
 * neutral. The comparison in discovery-weights.ts is strictly greater than
 * this value.
 */
export const FAVORED_DISCOVERY_AFFINITY_THRESHOLD = 1;

/**
 * As a lab documents more of the biology available to its current research
 * direction, novel discoveries naturally become harder to find.
 *
 * This prevents the 600 launch mutations from being exhausted too quickly.
 */
export const DISCOVERY_SATURATION = {
  minimumMultiplier: 0.45,
  strength: 0.55,
};

export const MIN_DISCOVERY_CHANCE = 0.03;
export const MAX_DISCOVERY_CHANCE = 0.88;

/* -------------------------------------------------------------------------- */
/*                           DISCOVERY RARITY                                 */
/* -------------------------------------------------------------------------- */

/**
 * Discovery rarity is intentionally different from mutation-expression
 * rarity. Discovering a new branch of biology is a larger event than later
 * expressing already-known biology.
 *
 * Rarity is rolled BEFORE the exact mutation candidate so the number of
 * mutations authored in each rarity tier cannot distort the intended global
 * distribution.
 */
export const DISCOVERY_RARITY_WEIGHTS = {
  Common: 55,
  Uncommon: 27,
  Rare: 12,
  Epic: 5,
  Legendary: 1,
} satisfies Record<MutationRarity, number>;

/* -------------------------------------------------------------------------- */
/*                           CANDIDATE WEIGHTING                              */
/* -------------------------------------------------------------------------- */

export const ELEMENT_TAG_DISCOVERY_MULTIPLIER = 1.1;

/**
 * During Wildcard research, actual Wildcard-family mutations receive an extra
 * novelty preference without excluding discoveries from other families.
 */
export const WILDCARD_FAMILY_DISCOVERY_MULTIPLIER = 1.3;

/**
 * Secondary-path family weighting matters, but it should remain weaker than
 * the primary research direction.
 */
export const SECONDARY_DISCOVERY_WEIGHT_STRENGTH = 0.35;

/* -------------------------------------------------------------------------- */
/*                             RESEARCH LEVELS                                */
/* -------------------------------------------------------------------------- */

/**
 * Research level is a broad lab-maturity indicator. Hours are still the
 * canonical mutation-rarity eligibility gate.
 *
 * The expanded curve prevents every mature simulation from immediately
 * collapsing into the old level-5 ceiling.
 */
export const LAB_RESEARCH_LEVEL_THRESHOLDS = [
  { level: 1, totalHours: 0 },
  { level: 2, totalHours: 168 },
  { level: 3, totalHours: 720 },
  { level: 4, totalHours: 2160 },
  { level: 5, totalHours: 4320 },
  { level: 6, totalHours: 12960 },
  { level: 7, totalHours: 43200 },
  { level: 8, totalHours: 129600 },
] as const;

/* -------------------------------------------------------------------------- */
/*                               FUTURE FLAGS                                 */
/* -------------------------------------------------------------------------- */

/**
 * Launch should discover from the curated 600-mutation pool only.
 * AI-generated mutation #601+ is a future Wildcard expansion after duplicate
 * detection, repeated observation, and classification exist.
 */
export const ALLOW_GENERATED_MUTATION_DISCOVERY = false;

export const DISCOVERY_PATHS: ResearchPath[] = [
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
