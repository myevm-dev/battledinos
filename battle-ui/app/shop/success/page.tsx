import Link from "next/link";
import {
  CheckCircle2,
  PackageOpen,
} from "lucide-react";

export default function ShopSuccessPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#050708] px-5 text-[#e8e4db]">
      <div className="w-full max-w-lg rounded-xl border border-[#292823] bg-[#07090a] p-8 text-center">
        <CheckCircle2
          size={48}
          className="mx-auto text-[#d2a143]"
        />

        <h1 className="mt-5 text-3xl font-black uppercase tracking-[0.06em]">
          Payment Received
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#8c9193]">
          Your SPECIMEN Genesis Booster Box purchase has been received.
        </p>

        <div className="mt-6 flex items-center justify-center gap-2 text-[#d2a143]">
          <PackageOpen size={18} />

          <span className="font-black uppercase tracking-[0.08em]">
            Genesis Booster Box
          </span>
        </div>

        <Link
          href="/shop"
          className="mt-8 inline-flex rounded-lg border border-[#a97826]/60 px-5 py-3 text-sm font-black uppercase tracking-[0.08em] transition hover:border-[#d2a143]"
        >
          Return to Shop
        </Link>
      </div>
    </main>
  );
}