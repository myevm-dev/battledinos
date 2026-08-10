# Battle Dinos Next.js UI

Responsive Next.js + TypeScript + Tailwind CSS UI based on the Battle Dinos lobby concept.

## Included

- Desktop navbar
- Mobile header
- Mobile bottom navigation
- Battle, Shop, and Profile routes
- 1v1 Duel mode
- Arena Run mode
- Selected dino card
- Recent battle history
- Arena rotation cards
- Local generated arena artwork
- Local Vortexwarden artwork
- Wallet button UI placeholder

The wallet button is visual only. Connect your preferred wallet library later.

## Battle mode reasoning

### 1v1 Duel

A player queues one NFT. The opponent does not need to be online at the same moment. Your backend can pair the entrant with another dino already locked in the queue.

### Arena Run

A player enters a three-fight gauntlet. Opponents are selected from dinos already committed to the arena pool. This creates an always-available mode even during low player activity.

A scheduled Battle Royale can be added later once concurrent activity is high enough.

## Run as a standalone project

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:3000/battle
```

## Drop into an existing Next.js app

Copy:

```text
app/battle/
app/shop/
app/profile/
components/battle-dinos/
lib/battle-dinos-data.ts
public/arenas/
public/dinos/
```

Merge the relevant styles from:

```text
app/globals.css
```

Install:

```bash
npm install lucide-react
```

If your existing project already uses Tailwind, you do not need to replace its Tailwind setup.

## Tailwind v4

This standalone package uses:

```css
@import "tailwindcss";
```

with `@tailwindcss/postcss`.
