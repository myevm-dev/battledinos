"use client";

import { useState } from "react";
import {
  ChevronRight,
  CircleDollarSign,
  Dna,
  Images,
  ScanSearch,
  Wrench,
} from "lucide-react";

import { AppNavigation } from "@/components/battle-dinos/nav";
import { SpecimenDex } from "@/components/battle-dinos/specimen-dex";

type LabTab =
  | "dex"
  | "owned"
  | "evolve"
  | "repair"
  | "earn";

const labTabs = [
  {
    id: "dex" as const,
    label: "Specimen Dex",
    description: "View collection",
    icon: ScanSearch,
  },
  {
    id: "owned" as const,
    label: "Owned",
    description: "Your specimens",
    icon: Images,
  },
  {
    id: "evolve" as const,
    label: "Evolve",
    description: "Develop specimens",
    icon: Dna,
  },
  {
    id: "repair" as const,
    label: "Repair",
    description: "Restore condition",
    icon: Wrench,
  },
  {
    id: "earn" as const,
    label: "Earn",
    description: "XP and rewards",
    icon: CircleDollarSign,
  },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] =
    useState<LabTab>("dex");

  /*
   * TEMPORARY
   *
   * Later this comes from the connected wallet.
   *
   * These examples make the Owned Gallery visible
   * while you're building the UI.
   */
  const ownedBaseIds = [
    1,
    7,
    8,
    14,
    21,
    108,
  ];

  return (
    <div className="min-h-screen bg-[#050708] pb-24 text-[#e8e4db] md:pb-0">
      <AppNavigation />

      <main className="mx-auto max-w-[1500px] px-3 py-3 sm:px-4 lg:h-[calc(100vh-76px)] lg:overflow-hidden xl:px-6">
        <div className="grid gap-3 lg:h-full lg:grid-cols-[230px_minmax(0,1fr)]">
          {/* LEFT LAB SIDEBAR */}
          <aside className="rounded-xl border border-[#292823] bg-[#080a0b] p-2 lg:h-full">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:h-full lg:flex-col">
              {labTabs.map((tab) => {
                const Icon = tab.icon;
                const active =
                  activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() =>
                      setActiveTab(tab.id)
                    }
                    className={`group flex min-h-[76px] items-center gap-3 rounded-lg border px-3 py-3 text-left transition lg:min-h-[82px] ${
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

              {/* LAB IDENTITY */}
              <div className="mt-auto hidden border-t border-[#292823] px-3 pb-2 pt-4 lg:block">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#7d8c58]" />

                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#696e6f]">
                    Lab Online
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

          {/* ACTIVE LAB AREA */}
          <section className="bd-scrollbar min-h-[520px] overflow-y-auto overflow-x-hidden rounded-xl border border-[#292823] bg-[#080a0b] lg:h-full lg:min-h-0">
            {activeTab === "dex" && (
              <SpecimenDex
                ownedBaseIds={ownedBaseIds}
              />
            )}

            {activeTab === "owned" && (
              <SpecimenDex
                ownedBaseIds={ownedBaseIds}
                ownedOnly
              />
            )}

            {activeTab !== "dex" &&
              activeTab !== "owned" && (
                <ComingSoonPanel
                  tab={activeTab}
                />
              )}
          </section>
        </div>
      </main>
    </div>
  );
}

function ComingSoonPanel({
  tab,
}: {
  tab: Exclude<
    LabTab,
    "dex" | "owned"
  >;
}) {
  const content = {
    evolve: {
      eyebrow: "Development",
      title: "Evolution Chamber",
      description:
        "Develop specimens into unique evolutionary forms.",
      icon: Dna,
    },

    repair: {
      eyebrow: "Recovery",
      title: "Repair Station",
      description:
        "Restore specimen condition after combat trials.",
      icon: Wrench,
    },

    earn: {
      eyebrow: "Progression",
      title: "Earn",
      description:
        "Earn XP and future rewards through specimen activity.",
      icon: CircleDollarSign,
    },
  };

  const item = content[tab];
  const Icon = item.icon;

  return (
    <div className="flex h-full min-h-[520px] flex-col p-4 sm:p-5">
      <PanelHeader
        eyebrow={item.eyebrow}
        title={item.title}
        text={item.description}
        icon={Icon}
      />

      <div className="mt-4 flex min-h-0 flex-1 items-center justify-center rounded-xl border border-dashed border-[#34322c] bg-[#050708]">
        <div className="max-w-md px-6 text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-xl border border-[#a97826]/30 bg-[#a97826]/[0.06] text-[#d2a143]">
            <Icon size={27} />
          </div>

          <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-[#806b47]">
            Project 333
          </p>

          <h2 className="mt-2 text-2xl font-black uppercase tracking-[0.05em] text-[#dedad1]">
            Coming Soon
          </h2>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#777c7d]">
            This system is currently under
            development and will become
            available in a future release.
          </p>
        </div>
      </div>
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