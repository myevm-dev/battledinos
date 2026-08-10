import Image from "next/image";
import { RotateCcw, Shield, Sparkles, Swords, Trophy } from "lucide-react";
import { selectedDino } from "@/lib/battle-dinos-data";

export function SelectedDinoCard() {
  return (
    <section className="bd-panel rounded-2xl p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
            Selected Dino
          </p>
          <h2 className="mt-1 text-lg font-black text-white">
            {selectedDino.name}
          </h2>
        </div>
        <span className="rounded-full border border-slate-600/50 bg-slate-800/60 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-300">
          {selectedDino.rarity}
        </span>
      </div>

      <div className="grid grid-cols-[112px_1fr] gap-4">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-cyan-400/30 bg-slate-950">
          <Image
            src={selectedDino.image}
            alt={selectedDino.name}
            fill
            sizes="112px"
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2 pt-8">
            <p className="text-[10px] font-bold text-cyan-300">
              #{selectedDino.tokenId.toString().padStart(3, "0")}
            </p>
          </div>
        </div>

        <div className="flex min-w-0 flex-col">
          <p className="text-xs text-slate-500">{selectedDino.species}</p>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <MiniStat icon={Trophy} label="Record" value={selectedDino.record} />
            <MiniStat
              icon={Sparkles}
              label="Rating"
              value={selectedDino.rating.toLocaleString()}
            />
          </div>

          <div className="mt-4 space-y-2">
            {selectedDino.moves.map((move, index) => (
              <div key={move.name} className="flex items-center gap-2 text-xs">
                <div
                  className={`grid size-6 shrink-0 place-items-center rounded-md ${
                    index === 1
                      ? "bg-blue-500/15 text-blue-300"
                      : "bg-slate-700/40 text-slate-400"
                  }`}
                >
                  {index === 1 ? <Swords size={12} /> : <Shield size={12} />}
                </div>
                <span className="min-w-0 flex-1 truncate font-semibold text-slate-300">
                  {move.name}
                </span>
                <span className="font-black text-white">{move.power}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-300 transition hover:bg-white/[0.06]">
        <RotateCcw size={15} />
        Swap Dino
      </button>
    </section>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Trophy;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-black/20 p-2.5">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-500">
        <Icon size={12} />
        {label}
      </div>
      <div className="mt-1 text-sm font-black text-white">{value}</div>
    </div>
  );
}
