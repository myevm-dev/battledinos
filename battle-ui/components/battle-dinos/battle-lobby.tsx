"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ChevronRight,
  Clock3,
  Radio,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import { AppNavigation } from "./nav";
import { ArenaPreview } from "./arena-preview";
import { GameModeCard } from "./game-mode-card";
import { RecentBattles } from "./recent-battles";
import { SelectedDinoCard } from "./selected-dino-card";

import {
  battleModes,
  type BattleModeId,
} from "@/lib/battle-dinos-data";

export function BattleLobby() {
  const [selectedMode, setSelectedMode] =
    useState<BattleModeId>("duel");

  const activeMode = battleModes.find(
    (mode) => mode.id === selectedMode,
  )!;

  return (
    <div className="min-h-screen bg-[#050708] pb-24 text-[#e8e4db] md:pb-0">
      <AppNavigation />

      <main>
        {/* HERO */}
        <section className="relative isolate overflow-hidden border-b border-[#26241f]">
          <div className="absolute inset-0 -z-20">
            <Image
              src="/arenas/stormforge-caldera.png"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center opacity-[0.18] grayscale-[0.35]"
            />
          </div>

          <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(5,7,8,0.48),#050708_94%)]" />

          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_15%,rgba(176,126,39,0.10),transparent_38%)]" />

          <div className="mx-auto max-w-[1500px] px-4 pb-8 pt-10 sm:px-6 md:pb-10 md:pt-14 xl:px-10">
            <div className="mx-auto max-w-3xl text-center">

              <p className="text-[10px] font-black uppercase tracking-[0.34em] text-[#76634a]">
                Project 333 / Combat Division
              </p>

              <h1 className="mt-3 text-4xl font-black uppercase tracking-[0.08em] text-[#e8e4db] sm:text-5xl md:text-6xl">
                Currently Testing
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[#85898b] sm:text-base">
                Select an active specimen and initiate a controlled combat
                trial. Outcomes are resolved by the deterministic trial engine
                before replay reconstruction begins.
              </p>
            </div>

            <div className="mx-auto mt-9 grid max-w-5xl gap-3 md:grid-cols-2">
              {battleModes.map((mode) => (
                <GameModeCard
                  key={mode.id}
                  mode={mode}
                  selected={selectedMode === mode.id}
                  onSelect={setSelectedMode}
                />
              ))}
            </div>
          </div>
        </section>

        {/* MAIN GRID */}
        <div className="mx-auto grid max-w-[1500px] gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[320px_minmax(0,1fr)] xl:px-10">
          {/* LEFT */}
          <div className="space-y-4">
            <SelectedDinoCard />

            <section className="rounded-xl border border-[#292823] bg-[#0a0d0f] p-4 sm:p-5">
              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#6c6559]">
                Trial Status
              </p>

              <div className="mt-4 rounded-lg border border-[#8e702c]/25 bg-[#8e702c]/[0.05] p-4">
                <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-[#d2a143]">
                  <span className="size-1.5 rounded-full bg-[#d2a143] shadow-[0_0_9px_rgba(210,161,67,0.65)]" />
                  Specimen Ready
                </div>

                <p className="mt-2 text-xs leading-5 text-[#7f8384]">
                  {selectedMode === "duel"
                    ? "Active specimen can be paired with another subject currently registered in the trial queue."
                    : "Active specimen will undergo three consecutive encounters selected from the current field pool."}
                </p>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <StatusStat
                  icon={UsersRound}
                  label={
                    selectedMode === "duel"
                      ? "Queued Subjects"
                      : "Field Pool"
                  }
                  value={selectedMode === "duel" ? "27" : "86"}
                />

                <StatusStat
                  icon={Clock3}
                  label="Deployment"
                  value={selectedMode === "duel" ? "< 1 min" : "Immediate"}
                />
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <div className="min-w-0 space-y-4">
            <section className="overflow-hidden rounded-xl border border-[#292823] bg-[#0a0d0f]">
              <div className="grid lg:grid-cols-[1fr_310px]">
                <div className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md border border-[#a97826]/30 bg-[#a97826]/[0.06] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-[#d2a143]">
                      Selected Protocol
                    </span>

 
                  </div>

                  <h2 className="mt-4 text-2xl font-black uppercase tracking-[0.04em] text-[#e6e2da] sm:text-3xl">
                    {activeMode.title}
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#85898b]">
                    {activeMode.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2 text-xs">
                    <InfoPill>Verified trial seed</InfoPill>
                    <InfoPill>Weighted move selection</InfoPill>
                    <InfoPill>Replay reconstruction</InfoPill>
                  </div>
                </div>

                <div className="flex flex-col justify-center border-t border-[#292823] bg-[#080a0b] p-5 lg:border-l lg:border-t-0">
                  <button className="group flex w-full items-center justify-between rounded-lg border border-[#b8842c]/55 bg-[linear-gradient(110deg,rgba(126,85,21,0.23),rgba(77,48,13,0.10))] px-4 py-4 text-left transition hover:border-[#d2a143]/80">
                    <span>
                      <span className="block text-[9px] font-black uppercase tracking-[0.22em] text-[#c79639]">
                        Deploy Specimen
                      </span>

                      <span className="mt-1 block text-base font-black text-[#e8e4db]">
                        Queue Vortexwarden
                      </span>
                    </span>

                    <span className="grid size-9 place-items-center rounded-md border border-[#c99739]/50 bg-[#c99739] text-[#080808] transition group-hover:translate-x-0.5">
                      <ChevronRight size={18} />
                    </span>
                  </button>

                  <div className="mt-3 flex items-center justify-center gap-1.5 text-[9px] uppercase tracking-wide text-[#5f6466]">
                    <ShieldCheck size={11} />
                    Controlled simulation / no wager
                  </div>
                </div>
              </div>
            </section>

            <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
              <RecentBattles />
              <ArenaPreview />
            </div>

            <section className="rounded-xl border border-[#292823] bg-[#0a0d0f] p-4 sm:p-5">
              <div className="grid gap-4 sm:grid-cols-3">
                <FooterStat
                  label="Series"
                  value="Genesis I"
                  detail="Project 333"
                />

                <FooterStat
                  label="Trial Rating"
                  value="1,247"
                  detail="Top 31%"
                />

                <FooterStat
                  label="Research XP"
                  value="245"
                  detail="Current cycle"
                />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatusStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock3;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-[#242521] bg-[#07090a] p-3">
      <Icon size={14} className="text-[#806b46]" />

      <p className="mt-3 text-[9px] font-bold uppercase tracking-[0.18em] text-[#5d6162]">
        {label}
      </p>

      <p className="mt-1 text-sm font-black text-[#dfdcd4]">
        {value}
      </p>
    </div>
  );
}

function InfoPill({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="rounded-md border border-[#302f29] bg-[#111315] px-3 py-1.5 font-semibold text-[#777c7e]">
      {children}
    </span>
  );
}

function FooterStat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-lg border border-[#242521] bg-[#07090a] p-4">
      <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#5d6162]">
        {label}
      </p>

      <p className="mt-1 text-lg font-black text-[#dfdcd4]">
        {value}
      </p>

      <p className="mt-0.5 text-xs text-[#666b6c]">
        {detail}
      </p>
    </div>
  );
}