"use client";

import { Hash, Lock } from "lucide-react";

/* ------------------------------------------------------------------ *
 * Source of truth: out/summary.json + out/manifest.json.
 * Swap these constants for a fetch once /public/genesis is populated.
 * ------------------------------------------------------------------ */

const MANIFEST_HASH =
  "0xed81a7af9f4a2f5e1f6a1029acc7799dacfb4a923343e7b390aa62123aae1e2f";

const FINISHES = [
  { key: "standard", label: "Standard" },
  { key: "reverse", label: "Reverse Holo" },
  { key: "holo", label: "Holo" },
  { key: "alt", label: "Alt Art 1/1" },
] as const;

type FinishKey = (typeof FINISHES)[number]["key"];

/** null = this combination was never struck. */
type Tier = {
  label: string;
  cells: Record<FinishKey, number | null>;
  total: number;
  oneIn: string;
};

const TIERS: Tier[] = [
  {
    label: "Common",
    cells: { standard: 21646, reverse: 1142, holo: 390, alt: 167 },
    total: 23345,
    oneIn: "1",
  },
  {
    label: "Uncommon",
    cells: { standard: 7903, reverse: 423, holo: 139, alt: 83 },
    total: 8548,
    oneIn: "1.2",
  },
  {
    label: "Rare",
    cells: { standard: 2942, reverse: 160, holo: 56, alt: 50 },
    total: 3208,
    oneIn: "2.6",
  },
  {
    label: "Epic",
    cells: { standard: 708, reverse: 37, holo: 15, alt: 25 },
    total: 785,
    oneIn: "9.5",
  },
  {
    label: "Legendary",
    cells: { standard: 101, reverse: 5, holo: null, alt: 8 },
    total: 114,
    oneIn: "63",
  },
];

/** Column margins — the finish totals across all tiers. */
const COLUMN_TOTALS: Record<FinishKey, { cards: number; oneIn: string }> = {
  standard: { cards: 33300, oneIn: "1" },
  reverse: { cards: 1767, oneIn: "4.1" },
  holo: { cards: 600, oneIn: "12" },
  alt: { cards: 333, oneIn: "21.6" },
};

const TOTAL_CARDS = 36000;

const GUARANTEES = [
  "Five cards, always",
  "No duplicate specimen in a pack",
  "At least one Uncommon or better",
  "At most one special finish",
];

const n = (v: number) => v.toLocaleString();

/* ------------------------------------------------------------------ */

export function PackOdds() {
  return (
    <section className="mt-4 space-y-4">
      {/* ---------------- ODDS ---------------- */}
      <div className="bd-panel rounded-xl p-5 sm:p-6">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#806b47]">
          Genesis Series
        </p>
        <h2 className="mt-2 text-2xl font-black uppercase tracking-[0.04em] text-[#e7e2d8] sm:text-3xl">
          Pack Odds
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#85898b]">
          Every card in the series, counted by tier and finish. Pull rates are
          measured across all 7,200 sealed packs &mdash; the chance one pack holds at
          least one such card.
        </p>

        {/* --- tablet and up: full cross-tabulation --- */}
        <div className="bd-scrollbar mt-6 -mx-5 hidden overflow-x-auto px-5 sm:-mx-6 sm:block sm:px-6">
          <table className="w-full min-w-[680px] border-separate border-spacing-0 text-left">
            <caption className="sr-only">
              Card counts and pull rates by rarity tier and finish
            </caption>
            <thead>
              <tr className="text-[9px] font-black uppercase tracking-[0.16em] text-[#5f5a51]">
                <th scope="col" className="pb-3 pr-4 font-black">
                  Tier
                </th>
                {FINISHES.map((f) => (
                  <th
                    key={f.key}
                    scope="col"
                    className="pb-3 pr-4 text-right font-black"
                  >
                    {f.label}
                  </th>
                ))}
                <th
                  scope="col"
                  className="pb-3 pl-3 text-right font-black text-[#806b47]"
                >
                  All finishes
                </th>
              </tr>
            </thead>

            <tbody>
              {TIERS.map((t) => (
                <tr key={t.label}>
                  <th
                    scope="row"
                    className="border-t border-[#232320] py-3 pr-4 text-left text-sm font-black uppercase tracking-[0.06em] text-[#dedad1]"
                  >
                    {t.label}
                  </th>

                  {FINISHES.map((f) => (
                    <td
                      key={f.key}
                      className="border-t border-[#232320] py-3 pr-4 text-right font-mono text-sm text-[#8d9192]"
                    >
                      {t.cells[f.key] === null ? (
                        <span className="text-[10px] uppercase tracking-wider text-[#4f504c]">
                          none struck
                        </span>
                      ) : (
                        n(t.cells[f.key] as number)
                      )}
                    </td>
                  ))}

                  <td className="border-t border-[#232320] bg-[#8e702c]/[0.04] py-3 pl-3 text-right">
                    <span className="block font-mono text-sm font-black text-[#e0dcd3]">
                      {n(t.total)}
                    </span>
                    <span className="mt-0.5 block font-mono text-[11px] font-black text-[#d2a143]">
                      1 in {t.oneIn}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

            {/* --- column margins: finish totals across all tiers --- */}
            <tfoot>
              <tr>
                <th
                  scope="row"
                  className="border-t-2 border-[#3a352b] py-3 pr-4 text-left text-[9px] font-black uppercase tracking-[0.16em] text-[#806b47]"
                >
                  All tiers
                </th>
                {FINISHES.map((f) => (
                  <td
                    key={f.key}
                    className="border-t-2 border-[#3a352b] bg-[#8e702c]/[0.04] py-3 pr-4 text-right"
                  >
                    <span className="block font-mono text-sm font-black text-[#e0dcd3]">
                      {n(COLUMN_TOTALS[f.key].cards)}
                    </span>
                    <span className="mt-0.5 block font-mono text-[11px] font-black text-[#d2a143]">
                      1 in {COLUMN_TOTALS[f.key].oneIn}
                    </span>
                  </td>
                ))}
                <td className="border-t-2 border-[#3a352b] bg-[#8e702c]/[0.08] py-3 pl-3 text-right">
                  <span className="block font-mono text-base font-black text-[#d2a143]">
                    {n(TOTAL_CARDS)}
                  </span>
                  <span className="mt-0.5 block text-[9px] font-black uppercase tracking-[0.14em] text-[#806b47]">
                    Total
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* --- mobile: one card per tier --- */}
        <div className="mt-5 space-y-2 sm:hidden">
          {TIERS.map((t) => (
            <div
              key={t.label}
              className="rounded-lg border border-[#292823] bg-[#07090a] p-4"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-black uppercase tracking-[0.06em] text-[#dedad1]">
                  {t.label}
                </span>
                <span className="font-mono text-base font-black text-[#d2a143]">
                  1 in {t.oneIn}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-4 gap-2 border-t border-[#232320] pt-3">
                {FINISHES.map((f) => (
                  <div key={f.key}>
                    <p className="text-[8px] font-black uppercase leading-tight tracking-[0.1em] text-[#5f5a51]">
                      {f.label}
                    </p>
                    <p className="mt-1 font-mono text-xs text-[#9a9d9e]">
                      {t.cells[f.key] === null ? "—" : n(t.cells[f.key] as number)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="rounded-lg border border-[#8e702c]/35 bg-[#8e702c]/[0.06] p-4">
            <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#806b47]">
              All tiers
            </p>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {FINISHES.map((f) => (
                <div key={f.key}>
                  <p className="text-[8px] font-black uppercase leading-tight tracking-[0.1em] text-[#806b47]">
                    {f.label}
                  </p>
                  <p className="mt-1 font-mono text-xs font-black text-[#e0dcd3]">
                    {n(COLUMN_TOTALS[f.key].cards)}
                  </p>
                  <p className="font-mono text-[10px] font-black text-[#d2a143]">
                    1 in {COLUMN_TOTALS[f.key].oneIn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-2 text-xs leading-6 text-[#6f7475]">
          <p>
            33,300 cards carry a standard finish, so roughly three in five packs hold
            no special finish at all.
          </p>
          <p>
            Special finishes are struck in proportion to each specimen&rsquo;s print
            run. The eight Legendary specimens have the smallest print runs in the
            series, so no Legendary Holo was struck.
          </p>
          <p className="text-[#8d8574]">
            Every specimen was struck once in Alternate Art, so all 333 are 1/1. What
            separates them is the specimen underneath: the largest runs to 204 cards,
            while only four Emberreavers exist in any finish.
          </p>
        </div>
      </div>

      {/* ---------------- SEALED BEFORE SALE ---------------- */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <div className="bd-panel rounded-xl p-5 sm:p-6">
          <h3 className="text-sm font-black uppercase tracking-[0.12em] text-[#ded8cc]">
            In every pack
          </h3>
          <ul className="mt-4 space-y-2.5">
            {GUARANTEES.map((g) => (
              <li key={g} className="flex gap-3 text-sm leading-6 text-[#9a9d9e]">
                <span className="mt-2.5 size-1 shrink-0 rounded-full bg-[#a97826]" />
                {g}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-[#8e702c]/25 bg-[#8e702c]/[0.045] p-5 sm:p-6">
          <div className="flex items-center gap-2 text-[#d2a143]">
            <Lock size={17} />
            <h3 className="text-sm font-black uppercase tracking-[0.12em] text-[#ded8cc]">
              Sealed before sale
            </h3>
          </div>
          <p className="mt-3 text-sm leading-6 text-[#a29a88]">
            All 7,200 packs were filled and fingerprinted before the first one sold.
            Which pack you receive is decided by a public NIST randomness beacon drawn
            after the series sells out. Nobody &mdash; including us &mdash; can know
            what is in your pack until then.
          </p>

          <div className="mt-4 rounded-lg border border-[#34322c] bg-[#050708] p-3">
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.16em] text-[#806b47]">
              <Hash size={11} />
              Series fingerprint
            </div>
            <p className="mt-2 break-all font-mono text-[11px] leading-5 text-[#b58a45]">
              {MANIFEST_HASH}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}