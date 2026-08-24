// battle-ui/lib/research/research-tree.ts

import {
  getResearchMutationById,
} from "./mutation-library-adapter";

import type {
  CloneResearchReport,
} from "./clone-research";

import type {
  ResearchTreeNode,
} from "./research-types";

/* -------------------------------------------------------------------------- */
/*                               CLONE TREE                                   */
/* -------------------------------------------------------------------------- */

export function buildCloneResearchTree(
  report: CloneResearchReport,
): ResearchTreeNode {
  const familyNodes =
    report.familyEstimates.map(
      (family) => {
        const matching =
          report.mutationEstimates
            .filter(
              (mutation) =>
                mutation.family ===
                family.family,
            )
            .slice(0, 8);

        return {
          id:
            `family:${family.family}`,
          label: family.family,
          observedRate:
            family.observedRate,
          count:
            family.occurrences,
          children:
            matching.map(
              (mutation) => ({
                id:
                  `mutation:${mutation.mutationId}`,
                label:
                  getResearchMutationById(
                    mutation.mutationId,
                  )?.name ??
                  mutation.mutationId,
                observedRate:
                  mutation.observedRate,
                count:
                  mutation.occurrences,
              }),
            ),
        } satisfies ResearchTreeNode;
      },
    );

  return {
    id:
      report.cloneResearchId,
    label: "Clone Research",
    observedRate: 1,
    count: report.simulations,
    children: familyNodes,
  };
}

/* -------------------------------------------------------------------------- */
/*                              DISPLAY HELPERS                               */
/* -------------------------------------------------------------------------- */

export function flattenResearchTree(
  root: ResearchTreeNode,
) {
  const rows: Array<{
    depth: number;
    id: string;
    label: string;
    observedRate: number;
    count?: number;
  }> = [];

  function visit(
    node: ResearchTreeNode,
    depth: number,
  ) {
    rows.push({
      depth,
      id: node.id,
      label: node.label,
      observedRate:
        node.observedRate,
      count: node.count,
    });

    for (
      const child
      of node.children ?? []
    ) {
      visit(child, depth + 1);
    }
  }

  visit(root, 0);

  return rows;
}
