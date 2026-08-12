"use client";

import { useState } from "react";
import { AppNavigation } from "@/components/battle-dinos/nav";
import {
  Info,
  PackageOpen,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

export default function ShopPage() {
  const [showDistribution, setShowDistribution] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050708] text-[#e8e4db]">
      <AppNavigation />

      <main className="mx-auto max-w-[1400px] px-4 py-4 sm:px-6 xl:px-8">
        <section className="grid gap-4 lg:h-[calc(100vh-108px)] lg:min-h-[590px] lg:grid-cols-[minmax(0,1.08fr)_minmax(460px,0.92fr)]">
          {/* PACK DISPLAY */}
          <div className="relative flex min-h-[460px] items-center justify-center overflow-hidden rounded-xl border border-[#292823] bg-[#030405] lg:min-h-0">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(167,112,31,0.09),transparent_48%)]" />

            <video
              src="/packs/genesispack.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="relative z-10 h-[94%] w-[94%] object-contain"
            />

            <div className="pointer-events-none absolute left-5 top-5 z-20">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#806b47]">
                Project 333
              </p>

              <p className="mt-1 text-sm font-black uppercase tracking-[0.12em] text-[#d0cbc0]">
                Genesis Series
              </p>
            </div>

            <div className="pointer-events-none absolute bottom-5 left-5 z-20">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#806b47]">
                Sealed Issue
              </p>

              <p className="mt-1 text-base font-black uppercase tracking-[0.08em] text-[#e0dcd3]">
                5 Cards
              </p>
            </div>
          </div>

          {/* PRODUCT PANEL */}
          <div className="bd-panel flex min-h-0 flex-col rounded-xl p-6">
            {/* HEADER */}
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#806b47]">
                  Genesis Series
                </p>

                <h1 className="mt-2 text-4xl font-black uppercase tracking-[0.04em] text-[#e7e2d8]">
                  5-Card Pack
                </h1>
              </div>

              <div className="shrink-0 rounded-lg border border-[#a97826]/35 bg-[#a97826]/[0.06] px-5 py-3 text-right">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#806b47]">
                  Pack Supply
                </p>

                <p className="mt-1 text-2xl font-black text-[#d2a143]">
                  7,200
                </p>
              </div>
            </div>

            {/* DESCRIPTION */}
            <p className="mt-5 text-base leading-7 text-[#9a9d9e]">
              Each sealed pack contains five randomly distributed cards from
              the 36,000-card Genesis Series.
            </p>

            {/* MAIN STATS */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <MarketStat
                label="Cards Per Pack"
                value="5"
              />

              <MarketStat
                label="Total Cards"
                value="36,000"
              />
            </div>

            {/* DISTRIBUTION BUTTON */}
            <button
              type="button"
              onClick={() => setShowDistribution(true)}
              className="group mt-5 flex w-full items-center justify-between rounded-lg border border-[#8e702c]/40 bg-[#8e702c]/[0.06] px-5 py-4 text-left transition hover:border-[#d2a143]/70 hover:bg-[#8e702c]/[0.1]"
            >
              <div className="flex items-start gap-3">
                <div className="grid size-9 shrink-0 place-items-center rounded-lg border border-[#8e702c]/35 bg-[#8e702c]/[0.06] text-[#d2a143]">
                  <Info size={17} />
                </div>

                <div>
                  <p className="text-sm font-black uppercase tracking-[0.08em] text-[#ded8cc]">
                    Card Distribution
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#85898b]">
                    See Standard, Reverse Holo, Holo, and 1/1 supply
                  </p>
                </div>
              </div>

              <span className="rounded-md border border-[#a97826]/40 px-3 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#d2a143] transition group-hover:border-[#d2a143]/70">
                View
              </span>
            </button>

            {/* RANDOMIZATION */}
            <div className="mt-5 rounded-lg border border-[#8e702c]/25 bg-[#8e702c]/[0.045] px-5 py-4">
              <div className="flex items-start gap-3">
                <Sparkles
                  size={18}
                  className="mt-0.5 shrink-0 text-[#d2a143]"
                />

                <div>
                  <p className="text-sm font-black uppercase tracking-[0.05em] text-[#dfd7c8]">
                    Every Pack Is Randomized
                  </p>

                  <p className="mt-1 text-sm leading-6 text-[#8c8980]">
                    Each pack contains five randomly selected cards and may
                    include Standard, Reverse Holo, Holo, or 1/1 Alternate Art
                    cards.
                  </p>
                </div>
              </div>
            </div>

            {/* BUY */}
            <div className="mt-6">
              <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#b8842c]/70 bg-[linear-gradient(110deg,rgba(126,85,21,0.38),rgba(77,48,13,0.18))] px-5 py-4 text-base font-black uppercase tracking-[0.1em] text-[#eadfca] shadow-[0_0_25px_rgba(174,118,28,0.05)] transition hover:border-[#d2a143] hover:bg-[#8a5f1d]/20">
                Acquire Genesis Pack
              </button>

              <div className="mt-3 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#666b6c]">
                <ShieldCheck size={12} />
                Wallet connection required
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* DISTRIBUTION MODAL */}
      {showDistribution && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
          onClick={() => setShowDistribution(false)}
        >
          <div
            className="w-full max-w-xl rounded-xl border border-[#3a352b] bg-[#0a0d0f] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.7)]"
            onClick={(event) => event.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#806b47]">
                  Genesis Series
                </p>

                <h2 className="mt-2 text-3xl font-black uppercase tracking-[0.04em] text-[#e7e2d8]">
                  Card Distribution
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#85898b]">
                  The Genesis Series contains 36,000 total cards.
                </p>
              </div>

              <button
                type="button"
                aria-label="Close distribution"
                onClick={() => setShowDistribution(false)}
                className="grid size-10 shrink-0 place-items-center rounded-lg border border-[#292823] bg-[#07090a] text-[#85898b] transition hover:border-[#8e702c]/50 hover:text-[#d2a143]"
              >
                <X size={19} />
              </button>
            </div>

            {/* DISTRIBUTION */}
            <div className="mt-6 space-y-3">
              <DistributionRow
                label="Standard"
                value="33,300"
                percent="92.50%"
              />

              <DistributionRow
                label="Reverse Holo"
                value="1,767"
                percent="4.91%"
              />

              <DistributionRow
                label="Holo"
                value="600"
                percent="1.67%"
              />

              <DistributionRow
                label="1/1 Alternate Art"
                value="333"
                percent="0.93%"
              />
            </div>

            {/* TOTAL */}
            <div className="mt-6 rounded-lg border border-[#8e702c]/25 bg-[#8e702c]/[0.045] p-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#b58a45]">
                    Total Supply
                  </p>

                  <p className="mt-1 text-sm text-[#85898b]">
                    Genesis Series cards
                  </p>
                </div>

                <span className="text-3xl font-black text-[#d2a143]">
                  36,000
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MarketStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-[#292823] bg-[#07090a] px-4 py-4">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#777168]">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-[#d2a143]">
        {value}
      </p>
    </div>
  );
}

function DistributionRow({
  label,
  value,
  percent,
}: {
  label: string;
  value: string;
  percent: string;
}) {
  return (
    <div className="rounded-lg border border-[#292823] bg-[#07090a] px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-bold text-[#c5c0b7]">
          {label}
        </span>

        <span className="font-mono text-sm font-black text-[#e0dcd3]">
          {value}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#17191a]">
          <div
            className="h-full rounded-full bg-[#a97826]"
            style={{ width: percent }}
          />
        </div>

        <span className="w-14 text-right font-mono text-xs text-[#85898b]">
          {percent}
        </span>
      </div>
    </div>
  );
}