import { ChevronRight, ShieldCheck, Swords, Zap } from "lucide-react";
import type { BattleMode, BattleModeId } from "@/lib/battle-dinos-data";

type Props = {
  mode: BattleMode;
  selected: boolean;
  onSelect: (id: BattleModeId) => void;
};

export function GameModeCard({ mode, selected, onSelect }: Props) {
  const teal = mode.accent === "teal";
  const Icon = mode.id === "duel" ? Swords : Zap;

  return (
    <button
      onClick={() => onSelect(mode.id)}
      className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition duration-200 ${
        selected
          ? teal
            ? "border-teal-400/70 bg-teal-500/10 shadow-[0_0_30px_rgba(19,211,197,0.1)]"
            : "border-blue-400/70 bg-blue-500/10 shadow-[0_0_30px_rgba(56,140,245,0.1)]"
          : "border-white/10 bg-slate-950/55 hover:border-white/20 hover:bg-slate-900/70"
      }`}
    >
      <div
        className={`absolute -right-16 -top-20 size-52 rounded-full blur-3xl ${
          teal ? "bg-teal-500/10" : "bg-blue-500/10"
        }`}
      />

      <div className="relative flex items-start gap-4">
        <div
          className={`grid size-12 shrink-0 place-items-center rounded-xl border ${
            teal
              ? "border-teal-400/30 bg-teal-400/10 text-teal-300"
              : "border-blue-400/30 bg-blue-400/10 text-blue-300"
          }`}
        >
          <Icon size={24} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
            {mode.eyebrow}
          </div>
          <h3 className="text-xl font-black text-white">{mode.title}</h3>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
            {mode.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${
                teal
                  ? "border-teal-400/20 bg-teal-500/10 text-teal-300"
                  : "border-blue-400/20 bg-blue-500/10 text-blue-300"
              }`}
            >
              <ShieldCheck size={13} />
              {mode.availability}
            </span>

            <span className="flex items-center gap-1 text-xs font-bold text-slate-300 transition group-hover:translate-x-0.5">
              Select
              <ChevronRight size={15} />
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
