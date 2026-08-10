import Image from "next/image";
import { MapPin } from "lucide-react";
import { arenas } from "@/lib/battle-dinos-data";

export function ArenaPreview() {
  return (
    <section className="bd-panel rounded-2xl p-4 sm:p-5">
      <div className="mb-4">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
          Possible Battleground
        </p>
        <h2 className="mt-1 text-lg font-black text-white">Arena Rotation</h2>
      </div>

      <div className="bd-scrollbar flex snap-x gap-3 overflow-x-auto pb-2 lg:grid lg:grid-cols-2 lg:overflow-visible lg:pb-0">
        {arenas.slice(0, 4).map((arena) => (
          <article
            key={arena.name}
            className="group relative min-w-[245px] snap-start overflow-hidden rounded-xl border border-white/10 bg-slate-950 lg:min-w-0"
          >
            <div className="relative aspect-[16/9]">
              <Image
                src={arena.image}
                alt={arena.name}
                fill
                sizes="(max-width: 1024px) 245px, 320px"
                className="object-cover transition duration-300 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
            </div>

            <div className="absolute inset-x-0 bottom-0 p-3">
              <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                <MapPin size={11} />
                Arena
              </div>
              <h3 className="mt-0.5 text-sm font-black text-white">{arena.name}</h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
