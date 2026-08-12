import Link from "next/link";
import {
  ArrowRight,
  Dna,
  FlaskConical,
  PackageOpen,
  Play,
  ShieldCheck,
  Sparkles,
  Swords,
  Trophy,
  Zap,
} from "lucide-react";

import { AppNavigation } from "@/components/battle-dinos/nav";

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050708] text-[#e8e4db]">
      <AppNavigation />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-[#292823]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_65%_35%,rgba(167,112,31,0.13),transparent_32%),radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.025),transparent_22%)]" />

          <div className="relative mx-auto grid min-h-[650px] max-w-[1400px] items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.8fr] xl:px-8">
            {/* COPY */}
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-md border border-[#a97826]/35 bg-[#a97826]/[0.06] px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#d2a143]">
                <Dna size={14} />
                Project 333
              </div>

              <p className="mt-7 text-xs font-black uppercase tracking-[0.28em] text-[#806b47]">
                Collect. Develop. Compete.
              </p>

              <h1 className="mt-3 max-w-3xl text-5xl font-black uppercase leading-[0.95] tracking-[0.035em] text-[#e8e4db] sm:text-6xl lg:text-7xl">
                Every Specimen
                <span className="block text-[#c8943c]">
                  Becomes Its Own.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-[#96999a] sm:text-lg">
                SPECIMEN is a collectible creature ecosystem built around 333
                original prehistoric genetic templates. Open Genesis packs,
                develop individual specimens, acquire mutations, evolve new
                forms, and deploy them into deterministic combat trials.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#b8842c]/70 bg-[linear-gradient(110deg,rgba(126,85,21,0.38),rgba(77,48,13,0.18))] px-6 py-4 text-sm font-black uppercase tracking-[0.1em] text-[#eadfca] transition hover:border-[#d2a143]"
                >
                  <PackageOpen size={18} />
                  Explore Genesis Packs
                </Link>

                <Link
                  href="/battle"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#34322c] bg-[#0a0c0d] px-6 py-4 text-sm font-black uppercase tracking-[0.1em] text-[#bbb7ae] transition hover:border-[#6b604b] hover:text-white"
                >
                  <Swords size={18} />
                  Enter Trials
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-sm text-[#777c7d]">
                <HeroStat value="333" label="Genetic Templates" />
                <HeroStat value="36,000" label="Genesis Cards" />
                <HeroStat value="7,200" label="Sealed Packs" />
              </div>
            </div>

            {/* PACK */}
            <div className="relative mx-auto flex w-full max-w-[480px] items-center justify-center">
              <div className="absolute h-[70%] w-[70%] rounded-full bg-[#a36d20]/10 blur-[90px]" />

              <video
                src="/packs/genesispack.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="relative z-10 max-h-[590px] w-full object-contain"
              />
            </div>
          </div>
        </section>

        {/* WHAT IS SPECIMEN */}
        <section className="border-b border-[#292823] bg-[#07090a]">
          <div className="mx-auto max-w-[1250px] px-4 py-20 sm:px-6 xl:px-8">
            <SectionHeader
              eyebrow="The Project"
              title="333 Origins. Thousands of Outcomes."
              text="Every collectible begins with one of 333 base creatures, but no specimen is locked into the same future."
            />

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              <FeatureCard
                icon={Dna}
                number="01"
                title="Born From a Template"
                text="Each specimen inherits a species, element, combat profile, visual identity, and three signature moves from one of the original Project 333 templates."
              />

              <FeatureCard
                icon={FlaskConical}
                number="02"
                title="Genetically Individual"
                text="Every collectible receives its own genetic modifiers, giving specimens from the same lineage slightly different starting potential."
              />

              <FeatureCard
                icon={Sparkles}
                number="03"
                title="Develops Independently"
                text="XP, mutations, evolution, combat history, and future artwork belong to the individual specimen."
              />
            </div>
          </div>
        </section>

        {/* DEVELOPMENT */}
        <section className="border-b border-[#292823]">
          <div className="mx-auto max-w-[1250px] px-4 py-20 sm:px-6 xl:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#806b47]">
                  Biological Progression
                </p>

                <h2 className="mt-3 text-4xl font-black uppercase leading-tight tracking-[0.035em] text-[#e4dfd4] sm:text-5xl">
                  Your Specimen Does Not Stay Static.
                </h2>

                <p className="mt-5 text-base leading-8 text-[#8d9192]">
                  Trials generate progression. Owners decide how to develop
                  their specimens over time, creating different combat builds
                  and different visual forms from the same original lineage.
                </p>

                <Link
                  href="/docs"
                  className="mt-7 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.08em] text-[#d2a143] transition hover:text-[#e7b85c]"
                >
                  Explore the research archive
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <DevelopmentCard
                  icon={Zap}
                  title="Level"
                  text="Allocate earned XP to increase current combat capability."
                />

                <DevelopmentCard
                  icon={FlaskConical}
                  title="Mutate"
                  text="Acquire biological traits that change specialization and anatomy."
                />

                <DevelopmentCard
                  icon={Dna}
                  title="Evolve"
                  text="Reach major developmental stages with new forms and artwork."
                />
              </div>
            </div>
          </div>
        </section>

        {/* TRIALS */}
        <section className="relative overflow-hidden border-b border-[#292823] bg-[#07090a]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(142,112,44,0.07),transparent_45%)]" />

          <div className="relative mx-auto max-w-[1250px] px-4 py-20 sm:px-6 xl:px-8">
            <SectionHeader
              eyebrow="Combat Trials"
              title="The Winner Is Decided Before The Camera Rolls."
              text="SPECIMEN separates game logic from cinematic presentation. Trials are resolved by deterministic rules and seeded randomness, then reconstructed as a visual battle."
            />

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              <FeatureCard
                icon={ShieldCheck}
                number="01"
                title="Deterministic Engine"
                text="Current stats, moves, elemental matchups, and a verifiable seed determine the official result."
              />

              <FeatureCard
                icon={Swords}
                number="02"
                title="Canonical Trial"
                text="The engine records initiative, attacks, hits, criticals, and the finishing move as the official event sequence."
              />

              <FeatureCard
                icon={Play}
                number="03"
                title="Cinematic Replay"
                text="AI reconstructs the completed trial into a visual replay without changing who won or what happened."
              />
            </div>

            <div className="mt-10 flex justify-center">
              <Link
                href="/battle"
                className="inline-flex items-center gap-2 rounded-lg border border-[#a97826]/50 bg-[#a97826]/[0.06] px-6 py-4 text-sm font-black uppercase tracking-[0.1em] text-[#d6b06a] transition hover:border-[#d2a143]"
              >
                <Swords size={18} />
                Enter Trial Network
              </Link>
            </div>
          </div>
        </section>

        {/* GENESIS */}
        <section className="border-b border-[#292823]">
          <div className="mx-auto max-w-[1250px] px-4 py-20 sm:px-6 xl:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="relative flex justify-center">
                <video
                  src="/packs/genesispack.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="max-h-[500px] w-full max-w-[400px] object-contain"
                />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#806b47]">
                  Genesis Series
                </p>

                <h2 className="mt-3 text-4xl font-black uppercase leading-tight tracking-[0.035em] text-[#e4dfd4] sm:text-5xl">
                  The First 36,000.
                </h2>

                <p className="mt-5 text-base leading-8 text-[#8d9192]">
                  Genesis Series introduces the first collectible specimens
                  derived from Project 333. Every sealed pack contains five
                  randomized cards.
                </p>

                <div className="mt-7 grid grid-cols-2 gap-3">
                  <GenesisStat
                    value="36,000"
                    label="Total Cards"
                  />

                  <GenesisStat
                    value="7,200"
                    label="5-Card Packs"
                  />

                  <GenesisStat
                    value="333"
                    label="Original Templates"
                  />

                  <GenesisStat
                    value="333"
                    label="Unique 1/1 Alt Arts"
                  />
                </div>

                <p className="mt-5 text-sm leading-6 text-[#777c7d]">
                  Packs may contain Standard, Reverse Holo, Holo, or unique 1/1
                  Alternate Art cards.
                </p>

                <Link
                  href="/shop"
                  className="mt-7 inline-flex items-center gap-2 rounded-lg border border-[#b8842c]/70 bg-[linear-gradient(110deg,rgba(126,85,21,0.38),rgba(77,48,13,0.18))] px-6 py-4 text-sm font-black uppercase tracking-[0.1em] text-[#eadfca] transition hover:border-[#d2a143]"
                >
                  <PackageOpen size={18} />
                  View Genesis Packs
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* WHY */}
        <section className="bg-[#07090a]">
          <div className="mx-auto max-w-[1250px] px-4 py-20 sm:px-6 xl:px-8">
            <SectionHeader
              eyebrow="The Ecosystem"
              title="Collectibles With A History."
              text="A specimen is more than a static card. Its progression creates an individual record that continues to develop after the Genesis pack is opened."
            />

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SimpleCard
                icon={Dna}
                title="Unique Genetics"
                text="Copies from the same lineage can start with different strengths."
              />

              <SimpleCard
                icon={FlaskConical}
                title="Persistent Mutations"
                text="Acquired traits become part of that specimen's biological history."
              />

              <SimpleCard
                icon={Trophy}
                title="Trial Record"
                text="Wins, losses, XP, and development follow the individual collectible."
              />

              <SimpleCard
                icon={Play}
                title="Replay Archive"
                text="Canonical trials can become cinematic visual records."
              />
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="border-t border-[#292823]">
          <div className="mx-auto max-w-[1050px] px-4 py-24 text-center sm:px-6">
            <p className="text-xs font-black uppercase tracking-[0.26em] text-[#806b47]">
              Project 333
            </p>

            <h2 className="mt-4 text-4xl font-black uppercase tracking-[0.04em] text-[#e8e4db] sm:text-5xl">
              The Genesis Series Has Begun.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#8d9192]">
              Acquire a specimen, develop its biology, and build a history that
              belongs to no other collectible.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-lg border border-[#b8842c]/70 bg-[linear-gradient(110deg,rgba(126,85,21,0.38),rgba(77,48,13,0.18))] px-6 py-4 text-sm font-black uppercase tracking-[0.1em] text-[#eadfca] transition hover:border-[#d2a143]"
              >
                <PackageOpen size={18} />
                Explore Genesis
              </Link>

              <Link
                href="/docs"
                className="inline-flex items-center gap-2 rounded-lg border border-[#34322c] bg-[#0a0c0d] px-6 py-4 text-sm font-black uppercase tracking-[0.1em] text-[#aaa69d] transition hover:border-[#6b604b] hover:text-white"
              >
                View Archive
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function HeroStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div>
      <span className="font-black text-[#ded9cf]">
        {value}
      </span>{" "}
      <span>{label}</span>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-[#806b47]">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-4xl font-black uppercase leading-tight tracking-[0.035em] text-[#e4dfd4] sm:text-5xl">
        {title}
      </h2>

      <p className="mt-5 text-base leading-8 text-[#8d9192]">
        {text}
      </p>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  number,
  title,
  text,
}: {
  icon: typeof Dna;
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-[#292823] bg-[#0a0d0f] p-6">
      <div className="flex items-center justify-between">
        <div className="grid size-10 place-items-center rounded-lg border border-[#a97826]/30 bg-[#a97826]/[0.06] text-[#d2a143]">
          <Icon size={19} />
        </div>

        <span className="text-xs font-black text-[#5f5b52]">
          {number}
        </span>
      </div>

      <h3 className="mt-5 text-lg font-black uppercase tracking-[0.04em] text-[#dedad1]">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-[#7f8485]">
        {text}
      </p>
    </div>
  );
}

function DevelopmentCard({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Zap;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-[#292823] bg-[#080a0b] p-5">
      <Icon size={21} className="text-[#d2a143]" />

      <h3 className="mt-4 text-lg font-black uppercase text-[#dedad1]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#7b8081]">
        {text}
      </p>
    </div>
  );
}

function GenesisStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-lg border border-[#292823] bg-[#080a0b] p-4">
      <p className="text-2xl font-black text-[#d2a143]">
        {value}
      </p>

      <p className="mt-1 text-xs font-bold uppercase tracking-[0.08em] text-[#737777]">
        {label}
      </p>
    </div>
  );
}

function SimpleCard({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Dna;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-[#292823] bg-[#0a0d0f] p-5">
      <Icon size={19} className="text-[#d2a143]" />

      <h3 className="mt-4 font-black uppercase tracking-[0.04em] text-[#dedad1]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#797e7f]">
        {text}
      </p>
    </div>
  );
}