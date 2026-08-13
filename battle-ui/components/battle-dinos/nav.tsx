"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  FlaskConical,
  ShoppingBag,
  Swords,
  WalletCards,
} from "lucide-react";

const nav = [
  {
    href: "/battle",
    label: "Battle",
    icon: Swords,
  },
  {
    href: "/shop",
    label: "Market",
    icon: ShoppingBag,
  },
  {
    href: "/profile",
    label: "Lab",
    icon: FlaskConical,
  },
  {
    href: "/docs",
    label: "Docs",
    icon: BookOpen,
  },
];

function SpecimenLogo({
  size = 40,
}: {
  size?: number;
}) {
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-lg"
      style={{
        width: size,
        height: size,
      }}
    >
      <Image
        src="/specimenlogo.png"
        alt="SPECIMEN"
        fill
        priority
        sizes={`${size}px`}
        className="object-contain"
      />
    </div>
  );
}

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 hidden border-b border-[#26241f] bg-[#050708]/95 backdrop-blur-xl md:block">
      <div className="mx-auto flex h-[76px] max-w-[1500px] items-center gap-8 px-6 xl:px-10">
        {/* BRAND / HOME */}
        <Link
          href="/"
          aria-label="SPECIMEN home"
          className="mr-auto flex items-center gap-3 transition hover:opacity-90"
        >
          <SpecimenLogo size={48} />

          <div>
            <div className="text-[22px] font-black uppercase tracking-[0.13em] text-[#e5e1d8]">
              Specimen
            </div>

            <div className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.3em] text-[#94703a]">
              Genesis Series
            </div>
          </div>
        </Link>

        {/* NAVIGATION */}
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
                    ? "text-[#d7a84c]"
                    : "text-[#737a80] hover:text-[#dedbd3]"
                }`}
              >
                <Icon size={16} strokeWidth={1.8} />

                {item.label}

                {active && (
                  <span className="absolute inset-x-4 bottom-0 h-px bg-[#c89232] shadow-[0_0_9px_rgba(200,146,50,0.7)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* WALLET */}
        <button className="flex items-center gap-2 rounded-lg border border-[#a97826]/60 bg-[#a97826]/[0.07] px-4 py-2.5 text-sm font-bold text-[#e8dfcb] transition hover:border-[#d0a148]/70 hover:bg-[#a97826]/[0.12]">
         
          Coming Soon
        </button>
      </div>
    </header>
  );
}

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#26241f] bg-[#050708]/96 px-4 py-3 backdrop-blur-xl md:hidden">
      <div className="mx-auto flex max-w-xl items-center justify-between">
        {/* BRAND / HOME */}
        <Link
          href="/"
          aria-label="SPECIMEN home"
          className="flex items-center gap-2.5"
        >
          <SpecimenLogo size={38} />

          <div>
            <div className="text-sm font-black uppercase tracking-[0.14em] text-[#e5e1d8]">
              Specimen
            </div>

            <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#94703a]">
              Genesis Series
            </div>
          </div>
        </Link>

        {/* WALLET */}
        <button
          aria-label="Connect wallet"
          className="grid size-10 place-items-center rounded-lg border border-[#a97826]/50 bg-[#a97826]/[0.07] text-[#d7a84c]"
        >
          <WalletCards size={18} />
        </button>
      </div>
    </header>
  );
}

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#26241f] bg-[#050708]/97 px-3 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-xl grid-cols-4">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-bold uppercase tracking-wider transition ${
                active
                  ? "text-[#d7a84c]"
                  : "text-[#626970] hover:text-[#9b9fa1]"
              }`}
            >
              <Icon size={19} strokeWidth={1.8} />
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