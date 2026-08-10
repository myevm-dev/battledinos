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
  const [selectedMode, setSelectedMode] = useState<BattleModeId>("duel");

  const activeMode = battleModes.find((mode) => mode.id === selectedMode)!;

  return (
    <div className="min-h-screen bg-[#040a10] pb-24 md:pb-0">
      <AppNavigation />

      <main>
        <section className="relative isolate overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 -z-20">
            <Image
              src="/arenas/stormforge-caldera.png"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center opacity-35"
            />
          </div>
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(3,8,13,0.35),#050b12_93%)]" />

          <div className="mx-auto max-w-[1500px] px-4 pb-8 pt-10 sm:px-6 md:pb-10 md:pt-14 xl:px-10">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-amber-300">
                <Radio size={12} />
                Arena Network Online
              </div>
              <h1 className="bd-title text-4xl font-black text-white sm:text-5xl md:text-6xl">
                Battle Lobby
              </h1>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                Choose a battle format, lock in your fighter, and let the battle
                engine determine what happens in the arena.
              </p>
            </div>

            <div className="mx-auto mt-8 grid max-w-5xl gap-3 md:grid-cols-2">
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

        <div className="mx-auto grid max-w-[1500px] gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[320px_minmax(0,1fr)] xl:px-10">
          <div className="space-y-4">
            <SelectedDinoCard />

            <section className="bd-panel rounded-2xl p-4 sm:p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                Lobby Status
              </p>

              <div className="mt-4 rounded-xl border border-lime-400/15 bg-lime-500/[0.06] p-4">
                <div className="flex items-center gap-2 text-sm font-black text-lime-400">
                  <span className="size-2 rounded-full bg-lime-400 shadow-[0_0_10px_rgba(163,230,53,0.8)]" />
                  Ready to Battle
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  {selectedMode === "duel"
                    ? "Your dino can match against another fighter already waiting in the queue."
                    : "Your dino will face three fighters pulled from the active arena pool."}
                </p>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <StatusStat
                  icon={UsersRound}
                  label={selectedMode === "duel" ? "Queued Dinos" : "Arena Pool"}
                  value={selectedMode === "duel" ? "27" : "86"}
                />
                <StatusStat
                  icon={Clock3}
                  label="Typical Start"
                  value={selectedMode === "duel" ? "< 1 min" : "Instant"}
                />
              </div>
            </section>
          </div>

          <div className="min-w-0 space-y-4">
            <section className="bd-panel overflow-hidden rounded-2xl">
              <div className="grid lg:grid-cols-[1fr_310px]">
                <div className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-amber-400/20 bg-amber-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-amber-300">
                      Selected Mode
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {activeMode.availability}
                    </span>
                  </div>

                  <h2 className="mt-4 text-2xl font-black text-white sm:text-3xl">
                    {activeMode.title}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                    {activeMode.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2 text-xs">
                    <InfoPill>Verifiable battle seed</InfoPill>
                    <InfoPill>Weighted move selection</InfoPill>
                    <InfoPill>AI battle replay</InfoPill>
                  </div>
                </div>

                <div className="flex flex-col justify-center border-t border-white/[0.07] bg-black/20 p-5 lg:border-l lg:border-t-0">
                  <button className="group flex w-full items-center justify-between rounded-xl border border-amber-300/50 bg-gradient-to-r from-amber-600/30 to-orange-500/20 px-4 py-4 text-left shadow-[0_0_30px_rgba(242,165,38,0.1)] transition hover:border-amber-300/80 hover:from-amber-600/40">
                    <span>
                      <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-amber-300">
                        Enter Arena
                      </span>
                      <span className="mt-1 block text-base font-black text-white">
                        Queue Vortexwarden
                      </span>
                    </span>
                    <span className="grid size-9 place-items-center rounded-full bg-amber-400 text-black transition group-hover:translate-x-0.5">
                      <ChevronRight size={19} />
                    </span>
                  </button>

                  <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
                    <ShieldCheck size={12} />
                    No wager required in this UI mockup
                  </div>
                </div>
              </div>
            </section>

            <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
              <RecentBattles />
              <ArenaPreview />
            </div>

            <section className="bd-panel overflow-hidden rounded-2xl p-4 sm:p-5">
              <div className="grid gap-4 sm:grid-cols-3">
                <FooterStat label="Season" value="Genesis I" detail="Dino Dominance" />
                <FooterStat label="Battle Rating" value="1,247" detail="Top 31%" />
                <FooterStat label="Rewards" value="245 XP" detail="This season" />
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
    <div className="rounded-xl border border-white/[0.06] bg-black/20 p-3">
      <Icon size={15} className="text-slate-500" />
      <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-600">
        {label}
      </p>
      <p className="mt-1 text-sm font-black text-white">{value}</p>
    </div>
  );
}

function InfoPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 font-semibold text-slate-400">
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
    <div className="rounded-xl border border-white/[0.06] bg-black/15 p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-600">
        {label}
      </p>
      <p className="mt-1 text-lg font-black text-white">{value}</p>
      <p className="mt-0.5 text-xs text-slate-500">{detail}</p>
    </div>
  );
}
