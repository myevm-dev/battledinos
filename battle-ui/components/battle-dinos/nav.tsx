"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ShoppingBag,
  Swords,
  UserRound,
  WalletCards,
} from "lucide-react";

const nav = [
  { href: "/battle", label: "Battle", icon: Swords },
  { href: "/shop", label: "Shop", icon: ShoppingBag },
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/docs", label: "Docs", icon: BookOpen },
];

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 hidden border-b border-white/10 bg-[#050b12]/95 backdrop-blur-xl md:block">
      <div className="mx-auto flex h-[74px] max-w-[1500px] items-center gap-8 px-6 xl:px-10">
        <Link href="/battle" className="mr-auto flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-full border border-amber-400/40 bg-amber-400/10 text-2xl shadow-[0_0_28px_rgba(242,165,38,0.15)]">
            🦖
          </div>

          <div>
            <div className="bd-title text-[22px] font-black text-amber-400">
              Battle Dinos
            </div>

            <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
              Genesis Arena
            </div>
          </div>
        </Link>

        <nav className="flex h-full items-center gap-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex h-full items-center gap-2 px-5 text-sm font-bold transition ${
                  active
                    ? "text-amber-300"
                    : "text-slate-400 hover:text-slate-100"
                }`}
              >
                <Icon size={17} />
                {item.label}

                {active && (
                  <span className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(242,165,38,0.7)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <button className="flex items-center gap-2 rounded-xl border border-amber-400/50 bg-amber-500/10 px-4 py-2.5 text-sm font-bold text-amber-100 shadow-[0_0_24px_rgba(242,165,38,0.12)] transition hover:bg-amber-500/20">
          <WalletCards size={18} />
          Connect Wallet
        </button>
      </div>
    </header>
  );
}

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050b12]/95 px-4 py-3 backdrop-blur-xl md:hidden">
      <div className="mx-auto flex max-w-xl items-center justify-between">
        <Link href="/battle" className="flex items-center gap-2">
          <span className="text-2xl">🦖</span>

          <span className="bd-title text-lg font-black text-amber-400">
            Battle Dinos
          </span>
        </Link>

        <button
          aria-label="Connect wallet"
          className="grid size-10 place-items-center rounded-xl border border-amber-400/40 bg-amber-500/10 text-amber-300"
        >
          <WalletCards size={19} />
        </button>
      </div>
    </header>
  );
}

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#050b12]/96 px-3 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-xl grid-cols-4">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-bold ${
                active ? "text-amber-300" : "text-slate-500"
              }`}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function AppNavigation() {
  return (
    <>
      <DesktopNav />
      <MobileHeader />
      <MobileBottomNav />
    </>
  );
}