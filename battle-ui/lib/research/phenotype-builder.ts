// battle-ui/lib/research/phenotype-builder.ts

import {
  getResearchMutationById,
} from "./mutation-library-adapter";

import {
  getEvolutionLabel,
} from "./evolution-engine";

import type {
  CanonicalResearchResult,
} from "./research-engine";

import type {
  MutationExpression,
  MutationRarity,
  SpecimenResearchState,
} from "./research-types";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export type PhenotypeExpressionBand =
  | "Subtle"
  | "Visible"
  | "Pronounced"
  | "Dominant";

export type PhenotypeMutationInfluence = {
  mutationId: string;
  mutationName: string;
  rarity: MutationRarity;
  family: string;
  expressionBand: PhenotypeExpressionBand;
  visualHint?: string;
  evolutionHints: string[];
};

export type PhenotypeBuildInput = {
  specimen: SpecimenResearchState;
  result: CanonicalResearchResult;

  /**
   * Optional description of the currently visible creature.
   * Useful when the image model cannot directly consume the previous image.
   */
  currentVisualDescription?: string;

  /**
   * Optional canonical base/template image prompt.
   */
  baseImagePrompt?: string;
};

export type EvolutionPhenotypePlan = {
  specimenTokenId: number;
  stage: string;
  previousStage: string;

  /**
   * Existing lineage anchors. Kept deliberately short to avoid asking the AI
   * to mash every historical mutation into the same frame.
   */
  mustPreserve: string[];

  primaryVisualMutation?: PhenotypeMutationInfluence;
  secondaryVisualMutation?: PhenotypeMutationInfluence;

  /**
   * Mechanical/new mutations that do not need to become an obvious visual
   * feature in this image. They remain part of the specimen state and can
   * influence later development.
   */
  latentMutations: string[];

  newTraits: string[];
  biologicalContext: string[];
  avoid: string[];
  prompt: string;
};

/* -------------------------------------------------------------------------- */
/*                              EXPRESSION BAND                               */
/* -------------------------------------------------------------------------- */

export function getPhenotypeExpressionBand(
  strength: number,
): PhenotypeExpressionBand {
  if (strength >= 0.8) {
    return "Dominant";
  }

  if (strength >= 0.6) {
    return "Pronounced";
  }

  if (strength >= 0.4) {
    return "Visible";
  }

  return "Subtle";
}

const RARITY_VISUAL_PRIORITY: Record<
  MutationRarity,
  number
> = {
  Common: 1,
  Uncommon: 1.15,
  Rare: 1.4,
  Epic: 1.75,
  Legendary: 2.2,
};

function mutationVisualPriority(
  expression: MutationExpression,
) {
  return (
    RARITY_VISUAL_PRIORITY[
      expression.rarity
    ] *
    (0.55 +
      expression.expressionStrength *
        0.45)
  );
}

function toPhenotypeInfluence(
  expression: MutationExpression,
): PhenotypeMutationInfluence | undefined {
  const mutation =
    getResearchMutationById(
      expression.mutationId,
    );

  if (!mutation) {
    return undefined;
  }

  const evolutionHints =
    Array.isArray(
      mutation.evolutionInfluence,
    )
      ? mutation.evolutionInfluence
      : mutation.evolutionInfluence
        ? [mutation.evolutionInfluence]
        : [];

  return {
    mutationId: mutation.id,
    mutationName: mutation.name,
    rarity: expression.rarity,
    family: expression.family,
    expressionBand:
      getPhenotypeExpressionBand(
        expression.expressionStrength,
      ),
    visualHint:
      mutation.visualEffect ||
      mutation.description,
    evolutionHints,
  };
}

/* -------------------------------------------------------------------------- */
/*                          EXISTING LINEAGE ANCHORS                          */
/* -------------------------------------------------------------------------- */

function buildLineageAnchors(
  specimen: SpecimenResearchState,
) {
  return [...specimen.mutations]
    .sort(
      (a, b) =>
        mutationVisualPriority(b) -
        mutationVisualPriority(a),
    )
    .slice(0, 3)
    .map(toPhenotypeInfluence)
    .filter(
      (
        influence,
      ): influence is PhenotypeMutationInfluence =>
        influence !== undefined,
    );
}

/* -------------------------------------------------------------------------- */
/*                              NEW VISUAL DRIVERS                            */
/* -------------------------------------------------------------------------- */

function selectNewVisualDrivers(
  result: CanonicalResearchResult,
) {
  const expressions = [
    ...result.outcome.mutations,
    ...(result.outcome.anomaly
      ? [result.outcome.anomaly]
      : []),
  ];

  const ranked = expressions
    .map((expression) => ({
      expression,
      influence:
        toPhenotypeInfluence(
          expression,
        ),
      score:
        mutationVisualPriority(
          expression,
        ),
    }))
    .filter(
      (
        item,
      ): item is typeof item & {
        influence: PhenotypeMutationInfluence;
      } =>
        item.influence !==
        undefined,
    )
    .sort(
      (a, b) => b.score - a.score,
    );

  const primary =
    ranked[0]?.influence;

  /**
   * At most one secondary visual driver. This is the central anti-mashup
   * guardrail for evolved artwork.
   */
  const secondary =
    ranked[1]?.influence;

  const latent = ranked
    .slice(2)
    .map(
      ({ influence }) =>
        influence.mutationName,
    );

  return {
    primary,
    secondary,
    latent,
  };
}

function describeInfluence(
  influence: PhenotypeMutationInfluence,
) {
  const hints = [
    influence.visualHint,
    ...influence.evolutionHints,
  ]
    .filter(
      (value): value is string =>
        Boolean(value?.trim()),
    )
    .slice(0, 3)
    .join("; ");

  return `${influence.mutationName} (${influence.expressionBand}): ${
    hints ||
    "interpret the biological adaptation organically for this individual"
  }`;
}

/* -------------------------------------------------------------------------- */
/*                                  BUILDER                                   */
/* -------------------------------------------------------------------------- */

export function buildEvolutionPhenotypePlan({
  specimen,
  result,
  currentVisualDescription,
  baseImagePrompt,
}: PhenotypeBuildInput): EvolutionPhenotypePlan {
  const lineageAnchors =
    buildLineageAnchors(
      specimen,
    );

  const newDrivers =
    selectNewVisualDrivers(
      result,
    );

  const mustPreserve = Array.from(
    new Set([
      ...(currentVisualDescription
        ? [currentVisualDescription]
        : []),
      ...lineageAnchors.map(
        describeInfluence,
      ),
    ]),
  );

  const newTraits = [
    ...(newDrivers.primary
      ? [
          describeInfluence(
            newDrivers.primary,
          ),
        ]
      : []),
    ...(newDrivers.secondary
      ? [
          describeInfluence(
            newDrivers.secondary,
          ),
        ]
      : []),
  ];

  const biologicalContext = [
    `Specimen: ${specimen.name}`,
    specimen.species
      ? `Species lineage: ${specimen.species}`
      : "",
    `Element: ${specimen.element}`,
    `Research path: ${result.outcome.path}`,
    result.outcome.secondaryPath
      ? `Secondary research path: ${result.outcome.secondaryPath}`
      : "",
    `Research duration: ${result.outcome.durationDays} days`,
    `Research intensity: ${result.outcome.intensity}`,
    `Research predictability: ${Math.round(
      result.predictability * 100,
    )}%`,
  ].filter(Boolean);

  const avoid = [
    "Do not redesign the creature as an unrelated species.",
    "Do not remove established lineage-defining traits.",
    "Do not visualize every mechanical mutation at once.",
    "Do not interpret expression-strength decimals as simple color shades or repeated copies of the same anatomy.",
    "Do not cover the creature with unrelated horns, crystals, armor, spikes, glowing eyes, and other features just because multiple mutations exist.",
    "Do not copy one predetermined anatomy pattern for every specimen with the same mutation.",
    "Do not change official combat statistics through artwork.",
  ];

  const previousStage =
    getEvolutionLabel(
      result.outcome
        .previousEvolutionStage,
    );

  const stage =
    getEvolutionLabel(
      result.outcome
        .nextEvolutionStage,
    );

  const primaryInstruction =
    newDrivers.primary
      ? `Primary new visual driver: ${describeInfluence(
          newDrivers.primary,
        )}. Treat this as biological inspiration, not a rigid prefab design. Choose anatomy, placement, texture, scale, and shape that make sense for this specimen's species, element, existing body plan, and prior lineage.`
      : "No major new visual driver was expressed. Develop maturity and anatomy subtly without inventing unrelated features.";

  const secondaryInstruction =
    newDrivers.secondary
      ? `Secondary visual influence: ${describeInfluence(
          newDrivers.secondary,
        )}. Keep it subordinate to the primary visual driver.`
      : "";

  const latentInstruction =
    newDrivers.latent.length
      ? `Other newly acquired mutations (${newDrivers.latent.join(
          ", ",
        )}) are mechanically real but should remain latent, internal, behavioral, or too subtle to dominate this image.`
      : "";

  const promptParts = [
    "Create the next canonical visual evolution of this SPECIMEN collectible.",
    baseImagePrompt
      ? `Original template context: ${baseImagePrompt}`
      : "",
    currentVisualDescription
      ? `Current visible form: ${currentVisualDescription}`
      : "",
    `Transition: ${previousStage} to ${stage}.`,
    `Preserve the identity of ${specimen.name}. The new form must clearly remain the same individual organism after biological development.`,
    mustPreserve.length
      ? `Important inherited lineage anchors: ${mustPreserve.join(
          "; ",
        )}. Preserve their recognizable influence without mechanically copying every detail.`
      : "",
    primaryInstruction,
    secondaryInstruction,
    latentInstruction,
    `Elemental identity: ${specimen.element}.`,
    "Use qualitative mutation expression such as Subtle, Visible, Pronounced, or Dominant. Do not turn numeric expression values into ten cosmetic shades of the same feature.",
    "Phenotype interpretation should contain individual variation. Two specimens with the same named mutation should be allowed to express it through different anatomically plausible structures, locations, proportions, textures, and developmental patterns.",
    "The evolution should compound prior development rather than resetting to the Genesis creature.",
    "Use a high-detail collectible creature presentation consistent with the existing SPECIMEN visual universe.",
  ].filter(Boolean);

  return {
    specimenTokenId:
      specimen.tokenId,
    stage,
    previousStage,
    mustPreserve,
    primaryVisualMutation:
      newDrivers.primary,
    secondaryVisualMutation:
      newDrivers.secondary,
    latentMutations:
      newDrivers.latent,
    newTraits,
    biologicalContext,
    avoid,
    prompt:
      promptParts.join(" "),
  };
}
