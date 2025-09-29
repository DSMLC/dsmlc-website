export const fmtDate = (d?: string | null) =>
  !d
    ? "—"
    : new Date(d + "T00:00:00").toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

export const cn = (...c: (string | false | null | undefined)[]) =>
  c.filter(Boolean).join(" ");

export const SECTION_CARD =
  "p-6 bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite " +
  "border dark:border-dark-dsmlcEnhancedParchment border-light-dsmlcEnhancedParchment " +
  "shadow-lg dark:shadow-dark-dsmlcParchment shadow-light-dsmlcParchment rounded-4xl";
