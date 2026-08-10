import { recentBattles } from "@/lib/battle-dinos-data";

export function RecentBattles() {
  return (
    <section className="bd-panel rounded-2xl p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
            Battle History
          </p>
          <h2 className="mt-1 text-lg font-black text-white">Recent Battles</h2>
        </div>
        <button className="text-xs font-bold text-amber-300 hover:text-amber-200">
          View all
        </button>
      </div>

      <div className="divide-y divide-white/[0.06]">
        {recentBattles.map((battle, index) => {
          const win = battle.result === "Victory";

          return (
            <div
              key={`${battle.opponent}-${index}`}
              className="grid grid-cols-[1fr_auto] items-center gap-3 py-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-black uppercase ${
                      win ? "text-lime-400" : "text-rose-400"
                    }`}
                  >
                    {battle.result}
                  </span>
                  <span className="truncate text-sm font-bold text-slate-200">
                    vs {battle.opponent}
                  </span>
                </div>
                <div className="mt-1 flex gap-2 text-[11px] text-slate-500">
                  <span>{battle.mode}</span>
                  <span>•</span>
                  <span>{battle.time}</span>
                </div>
              </div>

              <span
                className={`text-xs font-black ${
                  win ? "text-lime-400" : "text-rose-400"
                }`}
              >
                {battle.change}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
