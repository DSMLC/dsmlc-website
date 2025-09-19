"use client";
import React, { useEffect, useState } from "react";
import { Event } from "../utility/types";
import { insertRow, updateRow } from "../utility/adminCrud";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initial: Partial<Event>;
  onClose: () => void;
  onSaved: (row: Event, mode: "create" | "edit") => void;
};

export default function EventEditorModal({
  open,
  mode,
  initial,
  onClose,
  onSaved,
}: Props) {
  const [form, setForm] = useState<Partial<Event>>(initial);
  const [saving, setSaving] = useState(false);

  // mount flag for entrance animation (matches other modals)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(open), [open]);

  useEffect(() => setForm(initial), [initial]);

  const set = <K extends keyof Event>(k: K, v: Event[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const name = form.event_name?.trim();
    const type = form.event_type?.trim();
    if (!name) return "Event name is required.";
    if (!type) return "Event type is required.";
    return null;
  };

  const save = async () => {
    const err = validate();
    if (err) {
      alert(err);
      return;
    }

    try {
      setSaving(true);
      let saved: Event;

      // Only description and date are nullable.
      const payload: Partial<Event> = {
        event_name: (form.event_name ?? "").trim(),
        event_type: (form.event_type ?? "").trim(),
        event_description:
          form.event_description && form.event_description.trim().length
            ? form.event_description
            : null,
        event_date:
          form.event_date && form.event_date.trim().length
            ? form.event_date
            : null,
      };

      if (mode === "edit") {
        if (form.event_id == null) throw new Error("Missing event_id for edit");
        saved = await updateRow<Event>(
          "Evt",
          "event_id",
          form.event_id,
          payload
        );
      } else {
        saved = await insertRow<Event>("Evt", payload);
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
      aria-labelledby="event-modal-title"
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
            id="event-modal-title"
            className="text-lg sm:text-xl font-semibold text-dsmlcTangerine"
          >
            {mode === "edit" ? "Edit Event" : "Add Event"}
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
            <label className="form-control sm:col-span-2">
              <span className="label-text font-medium">Name *</span>
              <input
                autoFocus
                className="input input-bordered text-black w-full focus-visible:ring-2 focus-visible:ring-primary/50"
                value={form.event_name ?? ""}
                onChange={(e) => set("event_name", e.target.value)}
                placeholder="Event name"
              />
            </label>

            <label className="form-control">
              <span className="label-text font-medium">Type *</span>
              <input
                className="input input-bordered text-black w-full focus-visible:ring-2 focus-visible:ring-primary/50"
                value={form.event_type ?? ""}
                onChange={(e) => set("event_type", e.target.value)}
                placeholder="Workshop, Talk, Social…"
              />
            </label>

            <label className="form-control">
              <span className="label-text font-medium">Date (optional)</span>
              <input
                type="date"
                className="input input-bordered text-black w-full focus-visible:ring-2 focus-visible:ring-primary/50"
                value={form.event_date ?? ""}
                onChange={(e) => set("event_date", e.target.value || null)}
              />
            </label>

            <label className="form-control sm:col-span-2">
              <span className="label-text font-medium">
                Description (optional)
              </span>
              <textarea
                className="textarea textarea-bordered text-black w-full focus-visible:ring-2 focus-visible:ring-primary/50 min-h-[7rem]"
                value={form.event_description ?? ""}
                onChange={(e) =>
                  set("event_description", e.target.value || null)
                }
                placeholder="Add details, agenda, location, etc."
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
