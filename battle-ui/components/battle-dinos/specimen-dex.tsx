"use client";

import Image from "next/image";
import { useState } from "react";
import { ScanSearch, X } from "lucide-react";

import specimenData from "@/data/battle_dinos_333.json";
import specimenSupply from "@/data/specimen_supply.json";

type BaseSpecimen = {
  base_id: number;
  name: string;
  species?: string;
  rarity: string;
  element: string;
};

type SpecimenDexProps = {
  ownedBaseIds?: number[];
};

const baseSpecimens =
  (Object.values(specimenData).find(
    (value) =>
      Array.isArray(value) &&
      value.length > 0 &&
      typeof value[0] === "object" &&
      value[0] !== null &&
      "base_id" in value[0]
  ) as BaseSpecimen[] | undefined) ?? [];

function getEditionSupply(baseId: number) {
  return (
    specimenSupply[
      String(baseId) as keyof typeof specimenSupply
    ] ?? 0
  );
}

export function SpecimenDex({
  ownedBaseIds = [],
}: SpecimenDexProps) {
  const owned = new Set(ownedBaseIds);

  const [selectedSpecimen, setSelectedSpecimen] =
    useState<BaseSpecimen | null>(null);

  return (
    <>
      <div className="w-full">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#292823] px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-lg border border-[#a97826]/30 bg-[#a97826]/[0.06] text-[#d2a143]">
              <ScanSearch size={17} />
            </div>

            <div>
              <h2 className="text-lg font-black uppercase tracking-[0.04em] text-[#dedad1]">
                Specimen Dex
              </h2>

              <p className="text-xs text-[#777c7d]">
                All {baseSpecimens.length} Project 333 specimens
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-lg font-black text-[#d2a143]">
              {owned.size}
              <span className="ml-1 text-xs text-[#666b6c]">
                / {baseSpecimens.length}
              </span>
            </p>

            <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#666b6c]">
              Collected
            </p>
          </div>
        </div>

        {/* GALLERY */}
        <div className="p-3">
          <div className="grid grid-cols-3 gap-2 lg:grid-cols-9">
            {baseSpecimens.map((specimen) => {
              const collected = owned.has(specimen.base_id);
              const editionSupply = getEditionSupply(
                specimen.base_id
              );

              return (
                <button
                  key={specimen.base_id}
                  type="button"
                  onClick={() =>
                    setSelectedSpecimen(specimen)
                  }
                  className="group min-w-0 overflow-hidden rounded-lg border border-[#292823] bg-[#050708] text-left transition hover:border-[#806b47]"
                >
                  {/* IMAGE */}
                  <div className="relative aspect-square overflow-hidden bg-black">
                    <Image
                      src={`/dinos/${specimen.base_id}.png`}
                      alt={specimen.name}
                      fill
                      sizes="(max-width: 1024px) 33vw, 11vw"
                      className={`object-cover transition duration-300 group-hover:scale-105 ${
                        collected
                          ? ""
                          : "opacity-60 grayscale-[0.65]"
                      }`}
                    />

                    {/* STATUS */}
                    <div className="absolute right-1.5 top-1.5">
                      <span
                        className={`rounded border px-1.5 py-0.5 text-[7px] font-black uppercase tracking-[0.06em] backdrop-blur-sm ${
                          collected
                            ? "border-[#829257]/50 bg-[#172012]/90 text-[#afbf7b]"
                            : "border-[#46453f] bg-[#07090a]/90 text-[#777b7c]"
                        }`}
                      >
                        {collected
                          ? "Collected"
                          : "Missing"}
                      </span>
                    </div>

                    {/* BASE ID */}
                    <div className="absolute bottom-1.5 left-1.5 rounded bg-black/75 px-1.5 py-0.5 font-mono text-[7px] font-bold text-[#aaa69d]">
                      #
                      {String(specimen.base_id).padStart(
                        3,
                        "0"
                      )}
                    </div>
                  </div>

                  {/* CARD INFO */}
                  <div className="px-2 py-2">
                    <p
                      className="truncate text-[10px] font-black uppercase tracking-[0.02em] text-[#dedad1] sm:text-[11px]"
                      title={specimen.name}
                    >
                      {specimen.name}
                    </p>

                    <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.05em] text-[#a97826] sm:text-[9px]">
                      {editionSupply} Exist
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {selectedSpecimen && (
        <SpecimenModal
          specimen={selectedSpecimen}
          collected={owned.has(
            selectedSpecimen.base_id
          )}
          editionSupply={getEditionSupply(
            selectedSpecimen.base_id
          )}
          onClose={() =>
            setSelectedSpecimen(null)
          }
        />
      )}
    </>
  );
}

function SpecimenModal({
  specimen,
  collected,
  editionSupply,
  onClose,
}: {
  specimen: BaseSpecimen;
  collected: boolean;
  editionSupply: number;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-[900px] overflow-hidden rounded-xl border border-[#3a3428] bg-[#080a0b] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* CLOSE */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-30 grid size-9 place-items-center rounded-lg border border-[#3a3428] bg-[#050708]/95 text-[#a5a09a] transition hover:border-[#a97826] hover:text-white"
        >
          <X size={18} />
        </button>

        <div className="grid max-h-[90vh] overflow-y-auto md:grid-cols-[52%_48%]">
          {/* IMAGE */}
          <div className="relative aspect-square bg-black md:aspect-auto md:min-h-[520px]">
            <Image
              src={`/dinos/${specimen.base_id}.png`}
              alt={specimen.name}
              fill
              sizes="(max-width: 768px) 100vw, 470px"
              priority
              className={`object-cover ${
                collected
                  ? ""
                  : "opacity-70 grayscale-[0.55]"
              }`}
            />
          </div>

          {/* DETAILS */}
          <div className="min-w-0 p-5 sm:p-6 md:flex md:flex-col md:justify-center">
            {/* TOP */}
            <div className="flex items-center justify-between gap-3 pr-10">
              <span className="font-mono text-xs font-bold text-[#806b47]">
                #{String(specimen.base_id).padStart(3, "0")}
              </span>

              <span
                className={`shrink-0 rounded-md border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] ${
                  collected
                    ? "border-[#829257]/50 bg-[#172012] text-[#afbf7b]"
                    : "border-[#46453f] bg-[#050708] text-[#777b7c]"
                }`}
              >
                {collected ? "Collected" : "Missing"}
              </span>
            </div>

            {/* NAME */}
            <h2 className="mt-4 break-words text-3xl font-black uppercase leading-tight tracking-[0.03em] text-[#e7e2d8]">
              {specimen.name}
            </h2>

            {/* SUPPLY */}
            <div className="mt-3">
              <span className="inline-flex rounded-md border border-[#a97826]/35 bg-[#a97826]/[0.07] px-3 py-1.5 text-xs font-black uppercase tracking-[0.08em] text-[#d2a143]">
                {editionSupply} Exist
              </span>
            </div>

            {/* DETAILS */}
            <div className="mt-6">
              {specimen.species && (
                <DetailRow
                  label="Species"
                  value={specimen.species}
                />
              )}

              <DetailRow
                label="Rarity"
                value={specimen.rarity}
              />

              <DetailRow
                label="Element"
                value={specimen.element}
              />

              <DetailRow
                label="Edition Supply"
                value={String(editionSupply)}
              />
            </div>

            {!collected && (
              <p className="mt-5 text-sm leading-6 text-[#777c7d]">
                This specimen has not yet been collected by the connected
                wallet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#292823] py-3">
      <span className="shrink-0 text-xs font-bold uppercase tracking-[0.08em] text-[#696e6f]">
        {label}
      </span>

      <span className="min-w-0 break-words text-right text-sm font-black text-[#d8d4ca]">
        {value}
      </span>
    </div>
  );
}