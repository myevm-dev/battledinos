import type { ComponentType, ReactNode } from "react";
import {
  Activity,
  Atom,
  Award,
  Binary,
  BookOpen,
  Braces,
  ChevronRight,
  Coins,
  Database,
  Dices,
  Dna,
  FlaskConical,
  Gauge,
  PackageOpen,
  Play,
  ShieldCheck,
  Sparkles,
  Trophy,
  WandSparkles,
  Zap,
} from "lucide-react";

import { AppNavigation } from "@/components/battle-dinos/nav";

type IconType = ComponentType<{
  size?: number;
  className?: string;
}>;

type StatusTone = "done" | "active" | "next" | "later" | "concept";

const baseMetadataExample = `{
  "base_id": 1,
  "name": "Echoguard",
  "species": "Allosaurus",
  "rarity": "Common",
  "element": "Primal",
  "image": "ipfs://REPLACE/1.png",

  "base_battle_stats": {
    "health": 80,
    "attack": 81,
    "defense": 70,
    "speed": 72
  },

  "moves": [
    { "slot": 1, "name": "Primal Chomp", "base_power": 78 },
    { "slot": 2, "name": "Wild Claw", "base_power": 45 },
    { "slot": 3, "name": "Primal Rush", "base_power": 63 }
  ],

  "starting_state": {
    "level": 1,
    "xp": 0,
    "evolution_stage": 0,
    "mutations": []
  }
}`;

const editionMetadataExample = `{
  "token_id": 685,
  "base_id": 8,
  "name": "Ghosttail",
  "edition": 109,
  "edition_supply": 178,
  "rarity": "Common",
  "element": "Frost",
  "finish": "standard",

  "genetics": {
    "health": 1.02,
    "attack": 0.98,
    "defense": 1.04,
    "speed": 1.01,
    "move_1": 1.05,
    "move_2": 0.97,
    "move_3": 1.02
  },

  "battle_stats": {
    "health": 82,
    "attack": 79,
    "defense": 73,
    "speed": 73
  }
}`;

const evolutionSnapshotExample = `{
  "token_id": 685,
  "base_id": 8,
  "stage": 2,
  "label": "EVO II",
  "created_at": 1787488200,

  "image": "ipfs://CURRENT_EVOLUTION_IMAGE",

  "level": 18,

  "battle_stats": {
    "health": 96,
    "attack": 91,
    "defense": 102,
    "speed": 78
  },

  "mutations": [
    {
      "mutation_id": "iron-hide",
      "expression_strength": 0.91,
      "stability": 0.88,
      "acquired_stage": 1
    },
    {
      "mutation_id": "venom-glands",
      "expression_strength": 0.63,
      "stability": 0.81,
      "acquired_stage": 2
    }
  ],

  "research": {
    "research_id": "R-01924",
    "path": "Defensive",
    "serum_id": "ironbloom-7"
  },

  "phenotype_influences": [
    "reinforced dermal plating",
    "toxic gland development"
  ]
}`;

const matchupExample = `{
  "matchup_id": "M-448821",
  "arena_id": "stormforge",
  "seed": "982731498123",
  "created_at": 1787488200,

  "player_a": {
    "wallet": "0x...",
    "token_id": 108,
    "snapshot_id": "S-108-018"
  },

  "player_b": {
    "wallet": "0x...",
    "token_id": 685,
    "snapshot_id": "S-685-041"
  }
}`;

const trialResultExample = `{
  "trial_id": "T-1927",
  "matchup_id": "M-448821",
  "seed": "982731498123",

  "winner_token_id": 108,
  "loser_token_id": 685,
  "trial_intensity": "close",

  "score": {
    "108": 87.42,
    "685": 83.16
  },

  "sequence": [
    { "attacker": 685, "move": "Frost Rush", "result": "hit" },
    { "attacker": 108, "move": "Riptide Talon", "result": "critical" },
    { "attacker": 108, "move": "Tidal Crush", "result": "finisher" }
  ],

  "xp_awards": {
    "108": 80,
    "685": 35
  }
}`;

const researchInputExample = `{
  "specimen_id": "685",
  "research_path": "Defensive",
  "serum_id": "ironbloom-7",
  "intensity": "high",
  "duration_days": 30,
  "mode": "real",
  "seed": "research-685-01924"
}`;

const researchOutcomeExample = `{
  "research_id": "R-01924",
  "seed": "research-685-01924",
  "research_path": "Defensive",
  "serum_id": "ironbloom-7",
  "compatibility": 0.84,

  "mutations": [
    {
      "mutation_id": "iron-hide",
      "expression_strength": 0.91,
      "stability": 0.88,
      "source": "serum"
    },
    {
      "mutation_id": "bone-crown",
      "expression_strength": 0.37,
      "stability": 0.74,
      "source": "secondary"
    }
  ],

  "phenotype_influences": [
    "reinforced dermal plating",
    "cranial bone growth"
  ]
}`;

const mutationDiscoveryExample = `{
  "discovery_id": "D-00481",
  "mutation_id": "iron-hide",
  "lab_id": "LAB-0x82F",
  "wallet": "0x...",
  "specimen_token_id": 685,
  "base_id": 8,
  "research_id": "R-01924",
  "research_path": "Defensive",
  "duration_days": 30,
  "research_hours_at_discovery": 1482,
  "first_global_discovery": true,
  "discovered_at": 1787488200
}`;

const serumExample = `{
  "formula_id": "ironbloom-7",
  "name": "Ironbloom-7",
  "creator": "0x...",
  "version": 7,

  "family_weights": {
    "Defensive": 1.8,
    "Structural": 1.5,
    "Metabolic": 1.1
  },

  "mutation_weights": {
    "iron-hide": 2.4,
    "bone-plating": 1.8,
    "bone-crown": 1.3
  },

  "stability_modifier": 0.08,
  "expression_modifier": 1.04
}`;

const cloneResultExample = `{
  "specimen_id": "685",
  "formula_id": "ironbloom-7",
  "simulations": 100,

  "observed_outcomes": {
    "iron-hide": 0.46,
    "bone-plating": 0.24,
    "bone-crown": 0.12,
    "other": 0.18
  },

  "family_distribution": {
    "Defensive": 0.67,
    "Structural": 0.24,
    "Wildcard": 0.03
  },

  "compatibility": 0.84,
  "visual_preview": "ipfs://AI_CLONE_PREVIEW"
}`;

const replayExample = `TRIAL RESULT
  ↓
REPLAY BUILDER
  ↓
Locked specimen images
Arena reference
Permanent move context
Canonical sequence
Trial intensity
  ↓
GROK VIDEO ADAPTER
  ↓
Cinematic replay`;

const researchFileRoadmap = [
  ["research-types.ts", "Shared research, serum, mutation expression, and outcome types."],
  ["research-config.ts", "Global balancing constants for mutation counts, intensity, stability, rarity, duration, and predictability."],
  ["research-paths.ts", "Nine research paths and the mutation-family weights each path favors."],
  ["research-rng.ts", "Seeded deterministic random helpers. Canonical research should not use Math.random directly."],
  ["research-weights.ts", "Combines mutation weights, path bias, serum bias, genetics, lineage, and duration focus."],
  ["research-compatibility.ts", "Calculates how an individual specimen responds to a path and optional serum."],
  ["research-outcomes.ts", "Resolves rarity, mutation count, expression strength, stability, anomalies, stats, and phenotype influences."],
  ["research-engine.ts", "Main deterministic research orchestrator."],
  ["mutation-library-adapter.ts", "Validates and adapts the 600 authored mutations for the research engine."],
  ["serum-types.ts", "Formula, serum batch, evidence, and engine-profile schemas."],
  ["serum-engine.ts", "Applies formula influence without guaranteeing one exact mutation."],
  ["clone-research.ts", "Runs predictive simulations without changing the real specimen."],
  ["research-tree.ts", "Turns simulations and formula history into UI-friendly probability branches."],
  ["formula-engine.ts", "Creates and refines formulas from discovered biological knowledge and observed research evidence."],
  ["formula-analytics.ts", "Calculates observed consistency, stability, anomaly rate, duration performance, and compatibility breadth."],
  ["formula-certification.ts", "Moves formulas through experimental, observed, certified, and retired states."],
  ["research-record.ts", "Creates canonical research history records and provenance."],
  ["evolution-engine.ts", "Applies completed research to specimen lineage and creates the next evolution snapshot."],
  ["phenotype-builder.ts", "Builds hierarchical visual guidance from lineage and mutation expression without mashing every trait together."],
  ["discovery-types.ts", "Lab research state, mutation discovery, research-depth, and provenance types."],
  ["discovery-config.ts", "Research-hour eligibility thresholds and discovery balancing rules."],
  ["discovery-weights.ts", "Weights undiscovered mutation candidates using path, specimen, rarity, element, and wildcard influence."],
  ["discovery-engine.ts", "Deterministically rolls mutation discovery separately from mutation expression."],
  ["lab-research.ts", "Accumulates research hours by path and tracks the lab's known mutation set."],
  ["discovery-record.ts", "Persists first-observed and first-global discovery provenance."],
  ["index.ts", "Public exports for the research subsystem."],
];

const battleFileRoadmap = [
  ["matchup-types.ts", "Canonical matchup, participant, snapshot, and queue types."],
  ["specimen-snapshot.ts", "Locks the exact current combat state used by a trial."],
  ["create-matchup.ts", "Creates the matchup, arena selection, seed, and immutable participant snapshots."],
  ["trial-result.ts", "Canonical saved battle result used by XP and replay systems."],
  ["battle-replay.ts", "Converts a locked trial result into cinematic scene direction."],
  ["grok-video.ts", "Adapter that submits the replay package for video generation and stores the returned job/result."],
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#050708] pb-24 text-[#e8e4db] md:pb-0">
      <AppNavigation />

      <main>
        <section className="relative overflow-hidden border-b border-[#292823]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(185,133,47,0.14),transparent_40%),radial-gradient(circle_at_15%_30%,rgba(255,255,255,0.025),transparent_28%)]" />

          <div className="relative mx-auto max-w-[1500px] px-4 py-12 sm:px-6 md:py-16 xl:px-10">
            <div className="max-w-5xl">
              <div className="inline-flex items-center gap-2 rounded-md border border-[#a97826]/30 bg-[#a97826]/[0.06] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.24em] text-[#d2a143]">
                <BookOpen size={12} />
                Project 333 / Working Source of Truth
              </div>

              <p className="mt-5 text-[10px] font-black uppercase tracking-[0.34em] text-[#75664e]">
                Product Architecture / Game Logic / Research Roadmap
              </p>

              <h1 className="specimen-title mt-3 text-4xl sm:text-5xl md:text-6xl">
                SPECIMEN Project Roadmap
              </h1>

              <p className="mt-5 max-w-4xl text-sm leading-7 text-[#929596] sm:text-base">
                This page is the current project dump and source of truth for the Genesis Series.
                It tracks what exists now, what is being built next, and which systems are still
                exploratory. It is intentionally more useful than polished.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                <StatusSummary label="Genesis Data" value="Built" tone="done" />
                <StatusSummary label="Battle Math" value="Built" tone="done" />
                <StatusSummary label="Research Engine" value="Built" tone="done" />
                <StatusSummary label="Mutation Discovery" value="Next" tone="next" />
                <StatusSummary label="Advanced Research" value="Later" tone="later" />
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Pill icon={Dna}>333 Genetic Templates</Pill>
                <Pill icon={PackageOpen}>36,000 Genesis Cards</Pill>
                <Pill icon={Zap}>738 Named Moves</Pill>
                <Pill icon={Dices}>Seeded Battle Logic</Pill>
                <Pill icon={FlaskConical}>600 Mutation Discovery Pool</Pill>
                <Pill icon={Database}>Lab Research Knowledge</Pill>
                <Pill icon={Sparkles}>Individual Evolution</Pill>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-[1500px] gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[285px_minmax(0,1fr)] xl:px-10">
          <aside className="hidden lg:block">
            <div className="bd-panel sticky top-[94px] max-h-[calc(100vh-115px)] overflow-y-auto rounded-xl p-3">
              <p className="px-3 pb-2 pt-2 text-[9px] font-black uppercase tracking-[0.22em] text-[#645f54]">
                Source of Truth
              </p>

              <DocLink href="#north-star">01. Product North Star</DocLink>
              <DocLink href="#status">02. Current Status</DocLink>
              <DocLink href="#series">03. Genesis Series</DocLink>
              <DocLink href="#metadata">04. Metadata Layers</DocLink>
              <DocLink href="#lineage">05. Evolution Lineage</DocLink>
              <DocLink href="#battle">06. Battle Engine</DocLink>
              <DocLink href="#matchmaking">07. Matchup Creation</DocLink>
              <DocLink href="#replay">08. Grok Replay Pipeline</DocLink>
              <DocLink href="#xp">09. XP Economy</DocLink>
              <DocLink href="#research">10. XP Research</DocLink>
              <DocLink href="#duration">11. Research Duration</DocLink>
              <DocLink href="#discovery">12. Mutation Discovery</DocLink>
              <DocLink href="#serums">13. Serums & Formulas</DocLink>
              <DocLink href="#clone">14. Clone Research</DocLink>
              <DocLink href="#evolution">15. Evolution Process</DocLink>
              <DocLink href="#staking">16. Token Research Funding</DocLink>
              <DocLink href="#advanced">17. Advanced Research</DocLink>
              <DocLink href="#architecture">18. Data Architecture</DocLink>
              <DocLink href="#files">19. TS File Roadmap</DocLink>
              <DocLink href="#milestones">20. Build Milestones</DocLink>
              <DocLink href="#decisions">21. Locked Decisions</DocLink>
            </div>
          </aside>

          <div className="min-w-0 space-y-5">
            <Section
              id="north-star"
              number="01"
              icon={Dna}
              title="Product North Star"
              subtitle="Collect. Develop. Compete. Every individual specimen becomes its own lineage."
            >
              <p>
                Project 333 begins with 333 original viable prehistoric genetic templates. The
                Genesis Series turns those templates into individual collectible specimens. Each
                token receives its own edition identity and genetics, earns progression, undergoes
                research, acquires mutations, evolves into new forms, and maintains its own history.
              </p>

              <Flow
                steps={[
                  "Genesis collectible",
                  "Individual genetics",
                  "Battle trials",
                  "Earn XP",
                  "Research",
                  "Mutation discovery",
                  "Serum influence",
                  "Mutation expression",
                  "Evolution snapshot",
                  "New combat state",
                ]}
              />

              <Callout>
                The 333 templates are shared origins. The individual NFT edition is the organism
                that develops.
              </Callout>
            </Section>

            <Section
              id="status"
              number="02"
              icon={Activity}
              title="Current Project Status"
              subtitle="The core content, battle math, and deterministic research engine exist. The next work is discovery, battle orchestration, and persistence."
            >
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <RoadmapCard
                  status="done"
                  title="Genesis Data"
                  items={[
                    "333 base genetic templates",
                    "33,300 standard editions generated",
                    "Edition supply lookup for all 333 bases",
                    "Genesis images 1.png through 333.png",
                    "Finish distribution defined",
                  ]}
                />
                <RoadmapCard
                  status="done"
                  title="Combat Content"
                  items={[
                    "Three inherited moves per base",
                    "738 unique named moves",
                    "Permanent action context library",
                    "Element system",
                    "Arena art and Battle lobby direction",
                  ]}
                />
                <RoadmapCard
                  status="done"
                  title="Battle Math"
                  items={[
                    "Current stat scoring",
                    "Element modifiers",
                    "Seeded randomness",
                    "Trial intensity",
                    "Canonical sequence direction",
                    "XP award concept",
                  ]}
                />
                <RoadmapCard
                  status="next"
                  title="Battle Orchestration"
                  items={[
                    "Create matchup",
                    "Lock specimen snapshots",
                    "Save canonical Trial JSON",
                    "Award XP from trusted logic",
                    "Build replay screenplay",
                    "Feed Grok video generation",
                  ]}
                />
                <RoadmapCard
                  status="active"
                  title="Research System"
                  items={[
                    "Deterministic research engine assembled",
                    "600-mutation library validates cleanly",
                    "3 / 7 / 30 / 90 day predictability simulation working",
                    "Serum, clone, formula, and evolution modules created",
                    "Next: mutation discovery and lab research hours",
                    "Next: persistence and production integration",
                  ]}
                />
                <RoadmapCard
                  status="later"
                  title="Advanced Research"
                  items={[
                    "Sponsored computational research",
                    "Real-world research bounties",
                    "Contribution provenance",
                    "Breakthrough attribution",
                    "Potential user reward sharing",
                  ]}
                />
              </div>
            </Section>

            <Section
              id="series"
              number="03"
              icon={PackageOpen}
              title="Genesis Series"
              subtitle="The initial collectible supply remains fixed at 36,000 cards across four finishes."
            >
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <CollectionStat label="Standard" value="33,300" detail="92.50%" />
                <CollectionStat label="Reverse Holo" value="1,767" detail="4.91%" />
                <CollectionStat label="Holo" value="600" detail="1.67%" />
                <CollectionStat label="1/1 Alt Art" value="333" detail="0.93%" />
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <CollectionStat label="Total Supply" value="36,000" detail="Genesis Series" />
                <CollectionStat label="Pack Size" value="5" detail="Cards per sealed pack" />
                <CollectionStat label="Pack Supply" value="7,200" detail="If entire series is packed" />
              </div>

              <Callout>
                Finish affects collectibility and presentation. Rarity or finish does not
                automatically make a specimen stronger in combat.
              </Callout>
            </Section>

            <Section
              id="metadata"
              number="04"
              icon={Braces}
              title="Metadata Layers"
              subtitle="Identity, starting genetics, and live progression are intentionally separated."
            >
              <h3 className="font-black uppercase tracking-wide text-[#dedad1]">Layer 1: Base Genetic Template</h3>
              <p className="mt-2">
                One of the 333 permanent shared definitions. It supplies species, element, base
                combat stats, inherited move names, visual identity, and Genesis artwork.
              </p>
              <CodeBlock code={baseMetadataExample} />

              <h3 className="mt-6 font-black uppercase tracking-wide text-[#dedad1]">Layer 2: Individual Edition</h3>
              <p className="mt-2">
                The collectible token. It adds token ID, edition number, edition supply, finish,
                and deterministic genetic variation to the shared template.
              </p>
              <CodeBlock code={editionMetadataExample} />

              <h3 className="mt-6 font-black uppercase tracking-wide text-[#dedad1]">Layer 3: Live Specimen State</h3>
              <p className="mt-2">
                XP, level, research history, mutation expressions, current evolution stage, current
                stats, trial history, current artwork, and evolution snapshots belong to the
                individual specimen and change over time.
              </p>

              <Formula>
                Base Template + Edition Genetics + Live Progression = Current Specimen
              </Formula>
            </Section>

            <Section
              id="lineage"
              number="05"
              icon={Sparkles}
              title="Individual Evolution Lineage"
              subtitle="Every edition moves forward through its own metadata snapshots rather than replacing its history."
            >
              <Flow
                steps={[
                  "Base Template #008",
                  "Ghosttail #109/178",
                  "Genesis / EVO 0",
                  "EVO I",
                  "EVO II",
                  "EVO III",
                ]}
              />

              <p className="mt-5">
                EVO II is derived from EVO I. Existing mutations and phenotype changes carry forward
                unless a later system explicitly modifies them. New evolution artwork should retain
                visual lineage instead of generating an unrelated creature.
              </p>

              <CodeBlock code={evolutionSnapshotExample} />

              <Callout>
                Evolution snapshots also make future Genetic Archive rollback possible. The archive
                is a state checkpoint, not a duplicate NFT.
              </Callout>
            </Section>

            <Section
              id="battle"
              number="06"
              icon={Gauge}
              title="Battle Engine"
              subtitle="The battle calculation is considered complete enough for the current prototype."
            >
              <StatusBanner tone="done" title="Battle math status: built">
                Next work should connect the existing calculation to matchup creation, persistence,
                XP awards, and cinematic replay generation rather than redesigning the score model.
              </StatusBanner>

              <Formula>
                Trial Score = Health × 25% + Attack × 30% + Defense × 20% + Speed × 15% + Average Current Move Power × 10%
              </Formula>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <ModifierCard label="Element Advantage" value="× 1.03" tone="good" />
                <ModifierCard label="Neutral" value="× 1.00" tone="neutral" />
                <ModifierCard label="Element Disadvantage" value="× 0.97" tone="bad" />
              </div>

              <Formula>Performance Multiplier = 0.90 + (Seeded Random Roll × 0.20)</Formula>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <IntensityCard range="0-5%" label="Close" text="Both specimens are competitive." />
                <IntensityCard range="5-15%" label="Clear" text="The winner has a noticeable advantage." />
                <IntensityCard range="15-25%" label="Dominant" text="The winner controls most of the encounter." />
                <IntensityCard range="25%+" label="Overwhelming" text="The winner delivers a decisive performance." />
              </div>

              <Callout>
                Same locked specimen snapshots + same trial seed = same official battle result.
              </Callout>
            </Section>

            <Section
              id="matchmaking"
              number="07"
              icon={Binary}
              title="Matchup Creation"
              subtitle="Matchmaking is the next missing battle system before video reconstruction."
            >
              <StatusBanner tone="next" title="Next battle milestone">
                The lobby currently presents an active specimen, arena selection, and unknown
                opponent. The next step is turning that interface into a canonical matchup record.
              </StatusBanner>

              <Flow
                steps={[
                  "Select specimen",
                  "Select arena",
                  "Find opponent",
                  "Create matchup",
                  "Lock both specimen snapshots",
                  "Generate seed",
                  "Run battle engine",
                ]}
              />

              <CodeBlock code={matchupExample} />

              <Callout>
                Snapshot locking prevents a level-up, mutation, or evolution that occurs after
                matchmaking from changing the already-created trial.
              </Callout>
            </Section>

            <Section
              id="replay"
              number="08"
              icon={WandSparkles}
              title="Grok Video Replay Pipeline"
              subtitle="AI renders the battle after deterministic game logic has already decided what happened."
            >
              <StatusBanner tone="next" title="Battle result to cinematic replay">
                Grok video should receive a completed replay package. It should never choose the
                winner, reroll the battle, or invent a different canonical sequence.
              </StatusBanner>

              <CodeBlock code={trialResultExample} />
              <CodeBlock code={replayExample} />

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <Principle icon={ShieldCheck} title="Canonical" text="Winner and event order are locked before AI generation." />
                <Principle icon={Zap} title="Immediate" text="The real game result resolves without waiting for video generation." />
                <Principle icon={Play} title="Cinematic" text="AI converts the official result into a watchable reconstruction." />
              </div>
            </Section>

            <Section
              id="xp"
              number="09"
              icon={Coins}
              title="XP Economy"
              subtitle="XP is the core progression resource and should remain separate from direct token spending."
            >
              <p>
                Battle participation is the primary active source of XP. XP belongs to the
                individual specimen and is spent on development. Simply holding XP should not
                increase combat power until the owner commits it to an actual progression action.
              </p>

              <Formula>Available XP = Lifetime XP - Spent XP</Formula>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <Principle icon={Trophy} title="Earn" text="Battles and approved progression activities create XP." />
                <Principle icon={FlaskConical} title="Research" text="XP funds specimen research and evolutionary development." />
                <Principle icon={Database} title="Persist" text="Progression is written to the individual specimen's live state." />
              </div>

              <Callout>
                Mutation is no longer treated as a separate button where the player directly buys a
                chosen trait. Mutations are outcomes of research and evolution.
              </Callout>
            </Section>

            <Section
              id="research"
              number="10"
              icon={FlaskConical}
              title="XP Research"
              subtitle="This is the core game research system that should ship before any real-world research layer."
            >
              <StatusBanner tone="next" title="Core progression system">
                Players spend earned XP to initiate research on a specimen. The player chooses the
                experiment. The engine resolves mutation expression with deterministic weighted
                randomness, while a separate discovery layer can expand the laboratory's known
                biological possibilities over time.
              </StatusBanner>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <ResearchChoice label="Research Path" detail="Structural, Metabolic, Neural, Cross-Species, Elemental, Defensive, Offensive, Mobility, or Wildcard." />
                <ResearchChoice label="Serum" detail="Optional. Narrows and biases outcomes but does not guarantee one exact mutation." />
                <ResearchChoice label="Intensity" detail="Low, Standard, or High. Trades stability against stronger or rarer expression." />
                <ResearchChoice label="Duration" detail="3, 7, 30, or 90 days. Longer work narrows variance, improves stability and evidence quality, and contributes more research hours." />
              </div>

              <CodeBlock code={researchInputExample} />
              <CodeBlock code={researchOutcomeExample} />

              <Formula>
                Mutation Expression Weight = Base Weight × Research Path × Serum × Genetics × Lineage × Duration Focus
              </Formula>
            </Section>

            <Section
              id="duration"
              number="11"
              icon={Activity}
              title="Research Duration"
              subtitle="Long research commitments should improve depth and consistency, not guarantee stronger creatures."
            >
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <DurationCard period="3 Days" title="Experimental" lines={["72 research hours", "Widest expression variance", "Lower confidence", "Fast discovery attempts"]} />
                <DurationCard period="7 Days" title="Standard" lines={["168 research hours", "Moderate variance", "Improved stability", "Stronger research evidence"]} />
                <DurationCard period="30 Days" title="Deep Research" lines={["720 research hours", "Tighter expression range", "High confidence", "Strong formula evidence"]} />
                <DurationCard period="90 Days" title="Long-Term Study" lines={["2,160 research hours", "Tightest expression range", "Highest predictability", "Deepest single-study evidence"]} />
              </div>

              <Callout>
                Duration primarily controls predictability and evidence quality. The simulation confirms
                that expression variance narrows substantially from 3 to 90 days while average expression
                strength remains approximately stable. Longer research should not simply mean stronger.
              </Callout>

              <Flow
                steps={[
                  "Research commitment",
                  "Accumulate path hours",
                  "Expand discovery eligibility",
                  "Resolve research",
                  "Update lab knowledge",
                  "Evolution ready",
                ]}
              />
            </Section>

            <Section
              id="discovery"
              number="12"
              icon={Dna}
              title="Mutation Discovery"
              subtitle="Research builds laboratory knowledge. The 600 authored mutations begin as a hidden discovery universe rather than a public shopping list."
            >
              <StatusBanner tone="next" title="Next research milestone">
                Add a discovery layer beside mutation expression. Completing research contributes
                cumulative hours to the selected path and creates deterministic opportunities to
                discover previously undocumented mutations.
              </StatusBanner>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                <CollectionStat label="Common Depth" value="24h" detail="Eligible for discovery" />
                <CollectionStat label="Uncommon Depth" value="72h" detail="Eligible for discovery" />
                <CollectionStat label="Rare Depth" value="168h" detail="Eligible for discovery" />
                <CollectionStat label="Epic Depth" value="720h" detail="Eligible for discovery" />
                <CollectionStat label="Legendary Depth" value="2,160h" detail="Eligible for discovery" />
              </div>

              <p className="mt-5">
                These thresholds unlock eligibility, not guaranteed rewards. A laboratory that reaches
                2,160 hours of Defensive research can encounter Legendary Defensive biology, but the
                discovery still uses seeded weighting and can resolve to lower-rarity or no new discovery.
                Research depth is cumulative, so many short studies can eventually reach deep discovery
                tiers just as a smaller number of long studies can.
              </p>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <Principle icon={FlaskConical} title="Lab Specialization" text="Research hours accumulate by path, allowing different labs to become known for different branches of biology." />
                <Principle icon={Dices} title="Eligibility, Not Guarantee" text="Hours open deeper rarity pools. They never guarantee that the next discovery is Rare, Epic, or Legendary." />
                <Principle icon={Database} title="Permanent Provenance" text="Discoveries record the lab, wallet, specimen, research job, path, research depth, timestamp, and first-global status." />
              </div>

              <Flow
                steps={[
                  "Run research",
                  "Add primary path hours",
                  "Add secondary path credit",
                  "Build undiscovered candidate pool",
                  "Roll discovery",
                  "Record lab knowledge",
                  "Enable future formula targeting",
                ]}
              />

              <Formula>
                Primary Path Research Credit = 100% of completed research hours
              </Formula>
              <Formula>
                Secondary Path Research Credit = 25% of completed research hours
              </Formula>

              <CodeBlock code={mutationDiscoveryExample} />

              <Callout>
                Discovery and expression are separate events. A lab may discover that Iron Hide exists
                without the current specimen expressing Iron Hide. Likewise, the first observed expression
                of an unknown mutation can also create its discovery record.
              </Callout>

              <Callout>
                Do not expose all 600 mutation names as an unlock checklist. The UI should show known
                mutations, research depth, and undocumented signatures so discovery retains mystery.
              </Callout>
            </Section>

            <Section
              id="serums"
              number="13"
              icon={Atom}
              title="Serums & Formulas"
              subtitle="Serums are probability-control tools. They make outcomes more consistent without removing uncertainty."
            >
              <p>
                The platform can provide a small set of baseline reference serums. The larger economy
                should come from lab-created formulas built from mutations the laboratory has actually
                discovered and supported with repeated research evidence. Formula creation is programmatic
                and does not require hand-producing unique art for every formula.
              </p>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <Principle icon={Dices} title="Raw Research" text="Broad search space and wider mutation distribution." />
                <Principle icon={FlaskConical} title="Serum" text="Strongly biases a known biological direction while preserving meaningful diversity among exact expressions." />
                <Principle icon={Database} title="Formula Evidence" text="Repeated observed outcomes create a research record and formula confidence." />
              </div>

              <CodeBlock code={serumExample} />

              <Formula>
                Formula = discovered biological knowledge + saved weighting strategy + observed evidence. Serum = usable instance manufactured from that formula.
              </Formula>

              <Callout>
                A lab-created formula may intentionally weight only mutations that laboratory has
                discovered. Serums should be predictable at the family or phenotype-cluster level without
                making every specimen converge on the exact same visual result.
              </Callout>

              <Callout>
                Use observed result rates when displaying historical test data. Only label values as
                exact probabilities when the engine mathematically guarantees that interpretation.
              </Callout>
            </Section>

            <Section
              id="clone"
              number="14"
              icon={Dna}
              title="Clone Research"
              subtitle="Clone testing is the premium intelligence layer and a natural place to charge because AI visualization has a real marginal cost."
            >
              <p>
                Clone research runs the same underlying research logic against a temporary,
                non-tradable research copy. It does not mutate the real NFT, earn battle XP, or create
                a second collectible. It exists only to test compatibility and produce evidence.
              </p>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <Principle icon={Binary} title="Simulation" text="Run repeated deterministic research simulations and aggregate the observed branches." />
                <Principle icon={Gauge} title="Intelligence" text="Return compatibility, likely mutation families, expected stat ranges, and research confidence." />
                <Principle icon={WandSparkles} title="AI Preview" text="Paid visual tier can generate a phenotype preview image for the clone result." />
              </div>

              <CodeBlock code={cloneResultExample} />

              <Callout>
                Clone results should normally be predictive rather than a guaranteed preview of the
                exact real evolution. When simulations encounter biology the lab has not discovered, the
                UI can report an undocumented signature without exposing the hidden canonical mutation name.
                A future premium lock mechanic could be designed separately if desired.
              </Callout>
            </Section>

            <Section
              id="evolution"
              number="15"
              icon={Sparkles}
              title="Evolution Process"
              subtitle="Evolution is the major developmental transformation. Mutation describes the traits expressed during that transformation."
            >
              <div className="grid gap-3 md:grid-cols-4">
                <EvolutionCard stage="Genesis" detail="Original form" />
                <EvolutionCard stage="EVO I" detail="First developed form" />
                <EvolutionCard stage="EVO II" detail="Advanced lineage" />
                <EvolutionCard stage="EVO III" detail="Final major stage" />
              </div>

              <Flow
                steps={[
                  "Earn XP",
                  "Choose research",
                  "Optional serum",
                  "Complete study",
                  "Resolve mutations",
                  "Apply lineage changes",
                  "Generate new image",
                  "Save evolution snapshot",
                ]}
              />

              <Formula>Evolution = how far the specimen has developed</Formula>
              <Formula>Mutations = what unique biological traits it acquired along the way</Formula>

              <Callout>
                Evolution imagery should compound earlier changes. EVO II inherits EVO I traits and
                adds new expression rather than regenerating from the Genesis image with unrelated anatomy.
              </Callout>

              <Callout>
                Mutation values are biological guidance, not ten decimal shades of the same artwork.
                The phenotype builder should translate expression into qualitative levels such as Subtle,
                Visible, Pronounced, and Dominant, then choose one primary visual driver and at most one
                secondary visual influence. Other mutations can remain mechanical, behavioral, metabolic,
                or latent. This keeps later evolutions coherent instead of mashing every acquired trait together.
              </Callout>
            </Section>

            <Section
              id="staking"
              number="16"
              icon={Coins}
              title="Token Research Funding"
              subtitle="A future staking loop can let collectors fund long research commitments and accumulate XP without making token balance equal direct power."
            >
              <p>
                SPEC or the eventual platform token can be locked against a specimen research program.
                The lock represents funding the lab. Longer commitments can receive better XP-rate
                multipliers, but the system should cap effective stake to limit direct pay-to-win behavior.
              </p>

              <CodeBlock
                code={`Research XP / Day = min(Staked Tokens, Effective Stake Cap)\n                  × Base XP Rate\n                  × Lock Multiplier`}
              />

              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <DurationCard period="3 Days" title="Research Funding" lines={["Shortest lock", "Base XP rate", "Low commitment"]} />
                <DurationCard period="7 Days" title="Research Funding" lines={["Small multiplier", "Standard commitment", "Useful for active players"]} />
                <DurationCard period="30 Days" title="Research Funding" lines={["Higher multiplier", "Deep study alignment", "Collector-friendly"]} />
                <DurationCard period="90 Days" title="Research Funding" lines={["Highest planned multiplier", "Long commitment", "Best research alignment"]} />
              </div>

              <Callout>
                The token funds progression. XP remains the resource actually spent on specimen development.
              </Callout>
            </Section>

            <Section
              id="advanced"
              number="17"
              icon={Award}
              title="Advanced Research"
              subtitle="Later expansion: connect high-level specimen research to real AI-assisted computational discovery."
            >
              <StatusBanner tone="later" title="Not required for launch">
                Build the game research economy first. Advanced Research introduces sponsor contracts,
                compute costs, scientific validation, IP terms, attribution, and financial rewards.
              </StatusBanner>

              <p>
                The long-term concept is a gamified front end for real computational search. Sponsors
                can fund defined research programs, the platform allocates AI or simulation work, and
                user/specimen research campaigns receive permanent provenance for their contributions.
              </p>

              <Flow
                steps={[
                  "Sponsor research bounty",
                  "Define measurable objective",
                  "AI proposes candidates",
                  "Computational screening",
                  "High-value candidates",
                  "External validation",
                  "Attribution",
                  "XP / achievement / possible bounty",
                ]}
              />

              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <ResearchChoice label="Materials" detail="Strong first target. Batteries, crystals, polymers, coatings, and other computationally searchable material properties." />
                <ResearchChoice label="Catalysts" detail="Commercially valuable search space with clear candidate ranking and later laboratory validation." />
                <ResearchChoice label="Engineering" detail="Optimization and design problems that can be evaluated through simulation or prototypes." />
                <ResearchChoice label="Biomedicine" detail="Potentially valuable later, but requires much stronger validation, regulation, and partner infrastructure." />
              </div>

              <Callout>
                A model score alone is not a breakthrough. Proposed results should progress through
                screened, replicated, selected, physically validated, and sponsor-defined breakthrough states.
              </Callout>

              <p className="mt-4">
                A specimen that contributes to a validated discovery can receive a permanent research
                achievement or unique lineage trait. Financial rewards, when offered, should come from
                sponsor-funded programs with explicit terms rather than being implied by ordinary game staking.
              </p>
            </Section>

            <Section
              id="architecture"
              number="18"
              icon={Database}
              title="Data Architecture"
              subtitle="Keep permanent identity, mutable game state, canonical outcomes, and generated media in separate layers."
            >
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                <ArchitectureCard
                  title="Base Template"
                  lines={[
                    "Base ID",
                    "Species",
                    "Element",
                    "Rarity",
                    "Base battle stats",
                    "3 inherited moves",
                    "Genesis artwork",
                  ]}
                />
                <ArchitectureCard
                  title="Edition Identity"
                  lines={[
                    "Token ID",
                    "Edition number",
                    "Edition supply",
                    "Finish",
                    "Genetics",
                    "Starting stats",
                    "Starting move powers",
                  ]}
                />
                <ArchitectureCard
                  title="Live State"
                  lines={[
                    "Level",
                    "XP",
                    "Research level",
                    "Research history",
                    "Mutations",
                    "Evolution stage",
                    "Current combat stats",
                  ]}
                />
                <ArchitectureCard
                  title="Lab Knowledge"
                  lines={[
                    "Research hours by path",
                    "Discovered mutation IDs",
                    "Research level",
                    "Known formulas",
                    "Discovery provenance",
                    "Undocumented signature count",
                  ]}
                />
                <ArchitectureCard
                  title="History / Media"
                  lines={[
                    "Evolution snapshots",
                    "Current image CID",
                    "Historical images",
                    "Trial JSON",
                    "Replay video",
                    "Clone preview media",
                    "Archive checkpoints",
                  ]}
                />
              </div>

              <Callout>
                The 33,300 Standard edition JSON files describe starting collectible state. Live
                progression should be stored separately by the game backend and can later be reflected
                into token metadata or onchain checkpoints when appropriate.
              </Callout>
            </Section>

            <Section
              id="files"
              number="19"
              icon={Braces}
              title="TypeScript File Roadmap"
              subtitle="The next code should be modular math and orchestration rather than another giant content library."
            >
              <h3 className="font-black uppercase tracking-wide text-[#dedad1]">Research</h3>
              <FileRoadmap items={researchFileRoadmap} />

              <h3 className="mt-7 font-black uppercase tracking-wide text-[#dedad1]">Battle Orchestration</h3>
              <FileRoadmap items={battleFileRoadmap} />

              <Callout>
                Existing mutation-library.ts remains the authored pool of 600 possible biological outcomes,
                but the discovery layer controls which mutations each lab actually knows. Existing move-library.ts
                remains the permanent move interpretation layer for cinematic reconstruction.
              </Callout>
            </Section>

            <Section
              id="milestones"
              number="20"
              icon={Trophy}
              title="Recommended Build Milestones"
              subtitle="A practical sequence from the current prototype to a complete playable loop."
            >
              <div className="grid gap-2">
                {[
                  ["M1", "Finish matchup creation and immutable specimen battle snapshots."],
                  ["M2", "Run the existing battle engine from the matchup record and save canonical Trial JSON."],
                  ["M3", "Award XP from trusted backend logic and update live specimen state."],
                  ["M4", "Build battle-replay.ts and the Grok video adapter."],
                  ["M5", "Integrate the completed deterministic research engine with persistent specimen state."],
                  ["M6", "Add lab research hours, mutation discovery eligibility, discovery rolls, and provenance."],
                  ["M7", "Gate lab-created formula targeting behind discovered mutation knowledge."],
                  ["M8", "Connect clone simulations, research trees, formula analytics, and certification."],
                  ["M9", "Implement evolution snapshots, hierarchical phenotype guidance, and AI evolution artwork."],
                  ["M10", "Add production 3 / 7 / 30 / 90 day commitments and optional token research funding."],
                  ["M11", "Run large simulations and tune discovery pace, serum concentration, rarity, stability, and anomaly behavior."],
                  ["M12", "Add discovery history, formula provenance, and serum marketplace mechanics."],
                  ["M13", "Explore sponsored Advanced Research only after the core game loop is working."],
                ].map(([code, step], index, steps) => (
                  <div key={code} className="flex items-center gap-3 rounded-lg border border-[#292823] bg-[#080a0b] px-4 py-3">
                    <div className="grid size-9 shrink-0 place-items-center rounded-md border border-[#a97826]/30 bg-[#a97826]/[0.06] text-[10px] font-black text-[#d2a143]">
                      {code}
                    </div>
                    <span className="text-sm font-semibold text-[#aaa69d]">{step}</span>
                    {index < steps.length - 1 && <ChevronRight size={15} className="ml-auto hidden text-[#4f504c] sm:block" />}
                  </div>
                ))}
              </div>
            </Section>

            <Section
              id="decisions"
              number="21"
              icon={ShieldCheck}
              title="Locked Decisions & Guardrails"
              subtitle="Decisions that should remain stable unless there is a deliberate design change."
            >
              <div className="grid gap-3 md:grid-cols-2">
                <Decision title="AI never decides battle winners" text="The deterministic battle engine resolves the official outcome first. AI only reconstructs it visually." />
                <Decision title="Individual editions evolve" text="The base 333 templates remain shared origins. Each token develops its own lineage." />
                <Decision title="Evolution history is preserved" text="Create stage snapshots instead of destructively replacing all earlier metadata." />
                <Decision title="Phenotypes use visual hierarchy" text="AI receives one primary visual mutation, at most one secondary visual influence, inherited lineage, and qualitative expression guidance instead of every mutation as an equal art instruction." />
                <Decision title="Mutations are outcomes" text="Players choose the research experiment, not an exact mutation from a purchase menu." />
                <Decision title="Serums narrow directions" text="Serums provide strong family or phenotype-cluster consistency while preserving diversity among exact mutation and visual outcomes." />
                <Decision title="The 600 mutations begin hidden" text="The authored mutation library is a discovery universe. Players see their lab's known biology and undocumented signatures rather than a complete unlock checklist." />
                <Decision title="Research hours unlock eligibility" text="24 / 72 / 168 / 720 / 2,160 hour depth thresholds open Common through Legendary discovery pools. Reaching a threshold never guarantees that rarity." />
                <Decision title="Discovery is separate from expression" text="A lab can discover a mutation without the active specimen expressing it, and first observation of an unknown expression can create a discovery record." />
                <Decision title="Formulas require knowledge" text="Lab-created formulas can intentionally weight only mutations the laboratory has discovered and supported with evidence." />
                <Decision title="Clone research is informational" text="Clone tests do not alter the real specimen and can support paid AI phenotype previews." />
                <Decision title="XP is progression currency" text="Battle and approved research activity produce XP. XP is spent on development." />
                <Decision title="Token staking is optional funding" text="Token locks may generate research XP later, but effective stake should be capped to reduce pay-to-win pressure." />
                <Decision title="Advanced Research is later" text="Real-world computational research is an expansion, not a dependency for launching the core game." />
                <Decision title="Scientific claims require validation" text="Real-world candidate discovery must distinguish model output from independently validated results." />
              </div>
            </Section>
          </div>
        </div>
      </main>
    </div>
  );
}

function Section({
  id,
  number,
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  id: string;
  number: string;
  icon: IconType;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="bd-panel scroll-mt-28 rounded-xl p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <div className="grid size-11 shrink-0 place-items-center rounded-lg border border-[#a97826]/30 bg-[#a97826]/[0.06] text-[#d2a143]">
          <Icon size={20} />
        </div>
        <div>
          <div className="text-[9px] font-black uppercase tracking-[0.24em] text-[#645f54]">
            Archive {number}
          </div>
          <h2 className="mt-1 text-xl font-black uppercase tracking-[0.04em] text-[#e4dfd4] sm:text-2xl">
            {title}
          </h2>
          <p className="mt-1 text-sm leading-6 text-[#74797b]">{subtitle}</p>
        </div>
      </div>

      <div className="mt-5 text-sm leading-7 text-[#929596]">{children}</div>
    </section>
  );
}

function StatusSummary({ label, value, tone }: { label: string; value: string; tone: StatusTone }) {
  const styles: Record<StatusTone, string> = {
    done: "border-[#69744e]/25 bg-[#69744e]/[0.05] text-[#aeb58b]",
    active: "border-[#8e702c]/30 bg-[#8e702c]/[0.06] text-[#d2a143]",
    next: "border-[#8e702c]/30 bg-[#8e702c]/[0.06] text-[#d2a143]",
    later: "border-[#34322c] bg-[#0a0c0d] text-[#aaa69d]",
    concept: "border-[#5f547a]/25 bg-[#5f547a]/[0.05] text-[#afa3c6]",
  };

  return (
    <div className={`rounded-lg border p-4 ${styles[tone]}`}>
      <div className="text-[9px] font-black uppercase tracking-[0.18em] opacity-70">{label}</div>
      <div className="mt-2 text-xl font-black uppercase tracking-wide">{value}</div>
    </div>
  );
}

function StatusBanner({ tone, title, children }: { tone: StatusTone; title: string; children: ReactNode }) {
  const styles: Record<StatusTone, string> = {
    done: "border-[#69744e]/25 bg-[#69744e]/[0.05] text-[#aeb58b]",
    active: "border-[#8e702c]/25 bg-[#8e702c]/[0.05] text-[#d2c3a6]",
    next: "border-[#8e702c]/25 bg-[#8e702c]/[0.05] text-[#d2c3a6]",
    later: "border-[#34322c] bg-[#0a0c0d] text-[#aaa69d]",
    concept: "border-[#5f547a]/25 bg-[#5f547a]/[0.05] text-[#afa3c6]",
  };

  return (
    <div className={`mb-4 rounded-lg border px-4 py-3 ${styles[tone]}`}>
      <div className="text-[10px] font-black uppercase tracking-[0.16em]">{title}</div>
      <div className="mt-1 text-sm leading-6 opacity-80">{children}</div>
    </div>
  );
}

function RoadmapCard({ status, title, items }: { status: StatusTone; title: string; items: string[] }) {
  const labels: Record<StatusTone, string> = {
    done: "Built",
    active: "Active",
    next: "Next",
    later: "Later",
    concept: "Concept",
  };

  return (
    <div className="rounded-lg border border-[#292823] bg-[#080a0b] p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-black uppercase tracking-wide text-[#dedad1]">{title}</h3>
        <StatusChip tone={status}>{labels[status]}</StatusChip>
      </div>
      <div className="mt-3 space-y-1.5">
        {items.map((item) => (
          <div key={item} className="flex gap-2 text-xs leading-5 text-[#7e8384]">
            <span className="mt-2 size-1 shrink-0 rounded-full bg-[#7f642f]" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusChip({ tone, children }: { tone: StatusTone; children: ReactNode }) {
  const styles: Record<StatusTone, string> = {
    done: "border-[#69744e]/25 bg-[#69744e]/[0.08] text-[#aeb58b]",
    active: "border-[#8e702c]/25 bg-[#8e702c]/[0.08] text-[#d2a143]",
    next: "border-[#8e702c]/25 bg-[#8e702c]/[0.08] text-[#d2a143]",
    later: "border-[#34322c] bg-[#0a0c0d] text-[#85898b]",
    concept: "border-[#5f547a]/25 bg-[#5f547a]/[0.08] text-[#afa3c6]",
  };

  return (
    <span className={`rounded-md border px-2 py-1 text-[9px] font-black uppercase tracking-wider ${styles[tone]}`}>
      {children}
    </span>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="bd-scrollbar mt-4 overflow-x-auto rounded-lg border border-[#292823] bg-[#030405] p-4 text-[12px] leading-6 text-[#c9bea8]">
      <code>{code}</code>
    </pre>
  );
}

function Formula({ children }: { children: ReactNode }) {
  return (
    <div className="mt-3 rounded-lg border border-[#8e702c]/25 bg-[#8e702c]/[0.05] px-4 py-3 font-mono text-xs leading-6 text-[#d2c3a6] sm:text-sm">
      {children}
    </div>
  );
}

function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 rounded-lg border border-[#8e702c]/25 bg-[#8e702c]/[0.045] px-4 py-3 text-sm text-[#c7b996]">
      {children}
    </div>
  );
}

function Pill({ icon: Icon, children }: { icon: IconType; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-[#34322c] bg-[#0a0c0d] px-3 py-1.5 text-xs font-bold text-[#aaa69d]">
      <Icon size={13} className="text-[#b98a38]" />
      {children}
    </span>
  );
}

function DocLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="block rounded-md px-3 py-2 text-xs font-semibold text-[#676c6e] transition hover:bg-[#a97826]/[0.05] hover:text-[#d2a143]">
      {children}
    </a>
  );
}

function CollectionStat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-lg border border-[#292823] bg-[#080a0b] p-4">
      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#666056]">{label}</p>
      <p className="mt-2 text-2xl font-black text-[#d5a343]">{value}</p>
      <p className="mt-1 text-xs text-[#656a6b]">{detail}</p>
    </div>
  );
}

function ModifierCard({ label, value, tone }: { label: string; value: string; tone: "good" | "neutral" | "bad" }) {
  const styles = {
    good: "border-[#69744e]/25 bg-[#69744e]/[0.05] text-[#aeb58b]",
    neutral: "border-[#34322c] bg-[#0a0c0d] text-[#aaa69d]",
    bad: "border-[#7a4d46]/25 bg-[#7a4d46]/[0.05] text-[#bd8b82]",
  };

  return (
    <div className={`rounded-lg border p-4 ${styles[tone]}`}>
      <p className="text-xs font-bold uppercase tracking-wide">{label}</p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}

function IntensityCard({ range, label, text }: { range: string; label: string; text: string }) {
  return (
    <div className="rounded-lg border border-[#34322c] bg-[#080a0b] p-4">
      <p className="text-lg font-black text-[#d2a143]">{range}</p>
      <p className="mt-1 font-black uppercase tracking-wide text-[#dedad1]">{label}</p>
      <p className="mt-2 text-xs leading-5 text-[#6f7475]">{text}</p>
    </div>
  );
}

function Principle({ icon: Icon, title, text }: { icon: IconType; title: string; text: string }) {
  return (
    <div className="rounded-lg border border-[#34322c] bg-[#080a0b] p-4">
      <Icon size={19} className="text-[#d2a143]" />
      <p className="mt-3 font-black uppercase tracking-wide text-[#dedad1]">{title}</p>
      <p className="mt-1 text-xs leading-5 text-[#6f7475]">{text}</p>
    </div>
  );
}

function ResearchChoice({ label, detail }: { label: string; detail: string }) {
  return (
    <div className="rounded-lg border border-[#34322c] bg-[#080a0b] p-4">
      <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#d2a143]">{label}</div>
      <p className="mt-2 text-xs leading-5 text-[#7f8485]">{detail}</p>
    </div>
  );
}

function DurationCard({ period, title, lines }: { period: string; title: string; lines: string[] }) {
  return (
    <div className="rounded-lg border border-[#34322c] bg-[#080a0b] p-4">
      <div className="text-2xl font-black text-[#d2a143]">{period}</div>
      <div className="mt-1 text-xs font-black uppercase tracking-wide text-[#dedad1]">{title}</div>
      <div className="mt-3 space-y-1.5">
        {lines.map((line) => (
          <div key={line} className="flex gap-2 text-xs leading-5 text-[#737879]">
            <span className="mt-2 size-1 shrink-0 rounded-full bg-[#7f642f]" />
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

function EvolutionCard({ stage, detail }: { stage: string; detail: string }) {
  return (
    <div className="rounded-lg border border-[#8e702c]/20 bg-[#0a0c0d] p-4 text-center">
      <p className="text-lg font-black uppercase tracking-[0.08em] text-[#d2a143]">{stage}</p>
      <p className="mt-1 text-xs text-[#696d6e]">{detail}</p>
    </div>
  );
}

function ArchitectureCard({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="rounded-lg border border-[#34322c] bg-[#080a0b] p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#d2a143]">{title}</p>
      <div className="mt-3 space-y-1.5">
        {lines.map((line) => (
          <div key={line} className="flex items-center gap-2 text-xs text-[#85898b]">
            <span className="size-1 rounded-full bg-[#7f642f]" />
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

function Flow({ steps }: { steps: string[] }) {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-2">
      {steps.map((step, index) => (
        <div key={`${step}-${index}`} className="flex items-center gap-2">
          <div className="rounded-md border border-[#34322c] bg-[#080a0b] px-3 py-2 text-xs font-bold text-[#aaa69d]">
            {step}
          </div>
          {index < steps.length - 1 && <ChevronRight size={14} className="text-[#675b45]" />}
        </div>
      ))}
    </div>
  );
}

function FileRoadmap({ items }: { items: string[][] }) {
  return (
    <div className="mt-3 overflow-hidden rounded-lg border border-[#292823]">
      {items.map(([file, purpose], index) => (
        <div key={file} className={`grid gap-1 bg-[#080a0b] px-4 py-3 md:grid-cols-[220px_minmax(0,1fr)] ${index > 0 ? "border-t border-[#292823]" : ""}`}>
          <code className="text-xs font-bold text-[#d2a143]">{file}</code>
          <div className="text-xs leading-5 text-[#7d8283]">{purpose}</div>
        </div>
      ))}
    </div>
  );
}

function Decision({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-[#34322c] bg-[#080a0b] p-4">
      <div className="flex items-start gap-3">
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#d2a143]" />
        <div>
          <div className="font-black uppercase tracking-wide text-[#dedad1]">{title}</div>
          <p className="mt-1 text-xs leading-5 text-[#74797b]">{text}</p>
        </div>
      </div>
    </div>
  );
}
