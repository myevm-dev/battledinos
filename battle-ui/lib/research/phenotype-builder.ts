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
  SpecimenResearchState,
} from "./research-types";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

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
  mustPreserve: string[];
  newTraits: string[];
  biologicalContext: string[];
  avoid: string[];
  prompt: string;
};

/* -------------------------------------------------------------------------- */
/*                                  BUILDER                                   */
/* -------------------------------------------------------------------------- */

export function buildEvolutionPhenotypePlan({
  specimen,
  result,
  currentVisualDescription,
  baseImagePrompt,
}: PhenotypeBuildInput): EvolutionPhenotypePlan {
  const existingMutationDefinitions =
    specimen.mutations
      .map((mutation) =>
        getResearchMutationById(
          mutation.mutationId,
        ),
      )
      .filter(
        (mutation): mutation is NonNullable<typeof mutation> =>
          mutation !== undefined,
      );

  const newMutationDefinitions =
    result.mutationDetails.map(
      (detail) => detail.mutation,
    );

  const mustPreserve = Array.from(
    new Set([
      ...(currentVisualDescription
        ? [currentVisualDescription]
        : []),
      ...existingMutationDefinitions.flatMap(
        (mutation) =>
          mutation
            ? [
                mutation.visualEffect,
                ...(Array.isArray(
                  mutation.evolutionInfluence,
                )
                  ? mutation.evolutionInfluence
                  : [
                      mutation.evolutionInfluence,
                    ]),
              ]
            : [],
      ),
    ]),
  ).filter(
    (value): value is string =>
      typeof value === "string" &&
      value.length > 0,
  );

  const newTraits = Array.from(
    new Set([
      ...result.outcome
        .phenotypeInfluences,
      ...newMutationDefinitions.map(
        (mutation) =>
          mutation.visualEffect,
      ),
    ]),
  ).filter(
    (value): value is string =>
      typeof value === "string" &&
      value.length > 0,
  );

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
    `Predictability: ${Math.round(
      result.predictability * 100,
    )}%`,
  ].filter(
    (value): value is string =>
      typeof value === "string" &&
      value.length > 0,
  );

  const avoid = [
    "Do not redesign the creature as an unrelated species.",
    "Do not remove established lineage-defining traits.",
    "Do not repeat the same new mutation visually multiple times just to make the evolution look stronger.",
    "Do not add unexplained anatomy that is not supported by the specimen lineage or current research result.",
    "Do not change the official combat result or game statistics through artwork.",
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

  const promptParts = [
    "Create the next canonical visual evolution of this SPECIMEN collectible.",
    baseImagePrompt
      ? `Original template context: ${baseImagePrompt}`
      : "",
    currentVisualDescription
      ? `Current visible form: ${currentVisualDescription}`
      : "",
    `Transition: ${previousStage} to ${stage}.`,
    `Preserve the identity of ${specimen.name} and make the new form clearly recognizable as the same individual organism after biological development.`,
    mustPreserve.length
      ? `Inherited traits that must remain visible in some recognizable form: ${mustPreserve.join(
          "; ",
        )}.`
      : "",
    newTraits.length
      ? `Newly expressed traits from this research: ${newTraits.join(
          "; ",
        )}.`
      : "No major visible mutation expressed. Evolve maturity and anatomy subtly without inventing unrelated traits.",
    `Elemental identity: ${specimen.element}.`,
    "The evolution should compound prior development rather than resetting to the Genesis creature.",
    "Use a high-detail collectible creature presentation consistent with the existing SPECIMEN visual universe.",
  ].filter(
    (value): value is string =>
      typeof value === "string" &&
      value.length > 0,
  );

  return {
    specimenTokenId:
      specimen.tokenId,
    stage,
    previousStage,
    mustPreserve,
    newTraits,
    biologicalContext,
    avoid,
    prompt:
      promptParts.join(" "),
  };
}
