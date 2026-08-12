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
    {
      "slot": 1,
      "name": "Primal Chomp",
      "base_power": 78
    },
    {
      "slot": 2,
      "name": "Wild Claw",
      "base_power": 45
    },
    {
      "slot": 3,
      "name": "Primal Rush",
      "base_power": 63
    }
  ],

  "starting_state": {
    "level": 1,
    "xp": 0,
    "evolution_stage": 0,
    "mutations": []
  }
}`;

const specimenStateExample = `{
  "token_id": 8472,
  "base_id": 1,

  "name": "Echoguard",
  "edition": 37,
  "edition_supply": 99,

  "element": "Primal",
  "image": "ipfs://CURRENT_IMAGE",

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
  },

  "moves": [
    {
      "slot": 1,
      "name": "Primal Chomp",
      "power": 82
    },
    {
      "slot": 2,
      "name": "Wild Claw",
      "power": 44
    },
    {
      "slot": 3,
      "name": "Primal Rush",
      "power": 64
    }
  ],

  "level": 1,

  "xp": {
    "lifetime": 0,
    "spent": 0,
    "available": 0
  },

  "evolution_stage": 0,
  "mutations": []
}`;

const progressionExample = `{
  "token_id": 8472,

  "level": 18,

  "xp": {
    "lifetime": 1840,
    "spent": 900,
    "available": 940
  },

  "evolution_stage": 2,

  "mutations": [
    {
      "id": "rhino_splice",
      "name": "Rhino Splice",
      "family": "Cross-Species",
      "acquired_at_level": 7,
      "evolution_stage": 1
    },
    {
      "id": "iron_hide",
      "name": "Iron Hide",
      "family": "Natural",
      "acquired_at_level": 14,
      "evolution_stage": 2
    }
  ]
}`;

const mutationExample = `Base Attack:       81
Edition Genetics:  × 0.98
Starting Attack:   79

Level Progression:
+ stat growth

Mutation:
Rhino Splice
+ health / defense bias

Evolution:
EVO II
+ mature body form
+ increased power ceiling
+ updated artwork

Result:
CURRENT combat state is saved

The trial engine uses CURRENT values.
Genetics and mutation bonuses are not applied twice.`;

const moveContextExample = `{
  "name": "Acid Bellow",
  "element": "Venom",
  "attackType": "roar",
  "contact": "ranged",
  "animation": "The dinosaur throws its head forward, opens its jaws, and blasts a stream of corrosive venom directly toward the opponent."
}`;

const trialResultExample = `{
  "trial_id": 1927,
  "seed": "982731498123",

  "specimen_a": {
    "token_id": 8472,
    "name": "Echoguard",
    "edition": "37/99"
  },

  "specimen_b": {
    "token_id": 19104,
    "name": "Stonebreaker",
    "edition": "14/42"
  },

  "winner_token_id": 8472,
  "winner": "Echoguard",

  "trial_intensity": "close",

  "score": {
    "Echoguard": 79.58,
    "Stonebreaker": 76.90
  },

  "sequence": [
    {
      "attacker": "Stonebreaker",
      "move": "Granite Slam",
      "result": "hit"
    },
    {
      "attacker": "Echoguard",
      "move": "Wild Claw",
      "result": "hit"
    },
    {
      "attacker": "Stonebreaker",
      "move": "Stone Crusher",
      "result": "hit"
    },
    {
      "attacker": "Echoguard",
      "move": "Primal Rush",
      "result": "critical"
    },
    {
      "attacker": "Echoguard",
      "move": "Primal Chomp",
      "result": "finisher"
    }
  ]
}`;

const xpAwardExample = `{
  "trial_id": 1927,

  "awards": [
    {
      "token_id": 8472,
      "result": "win",
      "xp_awarded": 80
    },
    {
      "token_id": 19104,
      "result": "loss",
      "xp_awarded": 35
    }
  ]
}`;

const screenplayExample = `Scene 1
Echoguard and Stonebreaker enter Frostfang Arena.

Scene 2
Stonebreaker charges first and lands Granite Slam.

Scene 3
Echoguard recovers and counters with Wild Claw.

Scene 4
Stonebreaker lands Stone Crusher and forces Echoguard backward.

Scene 5
Echoguard surges forward with Primal Rush and lands a critical hit.

Scene 6
Echoguard uses Primal Chomp as the finishing attack.

Scene 7
Echoguard stands victorious as Stonebreaker recovers in the arena.`;

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#050708] pb-24 text-[#e8e4db] md:pb-0">
      <AppNavigation />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-[#292823]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(185,133,47,0.12),transparent_38%),radial-gradient(circle_at_15%_30%,rgba(255,255,255,0.025),transparent_28%)]" />

          <div className="relative mx-auto max-w-[1450px] px-4 py-12 sm:px-6 md:py-16 xl:px-10">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-md border border-[#a97826]/30 bg-[#a97826]/[0.06] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.24em] text-[#d2a143]">
                <BookOpen size={12} />
                Project 333 / Genesis Archive
              </div>

              <p className="mt-5 text-[10px] font-black uppercase tracking-[0.34em] text-[#75664e]">
                Classified Specimen Documentation
              </p>

              <h1 className="specimen-title mt-3 text-4xl sm:text-5xl md:text-6xl">
                Specimen Research Archive
              </h1>

              <p className="mt-5 max-w-3xl text-sm leading-7 text-[#85898b] sm:text-base">
                The Genesis Series begins with 333 original prehistoric genetic
                templates. Individual specimens inherit those templates, receive
                unique genetic variation, and develop independently through
                combat trials, XP, mutation, and evolution.
              </p>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#85898b] sm:text-base">
                Trial outcomes are resolved by deterministic game logic before
                cinematic reconstruction begins. AI does not select the winner.
                It receives the completed trial record and renders the result.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <Pill icon={Dna}>333 Genetic Templates</Pill>
                <Pill icon={PackageOpen}>36,000 Specimens</Pill>
                <Pill icon={Zap}>738 Named Moves</Pill>
                <Pill icon={Dices}>Seeded Trials</Pill>
                <Pill icon={Sparkles}>Evolution System</Pill>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-[1450px] gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] xl:px-10">
          {/* SIDEBAR */}
          <aside className="hidden lg:block">
            <div className="bd-panel sticky top-[94px] rounded-xl p-3">
              <p className="px-3 pb-2 pt-2 text-[9px] font-black uppercase tracking-[0.22em] text-[#645f54]">
                Archive Index
              </p>

              <DocLink href="#series">01. Genesis Series</DocLink>
              <DocLink href="#template">02. Genetic Template</DocLink>
              <DocLink href="#edition">03. Individual Specimen</DocLink>
              <DocLink href="#genetics">04. Genetics</DocLink>
              <DocLink href="#progression">05. XP & Progression</DocLink>
              <DocLink href="#mutations">06. Mutations</DocLink>
              <DocLink href="#evolution">07. Evolution</DocLink>
              <DocLink href="#current-state">08. Combat State</DocLink>
              <DocLink href="#trial-score">09. Trial Score</DocLink>
              <DocLink href="#elements">10. Elements</DocLink>
              <DocLink href="#randomness">11. Randomness</DocLink>
              <DocLink href="#moves">12. Move Library</DocLink>
              <DocLink href="#intensity">13. Trial Intensity</DocLink>
              <DocLink href="#sequence">14. Trial Sequence</DocLink>
              <DocLink href="#xp-award">15. XP Awards</DocLink>
              <DocLink href="#replay">16. Reconstruction</DocLink>
              <DocLink href="#architecture">17. Data Architecture</DocLink>
              <DocLink href="#pipeline">18. Full Pipeline</DocLink>
            </div>
          </aside>

          <div className="min-w-0 space-y-5">
            {/* 01 */}
            <Section
              id="series"
              number="01"
              icon={PackageOpen}
              title="Genesis Series"
              subtitle="The first SPECIMEN release contains 36,000 collectible subjects derived from Project 333."
            >
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <CollectionStat
                  label="Standard"
                  value="33,300"
                  detail="Primary circulation"
                />
                <CollectionStat
                  label="Reverse Holo"
                  value="1,767"
                  detail="Special finish"
                />
                <CollectionStat
                  label="Holo"
                  value="600"
                  detail="Scarce finish"
                />
                <CollectionStat
                  label="1/1 Alt Art"
                  value="333"
                  detail="One per template"
                />
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <CollectionStat
                  label="Total Supply"
                  value="36,000"
                  detail="Genesis Series"
                />
                <CollectionStat
                  label="Pack Size"
                  value="5"
                  detail="Specimens per sealed pack"
                />
                <CollectionStat
                  label="Pack Supply"
                  value="7,200"
                  detail="If entire series is packed"
                />
              </div>

              <p className="mt-5">
                The 333 one-of-one alternate artworks correspond to the 333
                original Project 333 templates. Each named genetic template has
                one unique alternate-art specimen in addition to its standard
                and special-finish circulation.
              </p>

              <Callout>
                Finish changes collectibility and presentation. It does not
                automatically make a specimen stronger in combat.
              </Callout>
            </Section>

            {/* 02 */}
            <Section
              id="template"
              number="02"
              icon={Braces}
              title="Original Genetic Template"
              subtitle="Project 333 contains the 333 original viable prehistoric genetic definitions."
            >
              <p>
                Each template defines one named specimen line. Echoguard is one
                template. Every Echoguard specimen inherits its species,
                element, visual identity, base combat profile, and three move
                identities from this shared genetic definition.
              </p>

              <CodeBlock code={baseMetadataExample} />

              <Callout>
                The shared template does not personally earn XP, mutate, or
                evolve. Individual specimens do.
              </Callout>
            </Section>

            {/* 03 */}
            <Section
              id="edition"
              number="03"
              icon={Dna}
              title="Individual Specimen"
              subtitle="Every collectible subject becomes its own independently developing organism."
            >
              <p>
                Named specimen lines have variable supply. Echoguard has 99
                standard editions. Echoguard 37/99 and Echoguard 53/99 begin
                from the same genetic template and use the same Genesis
                artwork, element, species, and move names.
              </p>

              <p className="mt-3">
                They are still separate subjects because each receives its own
                genetics roll and maintains its own progression history.
              </p>

              <CodeBlock code={specimenStateExample} />

              <Callout>
                Two specimens can begin almost identical and eventually become
                dramatically different through leveling, mutations, evolution,
                and new artwork.
              </Callout>
            </Section>

            {/* 04 */}
            <Section
              id="genetics"
              number="04"
              icon={Dna}
              title="Genetic Variation"
              subtitle="Edition genetics introduce small permanent differences between specimens from the same template."
            >
              <Formula>
                Starting Stat = Base Genetic Template Stat × Specimen Genetics
              </Formula>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <StatTile label="Health" value="80 × 1.02" result="82" />
                <StatTile label="Attack" value="81 × 0.98" result="79" />
                <StatTile label="Defense" value="70 × 1.04" result="73" />
                <StatTile label="Speed" value="72 × 1.01" result="73" />
              </div>

              <Callout>
                Genetics are part of the specimen's original identity. They do
                not change every time the specimen enters a trial.
              </Callout>
            </Section>

            {/* 05 */}
            <Section
              id="progression"
              number="05"
              icon={Coins}
              title="XP & Progression"
              subtitle="Completed trials generate XP that belongs to the individual specimen."
            >
              <p>
                XP is a progression resource rather than a transferable token.
                Owners can save XP or allocate it toward leveling, mutation
                procedures, and evolutionary development.
              </p>

              <Formula>
                Available XP = Lifetime XP - Spent XP
              </Formula>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <ProgressCard
                  label="Lifetime XP"
                  value="1,840"
                  description="All XP ever earned"
                />
                <ProgressCard
                  label="Spent XP"
                  value="900"
                  description="Allocated to development"
                />
                <ProgressCard
                  label="Available XP"
                  value="940"
                  description="Available for research"
                />
              </div>

              <CodeBlock code={progressionExample} />

              <Callout>
                Holding XP does not directly increase combat strength. XP must
                first be spent on progression that changes the specimen's
                current state.
              </Callout>
            </Section>

            {/* 06 */}
            <Section
              id="mutations"
              number="06"
              icon={FlaskConical}
              title="Mutations"
              subtitle="Mutations are acquired biological traits that make individual specimens increasingly unique."
            >
              <p>
                Mutation procedures can modify anatomy, combat specialization,
                visual appearance, passives, or future evolutionary direction.
                Mutations persist as part of the specimen's developmental
                history.
              </p>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <MutationExample
                  name="Rhino Splice"
                  lines={[
                    "Cross-species mutation",
                    "Higher health potential",
                    "Higher defense potential",
                    "Can influence horn / skull development",
                  ]}
                />

                <MutationExample
                  name="Iron Hide"
                  lines={[
                    "Natural mutation",
                    "Higher defense potential",
                    "More armored visual anatomy",
                    "Persists through future evolution",
                  ]}
                />
              </div>

              <Callout>
                Mutation answers the question: what biological changes has this
                specimen acquired?
              </Callout>
            </Section>

            {/* 07 */}
            <Section
              id="evolution"
              number="07"
              icon={Sparkles}
              title="Evolution"
              subtitle="Evolution is a major developmental stage rather than a single acquired trait."
            >
              <div className="grid gap-3 md:grid-cols-4">
                <EvolutionCard stage="Genesis" detail="Original form" />
                <EvolutionCard stage="EVO I" detail="First mature form" />
                <EvolutionCard stage="EVO II" detail="Advanced development" />
                <EvolutionCard stage="EVO III" detail="Final major stage" />
              </div>

              <p className="mt-5">
                Evolution can increase the specimen's power ceiling, mature its
                anatomy, compound existing mutations, upgrade moves, and produce
                new artwork.
              </p>

              <Formula>
                Evolution = how far the specimen has developed
              </Formula>

              <Formula>
                Mutations = what unique biological traits it acquired along the
                way
              </Formula>
            </Section>

            {/* 08 */}
            <Section
              id="current-state"
              number="08"
              icon={Database}
              title="Current Combat State"
              subtitle="The trial engine evaluates the specimen as it exists at the moment the trial begins."
            >
              <p>
                Genetics, leveling, mutations, and evolution are resolved into
                current combat stats and current move powers before the trial
                begins.
              </p>

              <CodeBlock code={mutationExample} />

              <Formula>
                Base Template + Genetics + Leveling + Mutations + Evolution =
                Current Combat State
              </Formula>

              <Callout>
                This prevents double counting. If Rhino Splice already increased
                the stored current defense value, the trial engine does not
                apply Rhino Splice to defense again.
              </Callout>
            </Section>

            {/* 09 */}
            <Section
              id="trial-score"
              number="09"
              icon={Gauge}
              title="Calculate Trial Score"
              subtitle="The deterministic engine compares the specimens using their current combat values."
            >
              <Formula>
                Trial Score = Health × 25% + Attack × 30% + Defense × 20% +
                Speed × 15% + Average Current Move Power × 10%
              </Formula>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                <StatTile label="Health" value="82 × .25" result="20.50" />
                <StatTile label="Attack" value="79 × .30" result="23.70" />
                <StatTile label="Defense" value="73 × .20" result="14.60" />
                <StatTile label="Speed" value="73 × .15" result="10.95" />
                <StatTile label="Moves" value="63.33 × .10" result="6.33" />
              </div>

              <Callout>
                Echoguard 37/99 current trial score:{" "}
                <strong>76.08</strong>
              </Callout>
            </Section>

            {/* 10 */}
            <Section
              id="elements"
              number="10"
              icon={Atom}
              title="Elemental Matchups"
              subtitle="Elements create strategic advantages without automatically deciding the result."
            >
              <p>
                Every original genetic template has an element. Elemental
                matchups can modify combat performance by a modest amount.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <ModifierCard
                  label="Advantaged"
                  value="× 1.07"
                  tone="good"
                />
                <ModifierCard
                  label="Neutral"
                  value="× 1.00"
                  tone="neutral"
                />
                <ModifierCard
                  label="Disadvantaged"
                  value="× 0.93"
                  tone="bad"
                />
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  "Ember",
                  "Frost",
                  "Storm",
                  "Stone",
                  "Venom",
                  "Shadow",
                  "Primal",
                  "Solar",
                  "Tide",
                  "Void",
                ].map((element) => (
                  <span
                    key={element}
                    className="rounded-md border border-[#34322c] bg-[#0a0c0d] px-3 py-1.5 text-xs font-bold text-[#a5a097]"
                  >
                    {element}
                  </span>
                ))}
              </div>

              <Callout>
                The final element interaction chart can be rebalanced without
                changing the underlying specimen metadata.
              </Callout>
            </Section>

            {/* 11 */}
            <Section
              id="randomness"
              number="11"
              icon={Dices}
              title="Seeded Trial Randomness"
              subtitle="Randomness creates uncertainty while keeping official outcomes reproducible."
            >
              <Formula>Random Roll = 0.00 to 1.00</Formula>

              <Formula>
                Performance Multiplier = 0.90 + (Random Roll × 0.20)
              </Formula>

              <div className="mt-4 rounded-lg border border-[#302f29] bg-[#060809] p-4 font-mono text-sm leading-7 text-[#bcb4a4]">
                <div>Current trial score: 76.08</div>
                <div>Random roll: 0.73</div>
                <div>0.90 + (0.73 × 0.20) = 1.046</div>
                <div>76.08 × 1.046 = 79.58</div>
              </div>

              <p className="mt-4">
                One trial seed generates separate deterministic rolls for
                performance, initiative, move selection, hits, criticals, and
                the final attack.
              </p>

              <CodeBlock
                code={`Trial seed: 982731498123

derive(seed, "specimen-a-performance")
derive(seed, "specimen-b-performance")
derive(seed, "initiative")
derive(seed, "move-1")
derive(seed, "move-2")
derive(seed, "move-3")
derive(seed, "hit")
derive(seed, "critical")
derive(seed, "finisher")
derive(seed, "arena")`}
              />

              <Callout>
                Same specimen snapshots + same seed = same official result.
              </Callout>
            </Section>

            {/* 12 */}
            <Section
              id="moves"
              number="12"
              icon={Zap}
              title="Move Library"
              subtitle="The Genesis Series currently contains 738 unique named move definitions."
            >
              <p>
                Every original template inherits three named moves. Copies of
                the same specimen line keep those same three move identities,
                while individual genetics and progression can alter their
                current power values.
              </p>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <MoveCard
                  name="Primal Chomp"
                  power={82}
                  chance="43.2%"
                />
                <MoveCard
                  name="Wild Claw"
                  power={44}
                  chance="23.2%"
                />
                <MoveCard
                  name="Primal Rush"
                  power={64}
                  chance="33.7%"
                />
              </div>

              <Formula>Total Move Weight = 82 + 44 + 64 = 190</Formula>

              <p className="mt-5">
                Each unique move also has a permanent action definition used by
                replay reconstruction.
              </p>

              <CodeBlock code={moveContextExample} />

              <Callout>
                The replay model does not invent what Acid Bellow means. The
                move library already defines the physical action. AI renders
                that established action.
              </Callout>
            </Section>

            {/* 13 */}
            <Section
              id="intensity"
              number="13"
              icon={Activity}
              title="Trial Intensity"
              subtitle="The score difference determines how competitive the reconstructed encounter should appear."
            >
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <IntensityCard
                  range="0-5%"
                  label="Close"
                  text="Both specimens land meaningful attacks."
                />
                <IntensityCard
                  range="5-15%"
                  label="Clear"
                  text="The winner has a noticeable advantage."
                />
                <IntensityCard
                  range="15-25%"
                  label="Dominant"
                  text="The winner controls most of the encounter."
                />
                <IntensityCard
                  range="25%+"
                  label="Overwhelming"
                  text="The winner delivers a decisive performance."
                />
              </div>

              <Formula>
                Trial Gap % = (Winner Score - Loser Score) ÷ Loser Score × 100
              </Formula>

              <Callout>
                A narrow score difference should produce a replay where both
                specimens appear competitive before the finishing attack.
              </Callout>
            </Section>

            {/* 14 */}
            <Section
              id="sequence"
              number="14"
              icon={Binary}
              title="Canonical Trial Sequence"
              subtitle="The event record becomes the official source of truth for what happened."
            >
              <p>
                Once the winner is locked, additional deterministic rolls
                select initiative, attacks, successful hits, misses, critical
                attacks, and the final move.
              </p>

              <CodeBlock code={trialResultExample} />

              <Callout>
                Cinematic reconstruction must follow this record rather than
                changing the outcome.
              </Callout>
            </Section>

            {/* 15 */}
            <Section
              id="xp-award"
              number="15"
              icon={Award}
              title="Award Research XP"
              subtitle="Progression is credited only after the canonical trial result has been successfully recorded."
            >
              <Formula>
                Trial Saved → Verify Result → Award XP → Update Specimen State
              </Formula>

              <CodeBlock code={xpAwardExample} />

              <p className="mt-4">
                XP should be issued by trusted game logic rather than directly
                by the player's browser.
              </p>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <Principle
                  icon={Trophy}
                  title="Trial XP"
                  text="Both winners and losers can receive progression for completed trials."
                />

                <Principle
                  icon={Coins}
                  title="Allocate XP"
                  text="Available XP can be used on levels, mutation procedures, and evolution."
                />

                <Principle
                  icon={Database}
                  title="Save State"
                  text="The updated specimen state becomes the starting point for its next trial."
                />
              </div>

              <Callout>
                The XP values shown here remain example values until the final
                progression economy is balanced.
              </Callout>
            </Section>

            {/* 16 */}
            <Section
              id="replay"
              number="16"
              icon={Play}
              title="Trial Reconstruction"
              subtitle="AI handles presentation after the deterministic system has already completed the encounter."
            >
              <p>
                Replay reconstruction combines the canonical trial sequence,
                current specimen artwork, arena imagery, and permanent move
                context.
              </p>

              <CodeBlock code={screenplayExample} />

              <div className="mt-4 rounded-lg border border-[#8e702c]/25 bg-[#8e702c]/[0.05] p-4">
                <div className="flex items-start gap-3">
                  <WandSparkles
                    size={20}
                    className="mt-0.5 shrink-0 text-[#d2a143]"
                  />

                  <div>
                    <h3 className="font-black uppercase tracking-wide text-[#e4dfd4]">
                      Reconstruction cannot change the result
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-[#85898b]">
                      AI receives the locked event sequence and converts it into
                      cinematic direction, animation prompts, camera shots, and
                      the final visual replay.
                    </p>
                  </div>
                </div>
              </div>
            </Section>

            {/* 17 */}
            <Section
              id="architecture"
              number="17"
              icon={Database}
              title="Data Architecture"
              subtitle="Permanent identity, live progression, and visual history are intentionally separated."
            >
              <div className="grid gap-3 md:grid-cols-2">
                <ArchitectureCard
                  title="Base Template"
                  lines={[
                    "Base ID",
                    "Species",
                    "Element",
                    "Rarity",
                    "Base combat stats",
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
                    "Genetics",
                    "Starting stats",
                    "Starting move power",
                    "Collectible finish",
                  ]}
                />

                <ArchitectureCard
                  title="Live Game State"
                  lines={[
                    "XP",
                    "Level",
                    "Mutations",
                    "Evolution stage",
                    "Current stats",
                    "Trial record",
                    "Current image CID",
                  ]}
                />

                <ArchitectureCard
                  title="Permanent Storage"
                  lines={[
                    "Genesis artwork",
                    "Evolution artwork",
                    "Historical visual forms",
                    "Optional metadata snapshots",
                    "Future onchain checkpoints",
                  ]}
                />
              </div>

              <Callout>
                The 33,300 standard edition JSON files describe the starting
                collectible state. Live progression can be maintained separately
                by the game backend.
              </Callout>
            </Section>

            {/* 18 */}
            <Section
              id="pipeline"
              number="18"
              icon={Trophy}
              title="Complete Specimen Pipeline"
              subtitle="Identity, progression, combat logic, and cinematic reconstruction remain separate systems."
            >
              <div className="grid gap-2">
                {[
                  "Load the original Project 333 genetic template",
                  "Load the individual specimen edition and genetics",
                  "Load current XP, level, mutations, and evolution state",
                  "Resolve current combat stats and move powers",
                  "Create immutable trial snapshots for Specimen A and Specimen B",
                  "Calculate each specimen's current trial score",
                  "Apply elemental matchup modifiers",
                  "Apply active passives or trial-specific effects",
                  "Apply seeded performance randomness",
                  "Lock final scores and determine the winner",
                  "Classify the encounter as close, clear, dominant, or overwhelming",
                  "Use the same trial seed to select moves and trial events",
                  "Attach permanent move-library animation context",
                  "Save the canonical Trial JSON",
                  "Verify the completed trial and award XP",
                  "Update each specimen's live progression state",
                  "Create replay screenplay from locked events",
                  "Combine specimen artwork, arena reference, and move context",
                  "Generate the cinematic reconstruction",
                  "Publish the completed trial replay",
                ].map((step, index, steps) => (
                  <div
                    key={step}
                    className="flex items-center gap-3 rounded-lg border border-[#292823] bg-[#080a0b] px-4 py-3"
                  >
                    <div className="grid size-7 shrink-0 place-items-center rounded-md border border-[#a97826]/30 bg-[#a97826]/[0.06] text-xs font-black text-[#d2a143]">
                      {index + 1}
                    </div>

                    <span className="text-sm font-semibold text-[#aaa69d]">
                      {step}
                    </span>

                    {index < steps.length - 1 && (
                      <ChevronRight
                        size={15}
                        className="ml-auto hidden text-[#4f504c] sm:block"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <Principle
                  icon={Dna}
                  title="Individual"
                  text="Two specimens from the same template can evolve into completely different organisms."
                />

                <Principle
                  icon={ShieldCheck}
                  title="Auditable"
                  text="The same snapshots and seed reproduce the same official trial result."
                />

                <Principle
                  icon={Zap}
                  title="Immediate"
                  text="The real game result resolves before cinematic generation begins."
                />

                <Principle
                  icon={WandSparkles}
                  title="Cinematic"
                  text="Each deterministic encounter can still become a unique visual reconstruction."
                />
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
    <section
      id={id}
      className="bd-panel scroll-mt-28 rounded-xl p-5 sm:p-6"
    >
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

          <p className="mt-1 text-sm leading-6 text-[#74797b]">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="mt-5 text-sm leading-7 text-[#929596]">
        {children}
      </div>
    </section>
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

function Pill({
  icon: Icon,
  children,
}: {
  icon: IconType;
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-[#34322c] bg-[#0a0c0d] px-3 py-1.5 text-xs font-bold text-[#aaa69d]">
      <Icon size={13} className="text-[#b98a38]" />
      {children}
    </span>
  );
}

function DocLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className="block rounded-md px-3 py-2 text-xs font-semibold text-[#676c6e] transition hover:bg-[#a97826]/[0.05] hover:text-[#d2a143]"
    >
      {children}
    </a>
  );
}

function CollectionStat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-lg border border-[#292823] bg-[#080a0b] p-4">
      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#666056]">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-[#d5a343]">
        {value}
      </p>

      <p className="mt-1 text-xs text-[#656a6b]">
        {detail}
      </p>
    </div>
  );
}

function StatTile({
  label,
  value,
  result,
}: {
  label: string;
  value: string;
  result: string;
}) {
  return (
    <div className="rounded-lg border border-[#292823] bg-[#080a0b] p-3">
      <p className="text-[9px] font-black uppercase tracking-wider text-[#626058]">
        {label}
      </p>

      <p className="mt-2 font-mono text-xs text-[#74797b]">
        {value}
      </p>

      <p className="mt-1 text-lg font-black text-[#e0dcd3]">
        {result}
      </p>
    </div>
  );
}

function ProgressCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-[#8e702c]/20 bg-[#8e702c]/[0.035] p-4">
      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#696156]">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-[#d2a143]">
        {value}
      </p>

      <p className="mt-1 text-xs text-[#666b6c]">
        {description}
      </p>
    </div>
  );
}

function ModifierCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "good" | "neutral" | "bad";
}) {
  const styles = {
    good:
      "border-[#69744e]/25 bg-[#69744e]/[0.05] text-[#aeb58b]",
    neutral:
      "border-[#34322c] bg-[#0a0c0d] text-[#aaa69d]",
    bad:
      "border-[#7a4d46]/25 bg-[#7a4d46]/[0.05] text-[#bd8b82]",
  };

  return (
    <div className={`rounded-lg border p-4 ${styles[tone]}`}>
      <p className="text-xs font-bold uppercase tracking-wide">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black">
        {value}
      </p>
    </div>
  );
}

function MutationExample({
  name,
  lines,
}: {
  name: string;
  lines: string[];
}) {
  return (
    <div className="rounded-lg border border-[#514838] bg-[#151310] p-4">
      <p className="font-black uppercase tracking-wide text-[#d0bc92]">
        {name}
      </p>

      <div className="mt-2 space-y-1 font-mono text-xs text-[#858178]">
        {lines.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>
    </div>
  );
}

function EvolutionCard({
  stage,
  detail,
}: {
  stage: string;
  detail: string;
}) {
  return (
    <div className="rounded-lg border border-[#8e702c]/20 bg-[#0a0c0d] p-4 text-center">
      <p className="text-lg font-black uppercase tracking-[0.08em] text-[#d2a143]">
        {stage}
      </p>

      <p className="mt-1 text-xs text-[#696d6e]">
        {detail}
      </p>
    </div>
  );
}

function MoveCard({
  name,
  power,
  chance,
}: {
  name: string;
  power: number;
  chance: string;
}) {
  return (
    <div className="rounded-lg border border-[#34322c] bg-[#0a0c0d] p-4">
      <p className="font-black text-[#e1ddd4]">
        {name}
      </p>

      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className="text-[9px] uppercase tracking-wider text-[#63615a]">
            Power
          </p>

          <p className="text-xl font-black text-[#d2a143]">
            {power}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[9px] uppercase tracking-wider text-[#63615a]">
            Weight
          </p>

          <p className="text-xl font-black text-[#dedad1]">
            {chance}
          </p>
        </div>
      </div>
    </div>
  );
}

function IntensityCard({
  range,
  label,
  text,
}: {
  range: string;
  label: string;
  text: string;
}) {
  return (
    <div className="rounded-lg border border-[#34322c] bg-[#080a0b] p-4">
      <p className="text-lg font-black text-[#d2a143]">
        {range}
      </p>

      <p className="mt-1 font-black uppercase tracking-wide text-[#dedad1]">
        {label}
      </p>

      <p className="mt-2 text-xs leading-5 text-[#6f7475]">
        {text}
      </p>
    </div>
  );
}

function ArchitectureCard({
  title,
  lines,
}: {
  title: string;
  lines: string[];
}) {
  return (
    <div className="rounded-lg border border-[#34322c] bg-[#080a0b] p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#d2a143]">
        {title}
      </p>

      <div className="mt-3 space-y-1.5">
        {lines.map((line) => (
          <div
            key={line}
            className="flex items-center gap-2 text-xs text-[#85898b]"
          >
            <span className="size-1 rounded-full bg-[#7f642f]" />
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

function Principle({
  icon: Icon,
  title,
  text,
}: {
  icon: IconType;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-lg border border-[#34322c] bg-[#080a0b] p-4">
      <Icon size={19} className="text-[#d2a143]" />

      <p className="mt-3 font-black uppercase tracking-wide text-[#dedad1]">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-[#6f7475]">
        {text}
      </p>
    </div>
  );
}