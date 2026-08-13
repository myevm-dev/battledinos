"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  CircleDollarSign,
  Dna,
  FlaskConical,
  HeartPulse,
  ScanSearch,
  Swords,
  Wrench,
} from "lucide-react";


import { AppNavigation } from "@/components/battle-dinos/nav";
import { SpecimenDex } from "@/components/battle-dinos/specimen-dex";

type LabTab = "dex" | "evolve" | "repair" | "earn";

const labTabs = [
  {
    id: "dex" as const,
    label: "Specimen Dex",
    description: "View collection",
    icon: ScanSearch,
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
  const [activeTab, setActiveTab] = useState<LabTab>("dex");

  return (
    <div className="min-h-screen bg-[#050708] pb-24 text-[#e8e4db] md:pb-0">
      <AppNavigation />

      <main className="mx-auto max-w-[1500px] px-3 py-3 sm:px-4 lg:h-[calc(100vh-76px)] lg:overflow-hidden xl:px-6">
        <div className="grid gap-3 lg:h-full lg:grid-cols-[230px_minmax(0,1fr)]">
          {/* LEFT LAB SIDEBAR */}
          <aside className="rounded-xl border border-[#292823] bg-[#080a0b] p-2 lg:h-full">
            <div className="grid grid-cols-2 gap-2 lg:flex lg:h-full lg:flex-col">
              {labTabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`group flex min-h-[76px] items-center gap-3 rounded-lg border px-3 py-3 text-left transition lg:min-h-[88px] ${
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

              {/* LAB IDENTITY AT BOTTOM */}
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
            {activeTab === "dex" && <SpecimenDex />}
            {activeTab === "evolve" && <EvolvePanel />}
            {activeTab === "repair" && <RepairPanel />}
            {activeTab === "earn" && <EarnPanel />}
          </section>
        </div>
      </main>
    </div>
  );
}



function EvolvePanel() {
  return (
    <div className="flex h-full min-h-0 flex-col p-4 sm:p-5">
      <PanelHeader
        eyebrow="Development"
        title="Evolution Chamber"
        text="Develop a specimen into a new individual form."
        icon={Dna}
      />

      <div className="mt-4 grid min-h-0 flex-1 gap-3 md:grid-cols-[minmax(0,1fr)_320px]">
        {/* SPECIMEN */}
        <div className="flex items-center justify-center rounded-xl border border-dashed border-[#34322c] bg-[#050708] p-5">
          <div className="max-w-md text-center">
            <div className="mx-auto grid size-16 place-items-center rounded-xl border border-[#a97826]/30 bg-[#a97826]/[0.06] text-[#d2a143]">
              <Dna size={28} />
            </div>

            <h2 className="mt-4 text-xl font-black uppercase tracking-[0.05em] text-[#dedad1]">
              Select A Specimen
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#777c7d]">
              Evolution uses the specimen&apos;s genetics, mutations,
              progression, and existing evolutionary history.
            </p>

            <button className="mt-5 rounded-lg border border-[#a97826]/45 bg-[#a97826]/[0.07] px-5 py-3 text-sm font-black uppercase tracking-[0.07em] text-[#d2a143] transition hover:border-[#d2a143]/70">
              Select Specimen
            </button>
          </div>
        </div>

        {/* EVOLUTION DETAILS */}
        <div className="grid content-start gap-3">
          <InfoBox
            label="Status"
            value="Standby"
            text="No active specimen."
          />

          <InfoBox
            label="Incubation"
            value="Up To 48 Hours"
            text="Major changes require biological stabilization."
          />

          <InfoBox
            label="Phenotype"
            value="Unknown"
            text="The evolved form remains concealed until completion."
          />
        </div>
      </div>
    </div>
  );
}

function RepairPanel() {
  return (
    <div className="flex h-full min-h-0 flex-col p-4 sm:p-5">
      <PanelHeader
        eyebrow="Recovery"
        title="Repair"
        text="Restore specimen condition after trials and procedures."
        icon={Wrench}
      />

      <div className="mt-4 flex min-h-0 flex-1 items-center justify-center rounded-xl border border-dashed border-[#34322c] bg-[#050708]">
        <div className="max-w-md px-6 text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-xl border border-[#a97826]/30 bg-[#a97826]/[0.06] text-[#d2a143]">
            <HeartPulse size={28} />
          </div>

          <h2 className="mt-4 text-xl font-black uppercase tracking-[0.05em] text-[#dedad1]">
            Recovery Station
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#777c7d]">
            Select a specimen to inspect its condition and available recovery
            procedures.
          </p>

          <button className="mt-5 rounded-lg border border-[#a97826]/45 bg-[#a97826]/[0.07] px-5 py-3 text-sm font-black uppercase tracking-[0.07em] text-[#d2a143]">
            Select Specimen
          </button>
        </div>
      </div>
    </div>
  );
}

function EarnPanel() {
  return (
    <div className="flex h-full min-h-0 flex-col p-4 sm:p-5">
      <PanelHeader
        eyebrow="Progression"
        title="Earn"
        text="Use your specimens to earn XP and build progression."
        icon={CircleDollarSign}
      />

      <div className="mt-4 grid min-h-0 flex-1 gap-3 md:grid-cols-2">
        <Link
          href="/battle"
          className="group flex flex-col justify-between rounded-xl border border-[#a97826]/30 bg-[#a97826]/[0.05] p-5 transition hover:border-[#d2a143]/60"
        >
          <div>
            <Swords size={26} className="text-[#d2a143]" />

            <h2 className="mt-5 text-2xl font-black uppercase tracking-[0.05em] text-[#dedad1]">
              Combat Trials
            </h2>

            <p className="mt-3 max-w-md text-sm leading-7 text-[#777c7d]">
              Battle specimens to earn XP, strengthen progression, and build
              their official combat history.
            </p>
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm font-black uppercase tracking-[0.08em] text-[#d2a143]">
            Enter Trials
            <ChevronRight
              size={16}
              className="transition group-hover:translate-x-1"
            />
          </div>
        </Link>

        <div className="flex flex-col justify-between rounded-xl border border-[#292823] bg-[#050708] p-5">
          <div>
            <FlaskConical
              size={26}
              className="text-[#806b47]"
            />

            <h2 className="mt-5 text-2xl font-black uppercase tracking-[0.05em] text-[#dedad1]">
              Progression
            </h2>

            <p className="mt-3 max-w-md text-sm leading-7 text-[#777c7d]">
              Earned XP can support leveling, mutation procedures, and future
              evolutionary development.
            </p>
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.08em] text-[#606566]">
            Select a specimen to view progression
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