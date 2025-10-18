"use client";
import React from "react";
import { cn, SECTION_CARD } from "./ui";

export const TABS = [
  "Overview",
  "Members",
  "Projects",
  "Events",
  "Alumni",
] as const;
export type Tab = (typeof TABS)[number];

export default function SidebarTabs({
  value,
  onChange,
}: {
  value: Tab;
  onChange: (t: Tab) => void;
}) {
  return (
    <aside
      className={cn(SECTION_CARD, "w-full md:w-auto lg:w-[250px] xl:w-[300px]")}
    >
      <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible">
        {TABS.map((t) => {
          const active = value === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => onChange(t)}
              className={cn(
                "flex-shrink-0 md:w-full text-left px-3 py-2 rounded-xl border transition text-sm sm:text-base md:text-xl font-redHat text-dsmlcTangerine whitespace-nowrap",
                active
                  ? "bg-black/5 dark:bg-white/10 border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment"
                  : "bg-transparent hover:bg-black/5 dark:hover:bg-white/10 border-transparent"
              )}
              aria-current={active ? "page" : undefined}
            >
              {t}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
