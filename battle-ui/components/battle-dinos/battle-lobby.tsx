"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Lock,
  Swords,
} from "lucide-react";

import { AppNavigation } from "./nav";

type Arena = {
  id: string;
  name: string;
  subtitle: string;
  image: string;
};

const arenas: Arena[] = [
  {
    id: "frostfang",
    name: "Frostfang Arena",
    subtitle: "Frozen Combat Zone",
    image: "/arenas/frostfang-arena.png",
  },
  {
    id: "stormforge",
    name: "Stormforge Caldera",
    subtitle: "Volcanic Combat Zone",
    image: "/arenas/stormforge-caldera.png",
  },
  {
    id: "skyfall",
    name: "Skyfall Coliseum",
    subtitle: "High Altitude Arena",
    image: "/arenas/skyfall-coliseum.png",
  },
  {
    id: "sunscorch",
    name: "Sunscorch Citadel",
    subtitle: "Desert Combat Zone",
    image: "/arenas/sunscorch-citadel.png",
  },
  {
    id: "verdant-maw",
    name: "Verdant Maw",
    subtitle: "Overgrown Combat Zone",
    image: "/arenas/verdant-maw-arena.png",
  },
];

const activeSpecimen = {
  baseId: 108,
  name: "Vortexwarden",
  image: "/dinos/108.png",
};

export function BattleLobby() {
  const [arenaIndex, setArenaIndex] = useState(0);

  const arena = arenas[arenaIndex];

  const previousArena = useCallback(() => {
    setArenaIndex((current) =>
      current === 0 ? arenas.length - 1 : current - 1
    );
  }, []);

  const nextArena = useCallback(() => {
    setArenaIndex((current) =>
      current === arenas.length - 1 ? 0 : current + 1
    );
  }, []);

  /* KEYBOARD ARROWS */
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        previousArena();
      }

      if (event.key === "ArrowRight") {
        nextArena();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [previousArena, nextArena]);

  /* AUTO ROTATE */
  useEffect(() => {
    const interval = window.setInterval(() => {
      nextArena();
    }, 4000);

    return () => {
      window.clearInterval(interval);
    };
  }, [nextArena]);

  return (
    <div className="min-h-screen bg-[#050708] text-[#e8e4db]">
      <AppNavigation />

      <main
        className="
          mx-auto max-w-[1700px] px-3 py-3
          lg:grid
          lg:h-[calc(100vh-76px)]
          lg:grid-rows-[minmax(0,1.45fr)_72px_minmax(0,0.75fr)]
          lg:gap-3
          lg:overflow-hidden
          xl:px-6
        "
      >
        {/* TOP MATCHUP */}
        <section className="relative min-h-[480px] lg:min-h-0">
          <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2">
            <p className="whitespace-nowrap text-[10px] font-black uppercase tracking-[0.3em] text-[#806b47]">
              Project 333 / Combat Division
            </p>
          </div>

          <div className="grid h-full gap-3 pt-7 lg:grid-cols-[280px_minmax(0,1fr)_280px]">
            <SpecimenCard />

            <ArenaCarousel
              arena={arena}
              arenaIndex={arenaIndex}
              onPrevious={previousArena}
              onNext={nextArena}
              onSelect={setArenaIndex}
            />

            <UnknownOpponent />
          </div>
        </section>

        {/* MODE TOGGLES */}
        <section className="mt-3 grid gap-2 md:grid-cols-2 lg:mt-0">
          <ModeToggle
            label="1v1 Duel"
            detail="Match against another queued specimen."
            selected
          />

          <ModeToggle
            label="Arena Run"
            detail="Three consecutive combat trials."
            disabled
          />
        </section>

        {/* LOWER COMPONENT */}
        <section className="mt-3 min-h-[260px] lg:mt-0 lg:min-h-0">
          <BattleControlPanel />
        </section>
      </main>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* YOUR SPECIMEN                                                              */
/* -------------------------------------------------------------------------- */

function SpecimenCard() {
  return (
    <button
      type="button"
      className="group relative min-h-[300px] overflow-hidden rounded-xl border border-[#a97826]/45 bg-[#080a0b] text-left lg:min-h-0"
    >
      <Image
        src={activeSpecimen.image}
        alt={activeSpecimen.name}
        fill
        priority
        sizes="280px"
        className="object-cover transition duration-500 group-hover:scale-[1.02]"
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_28%,rgba(0,0,0,0.96))]" />

      <div className="absolute left-3 top-3 rounded-md border border-[#a97826]/30 bg-black/65 px-3 py-1.5 backdrop-blur">
        <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#d2a143]">
          Your Specimen
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="font-mono text-[10px] font-bold text-[#a17d43]">
          #{String(activeSpecimen.baseId).padStart(3, "0")}
        </p>

        <h2 className="mt-1 truncate text-xl font-black uppercase tracking-[0.03em] text-white">
          {activeSpecimen.name}
        </h2>

        <p className="mt-1 text-xs text-[#8d9192]">
          Active combat specimen
        </p>
      </div>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* ARENAS                                                                     */
/* -------------------------------------------------------------------------- */

function ArenaCarousel({
  arena,
  arenaIndex,
  onPrevious,
  onNext,
  onSelect,
}: {
  arena: Arena;
  arenaIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
}) {
  return (
    <section className="relative min-h-[340px] overflow-hidden rounded-xl border border-[#383329] bg-[#080a0b] lg:min-h-0">
      <Image
        key={arena.id}
        src={arena.image}
        alt={arena.name}
        fill
        priority
        sizes="1000px"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.10)_45%,rgba(0,0,0,0.92))]" />

      <div className="absolute left-4 top-4 rounded-md border border-white/10 bg-black/70 px-3 py-1.5 backdrop-blur-md">
        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#d2a143]">
          Arena
        </p>
      </div>

      {/* LEFT */}
      <button
        type="button"
        onClick={onPrevious}
        aria-label="Previous arena"
        className="absolute left-4 top-1/2 z-20 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/70 text-white backdrop-blur transition hover:border-[#d2a143] hover:bg-black"
      >
        <ChevronLeft size={24} />
      </button>

      {/* RIGHT */}
      <button
        type="button"
        onClick={onNext}
        aria-label="Next arena"
        className="absolute right-4 top-1/2 z-20 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/70 text-white backdrop-blur transition hover:border-[#d2a143] hover:bg-black"
      >
        <ChevronRight size={24} />
      </button>

      {/* ARENA NAME */}
      <div className="absolute inset-x-0 bottom-0 p-5 text-center">
        <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#c18e35]">
          Selected Environment
        </p>

        <h1 className="mt-1 text-2xl font-black uppercase tracking-[0.05em] text-white xl:text-3xl">
          {arena.name}
        </h1>

        <p className="mt-1 text-xs text-[#a1a4a4]">
          {arena.subtitle}
        </p>

        {/* DOTS */}
        <div className="mt-3 flex justify-center gap-2">
          {arenas.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(index)}
              aria-label={`Select ${item.name}`}
              className={`h-1.5 rounded-full transition-all ${
                index === arenaIndex
                  ? "w-7 bg-[#d2a143]"
                  : "w-1.5 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* UNKNOWN OPPONENT                                                           */
/* -------------------------------------------------------------------------- */

function UnknownOpponent() {
  return (
    <section className="relative min-h-[300px] overflow-hidden rounded-xl border border-[#292823] bg-[#080a0b] lg:min-h-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(169,120,38,0.10),transparent_40%)]" />

      <div className="absolute left-3 top-3 rounded-md border border-[#34332f] bg-black/60 px-3 py-1.5">
        <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#767a7b]">
          Opponent
        </p>
      </div>

      <div className="relative flex h-full min-h-[300px] flex-col items-center justify-center text-center lg:min-h-0">
        <div className="relative grid size-28 place-items-center rounded-full border border-[#34332f] bg-[#050708]">
          <span className="select-none text-7xl font-black leading-none text-[#393b39]">
            ?
          </span>

          <HelpCircle
            size={21}
            className="absolute bottom-2 right-2 text-[#806b47]"
          />
        </div>

        <h2 className="mt-5 text-xl font-black uppercase tracking-[0.05em] text-[#d7d3cb]">
          Unknown
        </h2>

        <p className="mt-1 text-xs text-[#666b6c]">
          Awaiting matchmaking
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* MODE TOGGLES                                                               */
/* -------------------------------------------------------------------------- */

function ModeToggle({
  label,
  detail,
  selected = false,
  disabled = false,
}: {
  label: string;
  detail: string;
  selected?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`flex h-[72px] items-center gap-3 rounded-xl border px-4 text-left transition ${
        disabled
          ? "cursor-not-allowed border-[#242526] bg-[#08090a] opacity-40"
          : selected
            ? "border-[#a97826]/60 bg-[#a97826]/[0.07]"
            : "border-[#292823] bg-[#080a0b]"
      }`}
    >
      <div
        className={`grid size-9 shrink-0 place-items-center rounded-lg border ${
          selected && !disabled
            ? "border-[#a97826]/40 bg-[#a97826]/[0.08] text-[#d2a143]"
            : "border-[#323435] text-[#747879]"
        }`}
      >
        {disabled ? (
          <Lock size={16} />
        ) : (
          <Swords size={17} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-black uppercase tracking-[0.04em] text-[#e5e1d8]">
            {label}
          </h3>

          {disabled && (
            <span className="rounded border border-[#454545] px-1.5 py-0.5 text-[7px] font-black uppercase tracking-[0.08em] text-[#777]">
              Disabled
            </span>
          )}
        </div>

        <p className="mt-0.5 truncate text-[11px] text-[#707576]">
          {detail}
        </p>
      </div>

      {!disabled && (
        <ChevronRight
          size={16}
          className="shrink-0 text-[#806b47]"
        />
      )}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* LOWER COMPONENT                                                            */
/* -------------------------------------------------------------------------- */

function BattleControlPanel() {
  return (
    <div className="flex h-full min-h-[220px] items-center justify-center rounded-xl border border-[#292823] bg-[#080a0b] lg:min-h-0">
      <div className="text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#806b47]">
          Lobby
        </p>

        <h2 className="mt-2 text-xl font-black uppercase tracking-[0.05em] text-[#dedad1]">
          Battle Controls
        </h2>

        <p className="mt-2 text-sm text-[#666b6c]">
          .
        </p>
      </div>
    </div>
  );
}