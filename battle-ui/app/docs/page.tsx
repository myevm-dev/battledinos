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
  Gauge,
  Play,
  ShieldCheck,
  Sparkles,
  Swords,
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

const fighterStateExample = `{
  "token_id": 8472,
  "base_id": 1,

  "name": "Echoguard",
  "edition": 37,
  "edition_supply": 78,
  "finish": "standard",

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

  "level": 8,

  "xp": {
    "lifetime": 1840,
    "spent": 900,
    "available": 940
  },

  "evolution_stage": 1,

  "mutations": [
    {
      "id": "rhino_splice",
      "name": "Rhino Splice",
      "family": "Cross-Species",
      "acquired_at_level": 7,
      "evolution_stage": 1
    }
  ]
}`;

const mutationExample = `Base Attack:       81
Edition Genetics:  × 0.98
Starting Attack:   79

Level progression:
+ stat growth

Mutation:
Rhino Splice
+ defense / health bias

Result:
CURRENT battle stats are saved

The battle engine uses the CURRENT values.
It does not apply genetics or mutation bonuses again.`;

const battleResultExample = `{
  "battle_id": 1927,
  "seed": "982731498123",

  "fighter_a": {
    "token_id": 8472,
    "name": "Echoguard",
    "edition": "37/78"
  },

  "fighter_b": {
    "token_id": 19104,
    "name": "Stonebreaker",
    "edition": "14/42"
  },

  "winner_token_id": 8472,
  "winner": "Echoguard",

  "battle_intensity": "close",

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
  "battle_id": 1927,

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
    <div className="min-h-screen bg-[#040a10] pb-24 text-slate-100 md:pb-0">
      <AppNavigation />

      <main>
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(242,165,38,0.15),transparent_38%),radial-gradient(circle_at_15%_30%,rgba(19,211,197,0.08),transparent_28%)]" />

          <div className="relative mx-auto max-w-[1450px] px-4 py-12 sm:px-6 md:py-16 xl:px-10">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-amber-300">
                <BookOpen size={13} />
                Battle Engine Docs
              </div>

              <h1 className="bd-title mt-4 text-4xl font-black text-white sm:text-5xl md:text-6xl">
                How Battle Dinos Work
              </h1>

              <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
                Every collectible begins from one of 333 base dinosaur
                archetypes. Individual editions receive unique genetics and
                then develop independently through battles, XP, leveling,
                mutations, and evolution.
              </p>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
                When a battle begins, the game resolves the real outcome first
                using deterministic game logic and seeded randomness. AI never
                chooses the winner. AI receives the completed battle result and
                turns it into a cinematic replay.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <Pill icon={Dna}>Unique genetics</Pill>
                <Pill icon={Coins}>XP progression</Pill>
                <Pill icon={ShieldCheck}>Deterministic result</Pill>
                <Pill icon={Dices}>Seeded randomness</Pill>
                <Pill icon={WandSparkles}>AI replay only</Pill>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-[1450px] gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[250px_minmax(0,1fr)] xl:px-10">
          <aside className="hidden lg:block">
            <div className="bd-panel sticky top-[94px] rounded-2xl p-3">
              <p className="px-3 pb-2 pt-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                On this page
              </p>

              <DocLink href="#archetype">1. Base archetype</DocLink>
              <DocLink href="#edition">2. Individual edition</DocLink>
              <DocLink href="#progression">3. XP and progression</DocLink>
              <DocLink href="#current-stats">4. Current stats</DocLink>
              <DocLink href="#battle-score">5. Battle score</DocLink>
              <DocLink href="#elements">6. Elements</DocLink>
              <DocLink href="#randomness">7. Randomness</DocLink>
              <DocLink href="#moves">8. Move selection</DocLink>
              <DocLink href="#intensity">9. Battle intensity</DocLink>
              <DocLink href="#sequence">10. Battle sequence</DocLink>
              <DocLink href="#xp-award">11. Award XP</DocLink>
              <DocLink href="#replay">12. AI replay</DocLink>
              <DocLink href="#pipeline">13. Full pipeline</DocLink>
            </div>
          </aside>

          <div className="min-w-0 space-y-5">
            <Section
              id="archetype"
              number="01"
              icon={Braces}
              title="Start with a base archetype"
              subtitle="The original 333 dinos define the shared identity of each named dinosaur."
            >
              <p>
                The Genesis 333 metadata is the canonical definition for each
                dinosaur archetype. Echoguard is one archetype. Every Echoguard
                edition inherits its species, element, visual identity, three
                move names, and base stat profile from this shared definition.
              </p>

              <CodeBlock code={baseMetadataExample} />

              <Callout>
                The base archetype does not personally earn XP, level up, or
                mutate. Individual NFT editions do.
              </Callout>
            </Section>

            <Section
              id="edition"
              number="02"
              icon={Dna}
              title="Create an individual collectible edition"
              subtitle="Copies share the same dinosaur identity but receive different genetics."
            >
              <p>
                A named dinosaur can have a variable edition supply. For
                example, Echoguard might have 78 standard editions. All 78 use
                the same base artwork, element, species, and move names, but
                their genetics slightly modify stats and move power.
              </p>

              <Formula>
                Starting Stat = Base Archetype Stat × Edition Genetics
              </Formula>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <StatTile
                  label="Health"
                  value="80 × 1.02"
                  result="82"
                />
                <StatTile
                  label="Attack"
                  value="81 × 0.98"
                  result="79"
                />
                <StatTile
                  label="Defense"
                  value="70 × 1.04"
                  result="73"
                />
                <StatTile
                  label="Speed"
                  value="72 × 1.01"
                  result="73"
                />
              </div>

              <CodeBlock code={fighterStateExample} />

              <Callout>
                Echoguard 37/78 and Echoguard 53/78 can begin with the same
                appearance and moves but have slightly different battle
                potential.
              </Callout>
            </Section>

            <Section
              id="progression"
              number="03"
              icon={Coins}
              title="Battle, earn XP, and spend it"
              subtitle="XP belongs to the individual collectible fighter."
            >
              <p>
                Completed battles award XP. XP functions as a progression
                resource rather than a transferable token. Players can save
                their XP or spend it on progression systems such as leveling,
                mutation rolls, directed mutations, and evolution.
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
                  description="Used on progression"
                />
                <ProgressCard
                  label="Available XP"
                  value="940"
                  description="Ready to spend"
                />
              </div>

              <CodeBlock code={progressionExample} />

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <Principle
                  icon={Gauge}
                  title="Level Up"
                  text="Spend XP to improve the fighter's current battle stats."
                />
                <Principle
                  icon={Sparkles}
                  title="Mutate"
                  text="Spend XP, and sometimes an item, to add biological mutations."
                />
                <Principle
                  icon={Dna}
                  title="Evolve"
                  text="Major progression milestones can create a new mature form and new artwork."
                />
              </div>

              <Callout>
                XP itself does not directly increase the battle score. XP must
                first be spent on progression that changes the fighter's
                current state.
              </Callout>
            </Section>

            <Section
              id="current-stats"
              number="04"
              icon={Database}
              title="Resolve the current fighter state"
              subtitle="Genetics, leveling, evolution, and mutations build the fighter's current stats."
            >
              <p>
                Before a battle, the game loads the fighter's current state.
                The current values already reflect everything that has happened
                to that NFT throughout its progression history.
              </p>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <MutationExample
                  name="Rhino Splice"
                  lines={[
                    "Higher health potential",
                    "Higher defense potential",
                    "May alter move behavior",
                    "Changes evolved appearance",
                  ]}
                />

                <MutationExample
                  name="Iron Hide"
                  lines={[
                    "Higher defense potential",
                    "More armored visual form",
                    "Can unlock defensive passives",
                    "Persists through future evolution",
                  ]}
                />
              </div>

              <CodeBlock code={mutationExample} />

              <Formula>
                Base Archetype + Genetics + Leveling + Mutations + Evolution =
                Current Fighter State
              </Formula>

              <Callout>
                This prevents double counting. If Rhino Splice already increased
                the saved current defense value, the battle engine does not
                multiply defense by Rhino Splice again.
              </Callout>
            </Section>

            <Section
              id="battle-score"
              number="05"
              icon={Gauge}
              title="Calculate the current battle score"
              subtitle="The battle engine scores the fighter using the values it has right now."
            >
              <p>
                The base archetype is no longer used directly at this point.
                The battle engine receives a snapshot of the NFT's current
                stats and current move powers.
              </p>

              <Formula>
                Battle Score = Health × 25% + Attack × 30% + Defense × 20% +
                Speed × 15% + Average Current Move Power × 10%
              </Formula>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                <StatTile label="Health" value="82 × .25" result="20.50" />
                <StatTile label="Attack" value="79 × .30" result="23.70" />
                <StatTile label="Defense" value="73 × .20" result="14.60" />
                <StatTile label="Speed" value="73 × .15" result="10.95" />
                <StatTile
                  label="Moves"
                  value="63.33 × .10"
                  result="6.33"
                />
              </div>

              <Callout>
                Echoguard 37/78 current battle score:{" "}
                <strong>76.08</strong>
              </Callout>
            </Section>

            <Section
              id="elements"
              number="06"
              icon={Atom}
              title="Apply the elemental matchup"
              subtitle="Elements create strategic advantages without guaranteeing victory."
            >
              <p>
                Each base archetype has an element. The configured element
                chart can give a modest modifier when one element has an
                advantage over another.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <ModifierCard
                  label="Strong matchup"
                  value="× 1.07"
                  tone="good"
                />
                <ModifierCard
                  label="Neutral matchup"
                  value="× 1.00"
                  tone="neutral"
                />
                <ModifierCard
                  label="Weak matchup"
                  value="× 0.93"
                  tone="bad"
                />
              </div>

              <Callout>
                The exact element counter chart can be balanced separately.
                A 7% modifier is strong enough to matter without making the
                matchup automatic.
              </Callout>
            </Section>

            <Section
              id="randomness"
              number="07"
              icon={Dices}
              title="Apply seeded battle randomness"
              subtitle="Randomness creates unpredictable fights while preserving reproducibility."
            >
              <Formula>Random roll = 0.00 to 1.00</Formula>

              <Formula>
                Random multiplier = 0.90 + (Random Roll × 0.20)
              </Formula>

              <div className="mt-4 rounded-xl border border-white/[0.07] bg-black/25 p-4 font-mono text-sm leading-7 text-slate-300">
                <div>Current battle score: 76.08</div>
                <div>Random roll: 0.73</div>
                <div>0.90 + (0.73 × 0.20) = 1.046</div>
                <div>76.08 × 1.046 = 79.58</div>
              </div>

              <Callout>
                A fighter can perform roughly 10% above or below its expected
                strength during a particular battle.
              </Callout>

              <p className="mt-4">
                The battle receives one seed. Separate deterministic random
                values are derived from that seed for each part of the match.
              </p>

              <CodeBlock
                code={`Battle seed: 982731498123

derive(seed, "fighter-a-performance")
derive(seed, "fighter-b-performance")
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
                Replaying the same battle using the same fighter snapshots and
                the same seed produces the same official result.
              </Callout>
            </Section>

            <Section
              id="moves"
              number="08"
              icon={Zap}
              title="Select moves with weighted randomness"
              subtitle="Each dinosaur keeps its three inherited move identities while its individual move power can vary."
            >
              <p>
                Echoguard editions always inherit Primal Chomp, Wild Claw, and
                Primal Rush. Genetics and later progression can change the
                current power of those moves.
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

              <Formula>Total move weight = 82 + 44 + 64 = 190</Formula>

              <p className="mt-4">
                Using current power as the initial move weight means stronger
                moves appear more often while all three moves remain possible.
                Move frequency can later become its own stat if deeper battle
                balancing is needed.
              </p>
            </Section>

            <Section
              id="intensity"
              number="09"
              icon={Activity}
              title="Score difference controls battle intensity"
              subtitle="The winner is already decided, but the score gap determines how the replay should unfold."
            >
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <IntensityCard
                  range="0-5%"
                  label="Close Battle"
                  text="Both fighters land meaningful attacks and the result feels uncertain."
                />
                <IntensityCard
                  range="5-15%"
                  label="Clear Win"
                  text="The winner has a noticeable advantage but still faces resistance."
                />
                <IntensityCard
                  range="15-25%"
                  label="Dominant"
                  text="The winner controls most of the battle."
                />
                <IntensityCard
                  range="25%+"
                  label="Overwhelming"
                  text="The winner delivers a decisive one-sided performance."
                />
              </div>

              <Formula>
                Battle Gap % = (Winner Score - Loser Score) ÷ Loser Score × 100
              </Formula>

              <Callout>
                Example: 79.58 vs 76.90 is about a 3.5% difference, so the
                replay should show a close battle.
              </Callout>
            </Section>

            <Section
              id="sequence"
              number="10"
              icon={Binary}
              title="Generate the canonical battle sequence"
              subtitle="This JSON becomes the official record of what happened in the arena."
            >
              <p>
                Once the winner is locked, additional deterministic rolls
                select initiative, attacks, successful hits, misses, critical
                hits, and the final move.
              </p>

              <p className="mt-3">
                The video model does not invent these events. It receives them
                after the game engine has already completed the match.
              </p>

              <CodeBlock code={battleResultExample} />
            </Section>

            <Section
              id="xp-award"
              number="11"
              icon={Award}
              title="Award XP after the battle is finalized"
              subtitle="Progression is awarded only after the canonical battle record is successfully saved."
            >
              <p>
                The battle result should be committed first. Once that succeeds,
                the trusted game backend calculates XP awards and updates each
                fighter's progression state.
              </p>

              <Formula>
                Battle Saved → Verify Result → Award XP → Update Fighter State
              </Formula>

              <CodeBlock code={xpAwardExample} />

              <Callout>
                The XP amounts above are example values. The final reward formula
                can account for wins, losses, upsets, battle mode, tournaments,
                streaks, or special events.
              </Callout>

              <p className="mt-4">
                XP should be awarded by trusted game logic rather than directly
                by the player's browser. This prevents a client from simply
                submitting an arbitrary XP increase.
              </p>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <Principle
                  icon={Trophy}
                  title="Battle XP"
                  text="Both winners and losers can earn progression for participating."
                />

                <Principle
                  icon={Coins}
                  title="Spend XP"
                  text="Available XP can be used on levels, mutations, and evolution."
                />

                <Principle
                  icon={Database}
                  title="Save State"
                  text="The individual NFT's updated progression is stored for its next battle."
                />
              </div>
            </Section>

            <Section
              id="replay"
              number="12"
              icon={Play}
              title="Turn the result into an AI battle replay"
              subtitle="AI handles presentation after game logic has already determined reality."
            >
              <p>
                The canonical battle JSON is converted into a short screenplay.
                The relevant dinosaur artwork, arena image, and scene
                description can then be provided to the video generation
                system.
              </p>

              <CodeBlock code={screenplayExample} />

              <div className="mt-4 rounded-xl border border-amber-400/15 bg-amber-500/[0.06] p-4">
                <div className="flex items-start gap-3">
                  <WandSparkles
                    size={20}
                    className="mt-0.5 shrink-0 text-amber-300"
                  />

                  <div>
                    <h3 className="font-black text-white">
                      AI never changes the winner
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      AI receives the locked sequence and converts it into
                      cinematic direction, animation prompts, narration, camera
                      shots, and the final replay.
                    </p>
                  </div>
                </div>
              </div>
            </Section>

            <Section
              id="pipeline"
              number="13"
              icon={Trophy}
              title="Full Battle Dinos pipeline"
              subtitle="Identity, progression, game logic, and cinematic generation remain separate."
            >
              <div className="grid gap-2">
                {[
                  "Load the base dinosaur archetype",
                  "Load the individual NFT edition and genetics",
                  "Load current level, XP, mutations, and evolution state",
                  "Resolve current battle stats and current move powers",
                  "Create immutable battle snapshots for Dino A and Dino B",
                  "Calculate each fighter's current battle score",
                  "Apply elemental matchup modifiers",
                  "Apply battle-specific passives or effects",
                  "Apply seeded random performance modifiers",
                  "Lock final scores and determine the winner",
                  "Classify the battle as close, clear, dominant, or overwhelming",
                  "Use the same battle seed to select moves and battle events",
                  "Save the canonical Battle JSON",
                  "Verify the completed battle and award XP",
                  "Update each fighter's live progression state",
                  "Generate a screenplay from the locked battle events",
                  "Send fighter artwork, arena references, and scene prompts to the video model",
                  "Publish the cinematic battle replay",
                ].map((step, index, steps) => (
                  <div
                    key={step}
                    className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-black/20 px-4 py-3"
                  >
                    <div className="grid size-7 shrink-0 place-items-center rounded-lg border border-amber-400/20 bg-amber-500/10 text-xs font-black text-amber-300">
                      {index + 1}
                    </div>

                    <span className="text-sm font-semibold text-slate-300">
                      {step}
                    </span>

                    {index < steps.length - 1 && (
                      <ChevronRight
                        size={15}
                        className="ml-auto hidden text-slate-700 sm:block"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <Principle
                  icon={Dna}
                  title="Individual"
                  text="Two copies of the same base dinosaur can develop into completely different fighters."
                />

                <Principle
                  icon={ShieldCheck}
                  title="Auditable"
                  text="The same fighter snapshots and battle seed reproduce the same official result."
                />

                <Principle
                  icon={Zap}
                  title="Fast"
                  text="The actual game result can resolve before expensive video generation begins."
                />

                <Principle
                  icon={WandSparkles}
                  title="Cinematic"
                  text="Every deterministic battle can still become a unique visual replay."
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
      className="bd-panel scroll-mt-28 rounded-2xl p-5 sm:p-6"
    >
      <div className="flex items-start gap-4">
        <div className="grid size-11 shrink-0 place-items-center rounded-xl border border-amber-400/20 bg-amber-500/10 text-amber-300">
          <Icon size={21} />
        </div>

        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
            Step {number}
          </div>

          <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">
            {title}
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">{subtitle}</p>
        </div>
      </div>

      <div className="mt-5 text-sm leading-7 text-slate-400">{children}</div>
    </section>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="bd-scrollbar mt-4 overflow-x-auto rounded-xl border border-white/[0.07] bg-[#02060a] p-4 text-[12px] leading-6 text-cyan-100/80">
      <code>{code}</code>
    </pre>
  );
}

function Formula({ children }: { children: ReactNode }) {
  return (
    <div className="mt-3 rounded-xl border border-cyan-400/15 bg-cyan-500/[0.05] px-4 py-3 font-mono text-xs leading-6 text-cyan-100 sm:text-sm">
      {children}
    </div>
  );
}

function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 rounded-xl border border-amber-400/15 bg-amber-500/[0.05] px-4 py-3 text-sm text-amber-100/80">
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
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-black/25 px-3 py-1.5 text-xs font-bold text-slate-300">
      <Icon size={13} />
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
      className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-white/[0.04] hover:text-amber-300"
    >
      {children}
    </a>
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
    <div className="rounded-xl border border-white/[0.06] bg-black/20 p-3">
      <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p className="mt-2 font-mono text-xs text-slate-500">{value}</p>

      <p className="mt-1 text-lg font-black text-white">{result}</p>
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
    <div className="rounded-xl border border-amber-400/10 bg-amber-500/[0.035] p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-600">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-amber-300">{value}</p>

      <p className="mt-1 text-xs text-slate-500">{description}</p>
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
    good: "border-lime-400/15 bg-lime-500/[0.05] text-lime-300",
    neutral: "border-white/[0.07] bg-white/[0.03] text-slate-300",
    bad: "border-rose-400/15 bg-rose-500/[0.05] text-rose-300",
  };

  return (
    <div className={`rounded-xl border p-4 ${styles[tone]}`}>
      <p className="text-xs font-bold">{label}</p>

      <p className="mt-2 text-2xl font-black">{value}</p>
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
    <div className="rounded-xl border border-purple-400/15 bg-purple-500/[0.05] p-4">
      <p className="font-black text-purple-200">{name}</p>

      <div className="mt-2 space-y-1 font-mono text-xs text-slate-400">
        {lines.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>
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
    <div className="rounded-xl border border-blue-400/15 bg-blue-500/[0.04] p-4">
      <p className="font-black text-white">{name}</p>

      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-600">
            Power
          </p>

          <p className="text-xl font-black text-blue-300">{power}</p>
        </div>

        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-slate-600">
            Weight
          </p>

          <p className="text-xl font-black text-white">{chance}</p>
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
    <div className="rounded-xl border border-white/[0.07] bg-black/20 p-4">
      <p className="text-lg font-black text-amber-300">{range}</p>

      <p className="mt-1 font-black text-white">{label}</p>

      <p className="mt-2 text-xs leading-5 text-slate-500">{text}</p>
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
    <div className="rounded-xl border border-white/[0.07] bg-black/20 p-4">
      <Icon size={19} className="text-amber-300" />

      <p className="mt-3 font-black text-white">{title}</p>

      <p className="mt-1 text-xs leading-5 text-slate-500">{text}</p>
    </div>
  );
}