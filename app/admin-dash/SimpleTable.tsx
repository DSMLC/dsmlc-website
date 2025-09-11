// components/admin/ui/SimpleTable.tsx
"use client";
import React, { useMemo, useState } from "react";
import { cn } from "./ui";

export type Column<T> = {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
};

export default function SimpleTable<T>({
  data,
  columns,
  rowKey,
  searchPlaceholder = "Search…",
  pageSize = 10,
  columnGroups,
  stickyHeader = true,
  zebra = true,
  verticalDividers = true,

  // NEW
  onRowClick,
  isRowSelected,
  rowTitle,
}: {
  data: T[];
  columns: Column<T>[];
  rowKey: (row: T, idx: number) => string | number;
  searchPlaceholder?: string;
  pageSize?: number;
  columnGroups?: { label: string; span: number }[];
  stickyHeader?: boolean;
  zebra?: boolean;
  verticalDividers?: boolean;

  // NEW
  onRowClick?: (row: T) => void;
  isRowSelected?: (row: T) => boolean;
  rowTitle?: (row: T) => string;
}) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!q.trim()) return data;
    const lc = q.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        const val =
          typeof col.key === "string"
            ? (row as any)[col.key]
            : (row as any)[col.key as any];
        return String(val ?? "")
          .toLowerCase()
          .includes(lc);
      })
    );
  }, [q, data, columns]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const start = (page - 1) * pageSize;
  const pageData = filtered.slice(start, start + pageSize);

  const tableClass = cn("table", zebra && "table-zebra", "w-full");

  const headCellBase = cn(
    "text-xs md:text-sm font-semibold",
    stickyHeader && "sticky bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite",
    verticalDividers &&
      "border-r border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment last:border-r-0"
  );

  const bodyCellBase = cn(
    "text-xs md:text-sm align-middle whitespace-nowrap",
    verticalDividers &&
      "border-r border-light-dsmlcEnhancedParchment/70 dark:border-dark-dsmlcEnhancedParchment/70 last:border-r-0"
  );

  return (
    <div className="w-full">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          className="
            input input-bordered w-full
            pl-2 pr-4 py-2 text-sm mb-8
            rounded-lg border border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment
            bg-white dark:bg-dark-dsmlcWhite
            placeholder-gray-400 dark:placeholder-gray-500
            text-light-dsmlcBlack dark:text-dark-dsmlcBlack
            focus:border-dsmlcTangerine focus:ring-2 focus:ring-dsmlcTangerine/60
            transition duration-200 ease-in-out
          "
          placeholder={searchPlaceholder}
          value={q}
          onChange={(e) => {
            setPage(1);
            setQ(e.target.value);
          }}
        />
      </div>

      <div className="overflow-x-auto">
        <table className={tableClass}>
          <thead>
            {columnGroups && columnGroups.length > 0 && (
              <tr>
                {columnGroups.map((g, i) => (
                  <th
                    key={`grp-${i}`}
                    colSpan={g.span}
                    className={cn(
                      headCellBase,
                      "uppercase tracking-wide text-[11px] md:text-xs",
                      "text-neutral-600 dark:text-neutral-300",
                      "border-b border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment"
                    )}
                  >
                    {g.label}
                  </th>
                ))}
              </tr>
            )}
            <tr>
              {columns.map((c, i) => (
                <th
                  key={i}
                  className={cn(
                    headCellBase,
                    "text-neutral-700 dark:text-neutral-200",
                    "border-b border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment",
                    c.className
                  )}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.map((row, i) => {
              const selected = isRowSelected?.(row) ?? false;
              return (
                <tr
                  key={rowKey(row, i)}
                  className={cn(
                    "hover group",
                    onRowClick && "cursor-pointer",
                    selected &&
                      "bg-dsmlcTangerine/5 ring-1 ring-dsmlcTangerine/40"
                  )}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  title={rowTitle ? rowTitle(row) : undefined}
                >
                  {columns.map((c, j) => (
                    <td key={j} className={cn(bodyCellBase, c.className)}>
                      {c.render
                        ? c.render(row)
                        : String((row as any)[c.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="join grid grid-cols-3 mt-3 text-dsmlcTangerine">
        <button
          className="join-item btn-primary btn-sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          «
        </button>
        <button className="join-item btn btn-sm" disabled>
          Page {page} / {totalPages}
        </button>
        <button
          className="join-item btn-primary btn-sm"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          »
        </button>
      </div>
    </div>
  );
}
