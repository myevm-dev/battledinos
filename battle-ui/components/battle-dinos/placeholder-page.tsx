import { AppNavigation } from "./nav";

export function PlaceholderPage({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="min-h-screen bg-[#040a10] pb-24 md:pb-0">
      <AppNavigation />

      <main className="mx-auto max-w-[1500px] px-4 py-12 sm:px-6 md:py-20 xl:px-10">
        <section className="bd-panel mx-auto max-w-3xl rounded-3xl p-7 text-center sm:p-12">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-300">
            {eyebrow}
          </p>
          <h1 className="bd-title mt-3 text-4xl font-black text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
            {description}
          </p>
        </section>
      </main>
    </div>
  );
}
