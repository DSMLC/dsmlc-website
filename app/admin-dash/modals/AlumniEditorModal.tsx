"use client";
import React, { useEffect, useState } from "react";
import { Alumni } from "../utility/types";
import { insertRow, updateRow } from "../utility/adminCrud";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initial: Partial<Alumni>;
  onClose: () => void;
  onSaved: (row: Alumni, mode: "create" | "edit") => void;
};

export default function AlumniEditorModal({
  open,
  mode,
  initial,
  onClose,
  onSaved,
}: Props) {
  const [form, setForm] = useState<Partial<Alumni>>(initial);
  const [saving, setSaving] = useState(false);

  // entrance animation (consistent with other modals)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(open), [open]);

  useEffect(() => setForm(initial), [initial]);

  const set = <K extends keyof Alumni>(k: K, v: Alumni[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    try {
      setSaving(true);
      let saved: Alumni;

      if (mode === "edit") {
        if (form.member_id == null)
          throw new Error("Missing member_id for edit");
        saved = await updateRow<Alumni>("Alumni", "member_id", form.member_id, {
          graduation_year: form.graduation_year ?? null,
          linkedin: form.linkedin ?? null,
          company: form.company ?? null,
          position: form.position ?? null,
        });
      } else {
        if (form.member_id == null)
          throw new Error("member_id is required to create Alumni");
        saved = await insertRow<Alumni>("Alumni", {
          member_id: form.member_id,
          graduation_year: form.graduation_year ?? null,
          linkedin: form.linkedin ?? null,
          company: form.company ?? null,
          position: form.position ?? null,
        });
      }

      onSaved(saved, mode);
      onClose();
    } catch (e: any) {
      alert(`Save failed: ${e?.message ?? e}`);
    } finally {
      setSaving(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="alumni-modal-title"
      onKeyDown={onKeyDown}
    >
      {/* Backdrop */}
      <button
        aria-label="Close"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`relative w-full max-w-2xl sm:max-w-3xl mx-auto
        bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite
        border border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment
        transition-all duration-200 ease-out
        dark:text-dark-dsmlcBlack text-light-dsmlcBlack
        ${mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-[0.98]"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-4 border border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment backdrop-blur">
          <h3
            id="alumni-modal-title"
            className="text-lg sm:text-xl font-semibold text-dsmlcTangerine"
          >
            {mode === "edit" ? "Edit Alumni" : "Add Alumni"}
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center
            rounded-full border border-dsmlcTangerine
            bg-transparent px-5 py-2 text-sm font-medium
            text-dsmlcTangerine
            hover:bg-dsmlcTangerine hover:text-white
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dsmlcTangerine/60
            shadow-sm hover:shadow-md
            transition-all duration-200"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[70vh] sm:max-h-[72vh] overflow-y-auto border border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="form-control">
              <span className="label-text font-medium">Member ID</span>
              <input
                type="number"
                inputMode="numeric"
                className="input input-bordered text-black w-full focus-visible:ring-2 focus-visible:ring-primary/50"
                value={form.member_id ?? ""}
                onChange={(e) =>
                  set(
                    "member_id",
                    e.target.value ? Number(e.target.value) : (null as any)
                  )
                }
                disabled={mode === "edit"}
                placeholder="e.g., 123"
              />
            </label>

            <label className="form-control">
              <span className="label-text font-medium">Graduation year</span>
              <input
                type="number"
                inputMode="numeric"
                className="input input-bordered text-black w-full focus-visible:ring-2 focus-visible:ring-primary/50"
                value={form.graduation_year ?? ""}
                onChange={(e) =>
                  set(
                    "graduation_year",
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                placeholder="e.g., 2025"
              />
            </label>

            <label className="form-control">
              <span className="label-text font-medium">Company</span>
              <input
                className="input input-bordered text-black w-full focus-visible:ring-2 focus-visible:ring-primary/50"
                value={form.company ?? ""}
                onChange={(e) => set("company", e.target.value)}
                placeholder="Company name"
              />
            </label>

            <label className="form-control">
              <span className="label-text font-medium">Position</span>
              <input
                className="input input-bordered text-black w-full focus-visible:ring-2 focus-visible:ring-primary/50"
                value={form.position ?? ""}
                onChange={(e) => set("position", e.target.value)}
                placeholder="Job title"
              />
            </label>

            <label className="form-control sm:col-span-2">
              <span className="label-text font-medium">LinkedIn URL</span>
              <input
                className="input input-bordered text-black w-full focus-visible:ring-2 focus-visible:ring-primary/50"
                value={form.linkedin ?? ""}
                onChange={(e) => set("linkedin", e.target.value)}
                placeholder="https://www.linkedin.com/in/username"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-end gap-2 px-6 py-4 border border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment backdrop-blur">
          <button
            className="inline-flex items-center justify-center
            rounded-full border border-dsmlcTangerine
            bg-transparent px-5 py-2 text-sm font-medium
            text-dsmlcTangerine
            hover:bg-dsmlcTangerine hover:text-white
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dsmlcTangerine/60
            shadow-sm hover:shadow-md
            transition-all duration-200"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            className="inline-flex items-center justify-center
            rounded-full border border-dsmlcTangerine
            bg-transparent px-5 py-2 text-sm font-medium
            text-dsmlcTangerine
            hover:bg-dsmlcTangerine hover:text-white
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dsmlcTangerine/60
            shadow-sm hover:shadow-md
            transition-all duration-200"
            onClick={save}
            disabled={saving}
          >
            {saving ? "Saving…" : mode === "edit" ? "Save" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
