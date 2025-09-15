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
    <aside className={SECTION_CARD}>
      <nav className="flex flex-col gap-2">
        {TABS.map((t) => {
          const active = value === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => onChange(t)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-xl border transition text-xl font-redHat text-dsmlcTangerine",
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
