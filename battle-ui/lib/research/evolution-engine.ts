// battle-ui/lib/research/evolution-engine.ts

import {
  applyStatChangesPreview,
  type CanonicalResearchResult,
} from "./research-engine";

import type {
  EvolutionLabel,
  EvolutionSnapshot,
  EvolutionStage,
  SpecimenResearchState,
} from "./research-types";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export type AppliedEvolution = {
  specimen: SpecimenResearchState;
  snapshot: EvolutionSnapshot;
  xpSpent: number;
};

/* -------------------------------------------------------------------------- */
/*                                   LABELS                                   */
/* -------------------------------------------------------------------------- */

export function getEvolutionLabel(
  stage: EvolutionStage,
): EvolutionLabel {
  switch (stage) {
    case 0:
      return "GENESIS";
    case 1:
      return "EVO_I";
    case 2:
      return "EVO_II";
    case 3:
      return "EVO_III";
  }
}

/* -------------------------------------------------------------------------- */
/*                                  APPLY                                     */
/* -------------------------------------------------------------------------- */

/**
 * Applies an already-resolved canonical research result to specimen state.
 *
 * Persistence should wrap this in an atomic backend transaction together with:
 * - XP deduction
 * - serum consumption
 * - research-history write
 * - evolution snapshot write
 *
 * Clone research can never be committed here.
 */
export function applyResearchEvolution({
  specimen,
  result,
  image,
  imageCid,
  createdAt,
}: {
  specimen: SpecimenResearchState;
  result: CanonicalResearchResult;
  image?: string;
  imageCid?: string;
  createdAt?: number;
}): AppliedEvolution {
  const { outcome } = result;

  if (outcome.mode === "clone") {
    throw new Error(
      "Clone research is predictive only and cannot be applied to the real specimen.",
    );
  }

  if (
    outcome.previousEvolutionStage !==
    specimen.evolutionStage
  ) {
    throw new Error(
      "Specimen evolution stage changed after research was resolved. Re-run against the current state.",
    );
  }

  if (
    specimen.xp.available <
    result.xpCost
  ) {
    throw new Error(
      `Specimen does not have the ${result.xpCost} XP required to commit this evolution.`,
    );
  }

  const nextBattleStats =
    applyStatChangesPreview(
      specimen.battleStats,
      outcome.statChanges,
    );

  const nextMoves =
    specimen.moves.map(
      (move) => ({
        ...move,
        power: Math.max(
          1,
          Math.round(
            move.power *
              result.movePowerMultiplier,
          ),
        ),
      }),
    );

  const nextMutations = [
    ...specimen.mutations,
    ...outcome.mutations,
    ...(outcome.anomaly
      ? [outcome.anomaly]
      : []),
  ];

  const currentImage =
    imageCid ??
    image ??
    specimen.currentImage;

  const nextSpecimen:
    SpecimenResearchState = {
    ...specimen,
    evolutionStage:
      outcome.nextEvolutionStage,
    xp: {
      lifetime:
        specimen.xp.lifetime,
      spent:
        specimen.xp.spent +
        result.xpCost,
      available:
        specimen.xp.available -
        result.xpCost,
    },
    battleStats:
      nextBattleStats,
    moves: nextMoves,
    mutations: nextMutations,
    currentImage,
  };

  const snapshot:
    EvolutionSnapshot = {
    tokenId:
      specimen.tokenId,
    stage:
      outcome.nextEvolutionStage,
    label:
      getEvolutionLabel(
        outcome.nextEvolutionStage,
      ),
    createdAt:
      createdAt ??
      outcome.completedAt,
    image:
      image ??
      specimen.currentImage,
    imageCid,
    level:
      specimen.level,
    battleStats:
      nextBattleStats,
    moves:
      nextMoves,
    mutations:
      nextMutations,
    phenotypeInfluences:
      outcome.phenotypeInfluences,
    researchId:
      outcome.researchId,
    serumId:
      outcome.serumId,
  };

  return {
    specimen: nextSpecimen,
    snapshot,
    xpSpent: result.xpCost,
  };
}
