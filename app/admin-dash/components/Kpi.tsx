"use client";
import React from "react";
import { SECTION_CARD } from "./ui";

export default function Kpi({
  label,
  value,
  hint,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className={SECTION_CARD}>
      <div className="text-xs sm:text-sm font-semibold font-redHat text-dsmlcTangerine">
        {label}
      </div>
      <div className="dark:text-dark-dsmlcBlack text-light-dsmlcBlack text-xl sm:text-2xl font-redHat">
        {value}
      </div>
      {hint && (
        <div className="dark:text-dark-dsmlcBlack text-light-dsmlcBlack text-xs opacity-60 mt-1">
          {hint}
        </div>
      )}
    </div>
  );
}
