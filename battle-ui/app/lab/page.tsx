"use client";

import { useState, type ReactNode } from "react";
import {
  ChevronRight,
  Database,
  Dna,
  FlaskConical,
  Gauge,
  Layers3,
  LockKeyhole,
  Microscope,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  TestTube2,
} from "lucide-react";

import { AppNavigation } from "@/components/battle-dinos/nav";
import { SpecimenDex } from "@/components/battle-dinos/specimen-dex";

import {
  DISCOVERY_HOURS_BY_RARITY,
  DISCOVERY_PATHS,
} from "@/lib/research/discovery-config";

import {
  createLabResearchState,
  getPathResearchHours,
  getUnlockedDiscoveryRarities,
} from "@/lib/research/lab-research";

import {
  RESEARCH_DURATION_CONFIG,
  getResearchXpCost,
} from "@/lib/research/research-config";

import { RESEARCH_PATHS } from "@/lib/research/research-paths";

import type { LabResearchState } from "@/lib/research/discovery-types";
import type {
  MutationRarity,
  ResearchDurationDays,
  ResearchIntensity,
  ResearchMode,
  ResearchPath,
} from "@/lib/research/research-types";

type LabTab =
  | "dex"
  | "research"
  | "discoveries"
  | "formulas"
  | "serums"
  | "evolve";

const labTabs = [
  {
    id: "dex" as const,
    label: "Specimen Dex",
    description: "Genesis registry",
    icon: ScanSearch,
  },
  {
    id: "research" as const,
    label: "Research",
    description: "Run experiments",
    icon: Microscope,
  },
  {
    id: "discoveries" as const,
    label: "Discoveries",
    description: "Known biology",
    icon: Dna,
  },
  {
    id: "formulas" as const,
    label: "Formulas",
    description: "Research strategies",
    icon: Database,
  },
  {
    id: "serums" as const,
    label: "Serums",
    description: "Manufactured formulas",
    icon: TestTube2,
  },
  {
    id: "evolve" as const,
    label: "Evolve",
    description: "Develop lineage",
    icon: Sparkles,
  },
];

const pathDescriptions: Record<ResearchPath, string> = {
  Structural: "Frame, armor, bone, and morphology",
  Metabolic: "Regeneration, endurance, and biological chemistry",
  Neural: "Reflexes, sensing, cognition, and response",
  "Cross-Species": "Hybridized traits across biological lines",
  Elemental: "Adaptations linked to elemental affinity",
  Defensive: "Durability, barriers, protection, and survival",
  Offensive: "Damage-oriented anatomical and biological traits",
  Mobility: "Speed, agility, movement, and locomotion",
  Wildcard: "Broad, less constrained discovery direction",
};

const rarityOrder: MutationRarity[] = [
  "Common",
  "Uncommon",
  "Rare",
  "Epic",
  "Legendary",
];

const durationLabels: Record<
  ResearchDurationDays,
  { title: string; detail: string }
> = {
  3: {
    title: "Experimental",
    detail: "Wide variance and fast iteration",
  },
  7: {
    title: "Standard",
    detail: "Baseline research commitment",
  },
  30: {
    title: "Deep Research",
    detail: "High control and stronger evidence",
  },
  90: {
    title: "Long-Term Study",
    detail: "Maximum predictability and depth",
  },
};

const intensityLabels: Record<
  ResearchIntensity,
  { title: string; detail: string }
> = {
  low: {
    title: "Low",
    detail: "Safer expression, lower anomaly pressure",
  },
  standard: {
    title: "Standard",
    detail: "Balanced research profile",
  },
  high: {
    title: "High",
    detail: "More aggressive expression and risk",
  },
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<LabTab>("research");

  /**
   * Replace this local initial state with the wallet's persisted LabResearchState
   * once Firebase loading is wired in.
   */
  const [lab] = useState<LabResearchState>(() =>
    createLabResearchState({
      labId: "uninitialized-lab",
    }),
  );

  return (
    <div className="min-h-screen bg-[#050708] pb-24 text-[#e8e4db] md:pb-0">
      <AppNavigation />

      <main className="mx-auto max-w-[1550px] px-3 py-3 sm:px-4 lg:h-[calc(100vh-76px)] lg:overflow-hidden xl:px-6">
        <div className="grid gap-3 lg:h-full lg:grid-cols-[240px_minmax(0,1fr)]">
          <LabSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            lab={lab}
          />

          <section className="min-h-[620px] overflow-hidden rounded-xl border border-[#292823] bg-[#080a0b] lg:h-full lg:min-h-0">
            {activeTab === "dex" && <DexPanel />}

            {activeTab === "research" && (
              <ResearchPanel lab={lab} />
            )}

            {activeTab === "discoveries" && (
              <DiscoveriesPanel lab={lab} />
            )}

            {activeTab === "formulas" && (
              <FormulasPanel lab={lab} />
            )}

            {activeTab === "serums" && <SerumsPanel />}

            {activeTab === "evolve" && <EvolvePanel />}
          </section>
        </div>
      </main>
    </div>
  );
}

function LabSidebar({
  activeTab,
  setActiveTab,
  lab,
}: {
  activeTab: LabTab;
  setActiveTab: (tab: LabTab) => void;
  lab: LabResearchState;
}) {
  return (
    <aside className="rounded-xl border border-[#292823] bg-[#080a0b] p-2 lg:h-full lg:overflow-y-auto">
      <div className="grid grid-cols-2 gap-2 lg:flex lg:min-h-full lg:flex-col">
        <div className="col-span-2 rounded-lg border border-[#2f2d27] bg-[#050708] p-3 lg:mb-1">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#806b47]">
                Research Lab
              </p>

              <p className="mt-1 text-xl font-black text-[#dedad1]">
                Level {lab.researchLevel}
              </p>
            </div>

            <div className="grid size-11 place-items-center rounded-lg border border-[#a97826]/30 bg-[#a97826]/[0.06] text-[#d2a143]">
              <FlaskConical size={20} />
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <MiniSidebarStat
              label="Hours"
              value={formatNumber(lab.totalResearchHours)}
            />
            <MiniSidebarStat
              label="Known"
              value={formatNumber(lab.discoveredMutationIds.length)}
            />
          </div>
        </div>

        {labTabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`group flex min-h-[76px] items-center gap-3 rounded-lg border px-3 py-3 text-left transition lg:min-h-[78px] ${
                active
                  ? "border-[#a97826]/55 bg-[#a97826]/[0.08]"
                  : "border-transparent bg-[#050708] hover:border-[#34322c]"
              }`}
            >
              <div
                className={`grid size-10 shrink-0 place-items-center rounded-lg border ${
                  active
                    ? "border-[#a97826]/40 bg-[#a97826]/[0.08] text-[#d2a143]"
                    : "border-[#292823] text-[#666b6c]"
                }`}
              >
                <Icon size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className={`text-xs font-black uppercase tracking-[0.05em] ${
                    active
                      ? "text-[#e5dfd3]"
                      : "text-[#96999a]"
                  }`}
                >
                  {tab.label}
                </p>

                <p className="mt-1 hidden text-[11px] text-[#626768] sm:block">
                  {tab.description}
                </p>
              </div>

              <ChevronRight
                size={15}
                className={`hidden lg:block ${
                  active
                    ? "text-[#d2a143]"
                    : "text-[#414546]"
                }`}
              />
            </button>
          );
        })}

        <div className="col-span-2 mt-auto hidden border-t border-[#292823] px-3 pb-2 pt-4 lg:block">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#7d8c58]" />

            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#696e6f]">
              Research Engine Ready
            </p>
          </div>

          <p className="mt-2 text-[10px] leading-4 text-[#515657]">
            Project 333
            <br />
            Genesis Research System
          </p>
        </div>
      </div>
    </aside>
  );
}

function DexPanel() {
  return (
    <div className="h-full overflow-y-auto">
      <SpecimenDex />
    </div>
  );
}

function ResearchPanel({
  lab,
}: {
  lab: LabResearchState;
}) {
  const [primaryPath, setPrimaryPath] =
    useState<ResearchPath>("Defensive");

  const [secondaryPath, setSecondaryPath] =
    useState<ResearchPath | "">("");

  const [durationDays, setDurationDays] =
    useState<ResearchDurationDays>(7);

  const [intensity, setIntensity] =
    useState<ResearchIntensity>("standard");

  const [mode, setMode] =
    useState<Extract<ResearchMode, "standard" | "clone">>(
      "standard",
    );

  const durationConfig =
    RESEARCH_DURATION_CONFIG[durationDays];

  const currentPathHours =
    getPathResearchHours(lab, primaryPath);

  const unlockedRarities =
    getUnlockedDiscoveryRarities(currentPathHours);

  const baseHours = durationDays * 24;

  const creditedPrimaryHours =
    mode === "clone" ? 0 : baseHours;

  const creditedSecondaryHours =
    mode === "clone" || !secondaryPath
      ? 0
      : baseHours * 0.25;

  const xpCost =
    mode === "clone"
      ? null
      : getResearchXpCost({
          durationDays,
          intensity,
          evolutionStage: 0,
        });

  const nextGate = rarityOrder.find(
    (rarity) =>
      DISCOVERY_HOURS_BY_RARITY[rarity] >
      currentPathHours,
  );

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto p-4 sm:p-5">
      <PanelHeader
        eyebrow="Development"
        title="Research"
        text="Choose the experiment. Mutations remain outcomes rather than direct purchases."
        icon={Microscope}
      />

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <ResearchSection
            number="01"
            title="Select Specimen"
            text="Research acts on one owned individual Genesis specimen and its current lineage."
          >
            <div className="rounded-xl border border-dashed border-[#3a362f] bg-[#050708] p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="grid size-14 shrink-0 place-items-center rounded-xl border border-[#a97826]/30 bg-[#a97826]/[0.06] text-[#d2a143]">
                    <Dna size={25} />
                  </div>

                  <div>
                    <p className="font-black uppercase tracking-[0.04em] text-[#dedad1]">
                      No Specimen Selected
                    </p>

                    <p className="mt-1 max-w-xl text-sm leading-6 text-[#777c7d]">
                      Connect this control to the owned individual edition
                      selector. Research should never run against a shared
                      Project 333 base template.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="shrink-0 rounded-lg border border-[#a97826]/45 bg-[#a97826]/[0.07] px-4 py-3 text-xs font-black uppercase tracking-[0.07em] text-[#d2a143] transition hover:border-[#d2a143]/70"
                >
                  Select Specimen
                </button>
              </div>
            </div>
          </ResearchSection>

          <ResearchSection
            number="02"
            title="Primary Research Path"
            text="The primary path receives 100% of elapsed canonical research hours."
          >
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {DISCOVERY_PATHS.map((path) => {
                const active = primaryPath === path;
                const hours =
                  getPathResearchHours(lab, path);

                return (
                  <button
                    key={path}
                    type="button"
                    onClick={() => {
                      setPrimaryPath(path);

                      if (secondaryPath === path) {
                        setSecondaryPath("");
                      }
                    }}
                    className={`rounded-lg border p-4 text-left transition ${
                      active
                        ? "border-[#a97826]/60 bg-[#a97826]/[0.08]"
                        : "border-[#292823] bg-[#050708] hover:border-[#3a3730]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p
                          className={`text-sm font-black uppercase tracking-[0.04em] ${
                            active
                              ? "text-[#e3d4b8]"
                              : "text-[#c1bdb4]"
                          }`}
                        >
                          {path}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#6f7475]">
                          {pathDescriptions[path]}
                        </p>
                      </div>

                      <span className="font-mono text-xs font-black text-[#9b8053]">
                        {formatHours(hours)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </ResearchSection>

          <ResearchSection
            number="03"
            title="Secondary Path"
            text="Optional secondary work receives 25% research-hour credit."
          >
            <select
              value={secondaryPath}
              onChange={(event) =>
                setSecondaryPath(
                  event.target.value as
                    | ResearchPath
                    | "",
                )
              }
              className="w-full rounded-lg border border-[#34322c] bg-[#050708] px-4 py-3 text-sm font-semibold text-[#c6c1b8] outline-none transition focus:border-[#a97826]/60"
            >
              <option value="">
                No secondary path
              </option>

              {DISCOVERY_PATHS.filter(
                (path) => path !== primaryPath,
              ).map((path) => (
                <option key={path} value={path}>
                  {RESEARCH_PATHS[path].label}
                </option>
              ))}
            </select>
          </ResearchSection>

          <ResearchSection
            number="04"
            title="Duration"
            text="Longer studies improve control and evidence quality rather than simply making stronger specimens."
          >
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {(
                [3, 7, 30, 90] as ResearchDurationDays[]
              ).map((days) => {
                const config =
                  RESEARCH_DURATION_CONFIG[days];

                const active =
                  durationDays === days;

                return (
                  <button
                    key={days}
                    type="button"
                    onClick={() =>
                      setDurationDays(days)
                    }
                    className={`rounded-lg border p-4 text-left transition ${
                      active
                        ? "border-[#a97826]/60 bg-[#a97826]/[0.08]"
                        : "border-[#292823] bg-[#050708] hover:border-[#3a3730]"
                    }`}
                  >
                    <p className="text-2xl font-black text-[#d2a143]">
                      {days}D
                    </p>

                    <p className="mt-2 text-xs font-black uppercase tracking-[0.05em] text-[#c8c2b7]">
                      {durationLabels[days].title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#6f7475]">
                      {durationLabels[days].detail}
                    </p>

                    <div className="mt-3 border-t border-[#292823] pt-3">
                      <p className="text-xs text-[#7e8384]">
                        Predictability{" "}
                        <span className="font-black text-[#c6b58f]">
                          {Math.round(
                            config.predictability * 100,
                          )}
                          %
                        </span>
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </ResearchSection>

          <ResearchSection
            number="05"
            title="Intensity"
            text="Intensity changes expression pressure, stability, rarity weighting, anomaly risk, and XP cost."
          >
            <div className="grid gap-2 md:grid-cols-3">
              {(
                [
                  "low",
                  "standard",
                  "high",
                ] as ResearchIntensity[]
              ).map((value) => {
                const active =
                  intensity === value;

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setIntensity(value)
                    }
                    className={`rounded-lg border p-4 text-left transition ${
                      active
                        ? "border-[#a97826]/60 bg-[#a97826]/[0.08]"
                        : "border-[#292823] bg-[#050708] hover:border-[#3a3730]"
                    }`}
                  >
                    <p className="text-sm font-black uppercase tracking-[0.05em] text-[#d7d1c7]">
                      {
                        intensityLabels[value]
                          .title
                      }
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#6f7475]">
                      {
                        intensityLabels[value]
                          .detail
                      }
                    </p>
                  </button>
                );
              })}
            </div>
          </ResearchSection>

          <ResearchSection
            number="06"
            title="Research Mode"
            text="Clone research is predictive intelligence and earns zero canonical discovery hours."
          >
            <div className="grid gap-2 md:grid-cols-2">
              <ModeCard
                active={mode === "standard"}
                onClick={() =>
                  setMode("standard")
                }
                title="Canonical Research"
                detail="Changes the real specimen after trusted completion and can contribute to discovery."
                icon={FlaskConical}
              />

              <ModeCard
                active={mode === "clone"}
                onClick={() => setMode("clone")}
                title="Clone Research"
                detail="Predictive simulation only. No specimen mutation and no canonical research-hour credit."
                icon={Layers3}
              />
            </div>
          </ResearchSection>

          <ResearchSection
            number="07"
            title="Serum"
            text="Serums narrow biological direction without guaranteeing one exact mutation."
          >
            <div className="rounded-lg border border-[#292823] bg-[#050708] p-4">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-lg border border-[#34322c] text-[#806b47]">
                  <TestTube2 size={18} />
                </div>

                <div>
                  <p className="text-sm font-black uppercase tracking-[0.04em] text-[#c8c2b7]">
                    No Serum Selected
                  </p>

                  <p className="mt-1 text-xs text-[#6f7475]">
                    Manufactured formula inventory will appear here once serum persistence is connected.
                  </p>
                </div>
              </div>
            </div>
          </ResearchSection>
        </div>

        <div className="space-y-3 xl:sticky xl:top-0 xl:self-start">
          <div className="rounded-xl border border-[#a97826]/30 bg-[#a97826]/[0.05] p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#9b8053]">
              Experiment Summary
            </p>

            <h3 className="mt-2 text-xl font-black uppercase tracking-[0.04em] text-[#dedad1]">
              {primaryPath}
            </h3>

            <p className="mt-1 text-sm text-[#777c7d]">
              {durationDays}-day{" "}
              {mode === "clone"
                ? "clone study"
                : "canonical study"}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <SummaryStat
                label="Predictability"
                value={`${Math.round(
                  durationConfig.predictability *
                    100,
                )}%`}
              />

              <SummaryStat
                label="XP Cost"
                value={
                  xpCost === null
                    ? "Clone"
                    : formatNumber(xpCost)
                }
              />

              <SummaryStat
                label="Primary Credit"
                value={formatHours(
                  creditedPrimaryHours,
                )}
              />

              <SummaryStat
                label="Secondary Credit"
                value={formatHours(
                  creditedSecondaryHours,
                )}
              />
            </div>

            <div className="mt-4 rounded-lg border border-[#292823] bg-[#050708] p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase tracking-[0.06em] text-[#74797a]">
                  Current {primaryPath} Depth
                </span>

                <span className="font-mono text-xs font-black text-[#d2a143]">
                  {formatHours(
                    currentPathHours,
                  )}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {rarityOrder.map((rarity) => {
                  const unlocked =
                    unlockedRarities.includes(
                      rarity,
                    );

                  return (
                    <span
                      key={rarity}
                      className={`rounded-md border px-2 py-1 text-[10px] font-black uppercase tracking-[0.05em] ${
                        unlocked
                          ? "border-[#7d8c58]/30 bg-[#7d8c58]/[0.07] text-[#9fae77]"
                          : "border-[#292823] bg-[#090b0c] text-[#505455]"
                      }`}
                    >
                      {rarity}
                    </span>
                  );
                })}
              </div>

              <p className="mt-3 text-xs leading-5 text-[#686d6e]">
                {nextGate
                  ? `Next eligibility gate: ${nextGate} at ${formatHours(
                      DISCOVERY_HOURS_BY_RARITY[
                        nextGate
                      ],
                    )}.`
                  : "All authored rarity tiers are eligible in this path."}
              </p>
            </div>

            <button
              type="button"
              disabled
              className="mt-4 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-[#6b5428]/35 bg-[#6b5428]/[0.06] px-4 py-3 text-sm font-black uppercase tracking-[0.07em] text-[#75664e]"
            >
              <LockKeyhole size={16} />
              Select Specimen To Begin
            </button>
          </div>

          <div className="rounded-xl border border-[#292823] bg-[#050708] p-4">
            <div className="flex items-center gap-3">
              <ShieldCheck
                size={18}
                className="text-[#8d9168]"
              />

              <p className="text-xs font-black uppercase tracking-[0.08em] text-[#aaa69d]">
                Canonical Guardrail
              </p>
            </div>

            <p className="mt-3 text-xs leading-5 text-[#686d6e]">
              The browser should create the request, not decide the outcome. Final completion, seed handling, XP spending, discovery, and evolution persistence should resolve through trusted backend logic.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DiscoveriesPanel({
  lab,
}: {
  lab: LabResearchState;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto p-4 sm:p-5">
      <PanelHeader
        eyebrow="Knowledge"
        title="Mutation Discoveries"
        text="The authored mutation universe begins hidden. This lab only sees biology it has documented."
        icon={Dna}
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <InfoBox
          label="Known Mutations"
          value={formatNumber(
            lab.discoveredMutationIds.length,
          )}
          text="Canonical mutations documented by this lab."
        />

        <InfoBox
          label="Experiments"
          value={formatNumber(
            lab.totalExperiments,
          )}
          text="Completed canonical research studies."
        />

        <InfoBox
          label="Research Hours"
          value={formatNumber(
            lab.totalResearchHours,
          )}
          text="Cumulative credited path research."
        />

        <InfoBox
          label="Research Level"
          value={`Level ${lab.researchLevel}`}
          text="Broad laboratory maturity indicator."
        />
      </div>

      <div className="mt-4 rounded-xl border border-[#292823] bg-[#050708] p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.1em] text-[#8d7958]">
              Path Research Depth
            </p>

            <p className="mt-1 text-sm text-[#727778]">
              Hours unlock rarity eligibility. They do not guarantee a discovery.
            </p>
          </div>

          <Gauge
            size={20}
            className="text-[#806b47]"
          />
        </div>

        <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {DISCOVERY_PATHS.map((path) => (
            <PathDepthCard
              key={path}
              path={path}
              hours={getPathResearchHours(
                lab,
                path,
              )}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-[#292823] bg-[#050708] p-4">
        <p className="text-xs font-black uppercase tracking-[0.1em] text-[#8d7958]">
          Discovery Archive
        </p>

        {lab.discoveries.length === 0 ? (
          <div className="mt-4 flex min-h-[220px] items-center justify-center rounded-lg border border-dashed border-[#34322c] bg-[#07090a] p-6 text-center">
            <div className="max-w-md">
              <Dna
                size={34}
                className="mx-auto text-[#5f513b]"
              />

              <h3 className="mt-4 text-lg font-black uppercase tracking-[0.05em] text-[#c8c2b7]">
                No Discoveries Recorded
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#6f7475]">
                Complete canonical research to accumulate path hours and create discovery opportunities.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            {[...lab.discoveries]
              .reverse()
              .map((discovery) => (
                <div
                  key={discovery.discoveryId}
                  className="rounded-lg border border-[#292823] bg-[#090b0c] p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-black text-[#dedad1]">
                        {discovery.mutationName}
                      </p>

                      <p className="mt-1 text-xs text-[#717677]">
                        {discovery.family} ·{" "}
                        {discovery.rarity} ·{" "}
                        {discovery.pathAlignment}
                      </p>
                    </div>

                    <span className="rounded-md border border-[#a97826]/30 bg-[#a97826]/[0.05] px-2 py-1 text-[10px] font-black uppercase tracking-[0.06em] text-[#b88a3b]">
                      {discovery.firstGlobalDiscovery
                        ? "Global First"
                        : "Documented"}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FormulasPanel({
  lab,
}: {
  lab: LabResearchState;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto p-4 sm:p-5">
      <PanelHeader
        eyebrow="Applied Research"
        title="Formulas"
        text="Formulas save repeatable research strategies built from documented biological knowledge."
        icon={Database}
      />

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="rounded-xl border border-[#292823] bg-[#050708] p-5">
          <div className="flex items-start gap-4">
            <div className="grid size-12 shrink-0 place-items-center rounded-xl border border-[#a97826]/30 bg-[#a97826]/[0.06] text-[#d2a143]">
              <Database size={21} />
            </div>

            <div>
              <h3 className="text-xl font-black uppercase tracking-[0.05em] text-[#dedad1]">
                Formula Library
              </h3>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#777c7d]">
                Lab-created formulas can broadly favor mutation families. Specific mutation targeting should only be available for mutations this lab has actually discovered.
              </p>
            </div>
          </div>

          <div className="mt-5 flex min-h-[260px] items-center justify-center rounded-lg border border-dashed border-[#34322c] bg-[#07090a] p-6 text-center">
            <div className="max-w-md">
              <p className="text-3xl font-black text-[#d2a143]">
                {lab.discoveredMutationIds.length}
              </p>

              <p className="mt-2 text-xs font-black uppercase tracking-[0.08em] text-[#8e8b84]">
                Known Mutation Targets
              </p>

              <p className="mt-3 text-sm leading-6 text-[#6f7475]">
                Formula creation becomes more precise as the laboratory documents more biology and collects repeatable research evidence.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <InfoBox
            label="Stage 1"
            value="Experimental"
            text="New research strategy with limited evidence."
          />

          <InfoBox
            label="Stage 2"
            value="Observed"
            text="Repeated outcomes begin building confidence."
          />

          <InfoBox
            label="Stage 3"
            value="Certified"
            text="Established formula with sufficient supporting evidence."
          />

          <div className="rounded-xl border border-[#292823] bg-[#050708] p-4">
            <p className="text-xs leading-5 text-[#686d6e]">
              Refinement should create a new formula version rather than silently making an old formula stronger.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SerumsPanel() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto p-4 sm:p-5">
      <PanelHeader
        eyebrow="Manufacturing"
        title="Serums"
        text="A serum is a usable manufactured instance of a formula."
        icon={TestTube2}
      />

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <PrincipleCard
          icon={FlaskConical}
          title="Direction"
          text="Serums strengthen a known biological direction or phenotype cluster."
        />

        <PrincipleCard
          icon={Gauge}
          title="Predictability"
          text="Longer studies give a compatible serum more opportunity to influence the result."
        />

        <PrincipleCard
          icon={Dna}
          title="Diversity"
          text="Exact mutation and final phenotype remain variable rather than guaranteed."
        />
      </div>

      <div className="mt-4 flex min-h-[320px] items-center justify-center rounded-xl border border-dashed border-[#34322c] bg-[#050708] p-6 text-center">
        <div className="max-w-lg">
          <TestTube2
            size={38}
            className="mx-auto text-[#806b47]"
          />

          <h3 className="mt-4 text-xl font-black uppercase tracking-[0.05em] text-[#dedad1]">
            No Serum Inventory
          </h3>

          <p className="mt-2 text-sm leading-6 text-[#777c7d]">
            Serum batches can be connected here after formula persistence, manufacturing, ownership, and inventory rules are added.
          </p>
        </div>
      </div>
    </div>
  );
}

function EvolvePanel() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto p-4 sm:p-5">
      <PanelHeader
        eyebrow="Development"
        title="Evolution Chamber"
        text="Evolution creates a new lineage snapshot from completed research and the specimen's inherited history."
        icon={Sparkles}
      />

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <EvolutionStageCard
          stage="Genesis"
          detail="Original individual specimen"
          active
        />

        <EvolutionStageCard
          stage="EVO I"
          detail="First developed form"
        />

        <EvolutionStageCard
          stage="EVO II"
          detail="Builds from EVO I"
        />

        <EvolutionStageCard
          stage="EVO III"
          detail="Final major stage"
        />
      </div>

      <div className="mt-4 grid min-h-[360px] gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex items-center justify-center rounded-xl border border-dashed border-[#34322c] bg-[#050708] p-6 text-center">
          <div className="max-w-lg">
            <div className="mx-auto grid size-16 place-items-center rounded-xl border border-[#a97826]/30 bg-[#a97826]/[0.06] text-[#d2a143]">
              <Dna size={29} />
            </div>

            <h3 className="mt-4 text-xl font-black uppercase tracking-[0.05em] text-[#dedad1]">
              Complete Research First
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#777c7d]">
              EVO I should be created from the real specimen's current genetics, completed research outcome, expressed mutations, and phenotype guidance. Later stages inherit prior evolution rather than rerolling from Genesis.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <InfoBox
            label="Lineage"
            value="Preserved"
            text="Earlier evolution snapshots remain part of the specimen archive."
          />

          <InfoBox
            label="Phenotype"
            value="Hierarchical"
            text="Primary visual mutation, optional secondary influence, then inherited lineage."
          />

          <InfoBox
            label="Rollback"
            value="Archive"
            text="A valid earlier snapshot can become active again without rewriting history."
          />
        </div>
      </div>
    </div>
  );
}

function PathDepthCard({
  path,
  hours,
}: {
  path: ResearchPath;
  hours: number;
}) {
  const unlocked =
    getUnlockedDiscoveryRarities(hours);

  const nextRarity = rarityOrder.find(
    (rarity) =>
      DISCOVERY_HOURS_BY_RARITY[rarity] >
      hours,
  );

  const nextHours = nextRarity
    ? DISCOVERY_HOURS_BY_RARITY[nextRarity]
    : hours;

  const progress =
    nextRarity && nextHours > 0
      ? Math.min(100, (hours / nextHours) * 100)
      : 100;

  return (
    <div className="rounded-lg border border-[#292823] bg-[#090b0c] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.04em] text-[#c8c2b7]">
            {path}
          </p>

          <p className="mt-1 text-xs text-[#64696a]">
            {unlocked.length} rarity tier
            {unlocked.length === 1 ? "" : "s"} eligible
          </p>
        </div>

        <span className="font-mono text-xs font-black text-[#d2a143]">
          {formatHours(hours)}
        </span>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#181a1b]">
        <div
          className="h-full rounded-full bg-[#a97826]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-2 text-[11px] text-[#5f6465]">
        {nextRarity
          ? `${nextRarity} eligibility at ${formatHours(
              DISCOVERY_HOURS_BY_RARITY[
                nextRarity
              ],
            )}`
          : "All launch rarity gates reached"}
      </p>
    </div>
  );
}

function EvolutionStageCard({
  stage,
  detail,
  active = false,
}: {
  stage: string;
  detail: string;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        active
          ? "border-[#a97826]/45 bg-[#a97826]/[0.06]"
          : "border-[#292823] bg-[#050708]"
      }`}
    >
      <p
        className={`text-xs font-black uppercase tracking-[0.08em] ${
          active
            ? "text-[#d2a143]"
            : "text-[#74797a]"
        }`}
      >
        {stage}
      </p>

      <p className="mt-2 text-sm font-semibold text-[#aaa69d]">
        {detail}
      </p>
    </div>
  );
}

function ModeCard({
  active,
  onClick,
  title,
  detail,
  icon: Icon,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  detail: string;
  icon: typeof Dna;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border p-4 text-left transition ${
        active
          ? "border-[#a97826]/60 bg-[#a97826]/[0.08]"
          : "border-[#292823] bg-[#050708] hover:border-[#3a3730]"
      }`}
    >
      <Icon
        size={19}
        className={
          active
            ? "text-[#d2a143]"
            : "text-[#686d6e]"
        }
      />

      <p className="mt-3 text-sm font-black uppercase tracking-[0.05em] text-[#d7d1c7]">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-[#6f7475]">
        {detail}
      </p>
    </button>
  );
}

function PrincipleCard({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Dna;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-[#292823] bg-[#050708] p-5">
      <Icon
        size={22}
        className="text-[#d2a143]"
      />

      <h3 className="mt-4 text-lg font-black uppercase tracking-[0.04em] text-[#dedad1]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#777c7d]">
        {text}
      </p>
    </div>
  );
}

function ResearchSection({
  number,
  title,
  text,
  children,
}: {
  number: string;
  title: string;
  text: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[#292823] bg-[#07090a] p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="grid size-8 shrink-0 place-items-center rounded-md border border-[#a97826]/30 bg-[#a97826]/[0.05] text-[10px] font-black text-[#d2a143]">
          {number}
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.06em] text-[#d7d1c7]">
            {title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-[#6f7475]">
            {text}
          </p>
        </div>
      </div>

      <div className="mt-4">{children}</div>
    </div>
  );
}

function PanelHeader({
  eyebrow,
  title,
  text,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  text: string;
  icon: typeof Dna;
}) {
  return (
    <div className="flex shrink-0 items-center gap-4 border-b border-[#292823] pb-4">
      <div className="grid size-11 shrink-0 place-items-center rounded-lg border border-[#a97826]/30 bg-[#a97826]/[0.06] text-[#d2a143]">
        <Icon size={20} />
      </div>

      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#806b47]">
          {eyebrow}
        </p>

        <h2 className="mt-0.5 text-2xl font-black uppercase tracking-[0.04em] text-[#dedad1]">
          {title}
        </h2>

        <p className="mt-0.5 text-sm text-[#777c7d]">
          {text}
        </p>
      </div>
    </div>
  );
}

function InfoBox({
  label,
  value,
  text,
}: {
  label: string;
  value: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-[#292823] bg-[#050708] p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#70695e]">
        {label}
      </p>

      <p className="mt-2 text-lg font-black uppercase text-[#dedad1]">
        {value}
      </p>

      <p className="mt-1 text-xs leading-5 text-[#6f7475]">
        {text}
      </p>
    </div>
  );
}

function SummaryStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-[#292823] bg-[#050708] p-3">
      <p className="text-[9px] font-black uppercase tracking-[0.1em] text-[#666b6c]">
        {label}
      </p>

      <p className="mt-1 text-lg font-black text-[#d8d2c7]">
        {value}
      </p>
    </div>
  );
}

function MiniSidebarStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-[#292823] bg-[#090b0c] px-2 py-2">
      <p className="text-[8px] font-black uppercase tracking-[0.1em] text-[#5f6465]">
        {label}
      </p>

      <p className="mt-1 text-sm font-black text-[#aaa69d]">
        {value}
      </p>
    </div>
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(
    Math.round(value),
  );
}

function formatHours(value: number) {
  if (!Number.isFinite(value)) return "0h";

  if (Math.abs(value - Math.round(value)) < 0.001) {
    return `${formatNumber(value)}h`;
  }

  return `${value.toFixed(1)}h`;
}