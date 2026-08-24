"use client";

import Image from "next/image";
import {
  PackageOpen,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { AppNavigation } from "@/components/battle-dinos/nav";

const BOX_SUPPLY = 900;
const PRICE_UNI = 11;
const PACKS_PER_BOX = 8;
const CARDS_PER_PACK = 5;
const CARDS_PER_BOX = PACKS_PER_BOX * CARDS_PER_PACK;

const boosterBoxOdds = [
  {
    result: "Common Standard",
    distribution: "24+ per box",
    odds: "Guaranteed",
    detail: "Baseline Standard collation",
  },
  {
    result: "Uncommon Standard",
    distribution: "8+ per box",
    odds: "Guaranteed",
    detail: "At least one in every pack",
  },
  {
    result: "Rare Standard",
    distribution: "3+ per box",
    odds: "Guaranteed",
    detail: "Three base Rare slots",
  },
  {
    result: "Special Finish",
    distribution: "3 per box",
    odds: "Guaranteed",
    detail: "Reverse Holo, Holo, or 1/1 Alt Art",
  },
  {
    result: "Reverse Holo",
    distribution: "1+ per box",
    odds: "Guaranteed",
    detail: "867 of 900 boxes can contain a second",
  },
  {
    result: "Holo",
    distribution: "600 of 900 boxes",
    odds: "1 in 1.50 boxes",
    detail: "66.67% of booster boxes",
  },
  {
    result: "1/1 Alternate Art",
    distribution: "333 of 900 boxes",
    odds: "1 in 2.70 boxes",
    detail: "37.00% of booster boxes",
  },
  {
    result: "Epic Standard",
    distribution: "708 of 900 boxes",
    odds: "1 in 1.27 boxes",
    detail: "78.67% of booster boxes",
  },
  {
    result: "Legendary Standard",
    distribution: "101 of 900 boxes",
    odds: "1 in 8.91 boxes",
    detail: "11.22% of booster boxes",
  },
];

export default function ShopPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050708] text-[#e8e4db]">
      <AppNavigation />

      <main className="mx-auto max-w-[1400px] px-4 py-5 sm:px-6 lg:py-7 xl:px-8">
        {/* PRODUCT */}
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(430px,0.92fr)]">
          {/* BOOSTER BOX IMAGE */}
          <div className="relative flex min-h-[430px] items-center justify-center overflow-hidden rounded-xl border border-[#292823] bg-[#030405] p-5 sm:min-h-[560px] sm:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(167,112,31,0.12),transparent_48%)]" />

            <Image
              src="/boosterbox.png"
              alt="SPECIMEN Genesis Series booster box"
              width={1000}
              height={1000}
              priority
              className="relative z-10 max-h-[520px] w-full object-contain"
            />

            <div className="pointer-events-none absolute left-5 top-5 z-20 sm:left-7 sm:top-7">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8b734d]">
                Project 333
              </p>
              <p className="mt-1 text-sm font-black uppercase tracking-[0.1em] text-[#d0cbc0]">
                Genesis Series
              </p>
            </div>
          </div>

          {/* PRODUCT PANEL */}
          <div className="bd-panel flex flex-col rounded-xl p-5 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#806b47]">
                  Genesis Series
                </p>

                <h1 className="mt-2 text-3xl font-black uppercase tracking-[0.04em] text-[#e7e2d8] sm:text-4xl">
                  Booster Box
                </h1>
              </div>

              <div className="rounded-lg border border-[#a97826]/35 bg-[#a97826]/[0.06] px-5 py-3 text-right">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[#806b47]">
                  Box Supply
                </p>

                <p className="mt-1 text-2xl font-black text-[#d2a143]">
                  {BOX_SUPPLY.toLocaleString()}
                </p>
              </div>
            </div>

            <p className="mt-5 text-base leading-7 text-[#9a9d9e]">
              One sealed Genesis Booster Box contains eight randomized 5-card
              packs from the Project 333 Genesis Series. Only 900 sealed boxes
              are available.
            </p>

            <div className="mt-6 rounded-xl border border-[#8e702c]/35 bg-[#8e702c]/[0.055] p-5">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#9b8053]">
                Fixed Price
              </p>

              <div className="mt-2 flex items-end gap-2">
                <span className="text-4xl font-black text-[#e0ab4a] sm:text-5xl">
                  {PRICE_UNI}
                </span>
                <span className="pb-1 text-xl font-black uppercase tracking-[0.08em] text-[#c8b997]">
                  UNI
                </span>
              </div>

              <p className="mt-2 text-sm text-[#85898b]">
                Per sealed booster box
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <MarketStat label="Packs Per Box" value={String(PACKS_PER_BOX)} />
              <MarketStat label="Cards Per Box" value={String(CARDS_PER_BOX)} />
              <MarketStat label="Cards Per Pack" value={String(CARDS_PER_PACK)} />
              <MarketStat label="Special Finishes" value="3 / Box" />
            </div>

            <div className="mt-5 rounded-lg border border-[#292823] bg-[#07090a] p-4">
              <div className="flex items-start gap-3">
                <Sparkles
                  size={18}
                  className="mt-0.5 shrink-0 text-[#d2a143]"
                />

                <div>
                  <p className="text-sm font-black uppercase tracking-[0.05em] text-[#dfd7c8]">
                    Collated, Then Randomized
                  </p>

                  <p className="mt-1 text-sm leading-6 text-[#8c8980]">
                    Each box is built to spread rarities and special finishes
                    while keeping the location of
                    chase cards randomized within the eight packs.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-6">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#b8842c]/70 bg-[linear-gradient(110deg,rgba(126,85,21,0.42),rgba(77,48,13,0.2))] px-5 py-4 text-base font-black uppercase tracking-[0.09em] text-[#eadfca] shadow-[0_0_25px_rgba(174,118,28,0.06)] transition hover:border-[#d2a143] hover:bg-[#8a5f1d]/20"
              >
                <PackageOpen size={19} />
                Acquire Booster Box · {PRICE_UNI} UNI
              </button>

              <div className="mt-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[#666b6c]">
                <ShieldCheck size={13} />
                Wallet connection required
              </div>
            </div>
          </div>
        </section>

        {/* SINGLE ODDS TABLE */}
        <section className="mt-6 overflow-hidden rounded-xl border border-[#292823] bg-[#07090a]">
          <div className="border-b border-[#292823] p-5 sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#806b47]">
              Genesis Collation
            </p>

            <h2 className="mt-2 text-2xl font-black uppercase tracking-[0.05em] text-[#e7e2d8] sm:text-3xl">
              Booster Box Odds
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#85898b]">
              Each sealed box contains 40 cards across eight packs. The table
              below shows the planned box-level distribution across all 900
              Genesis Booster Boxes.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#292823] bg-[#090b0c]">
                  <th className="px-5 py-4 text-xs font-black uppercase tracking-[0.1em] text-[#777168]">
                    Card Type
                  </th>
                  <th className="px-5 py-4 text-xs font-black uppercase tracking-[0.1em] text-[#777168]">
                    Box Distribution
                  </th>
                  <th className="px-5 py-4 text-xs font-black uppercase tracking-[0.1em] text-[#777168]">
                    Box Odds
                  </th>
                  <th className="px-5 py-4 text-xs font-black uppercase tracking-[0.1em] text-[#777168]">
                    Notes
                  </th>
                </tr>
              </thead>

              <tbody>
                {boosterBoxOdds.map((row) => (
                  <tr
                    key={row.result}
                    className="border-b border-[#202224] last:border-b-0"
                  >
                    <td className="px-5 py-4 text-sm font-black text-[#d8d2c7]">
                      {row.result}
                    </td>

                    <td className="px-5 py-4 font-mono text-sm text-[#9b9e9f]">
                      {row.distribution}
                    </td>

                    <td className="px-5 py-4 font-mono text-sm font-black text-[#d2a143]">
                      {row.odds}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#7f8485]">
                      {row.detail}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-[#292823] bg-[#090b0c] px-5 py-4 sm:px-6">
            <p className="text-sm leading-6 text-[#7f8485]">
              Epic and Legendary figures refer to the generated Standard-edition
              rarity pool. Special-finish placement is tracked separately so
              finish and rarity can remain independent collectible traits.
            </p>
          </div>
        </section>
      </main>
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
      <p className="text-xs font-black uppercase tracking-[0.1em] text-[#777168]">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-[#d2a143]">
        {value}
      </p>
    </div>
  );
}