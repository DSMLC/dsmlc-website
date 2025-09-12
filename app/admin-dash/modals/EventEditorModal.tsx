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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl mx-4 rounded-2xl bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite border border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment shadow-xl p-6">
        <h3 className="text-xl font-semibold text-dsmlcTangerine mb-6">
          {mode === "edit" ? "Edit Event" : "Add Event"}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="form-control sm:col-span-2">
            <span className="label-text">Name *</span>
            <input
              className="input input-bordered"
              value={form.event_name ?? ""}
              onChange={(e) => set("event_name", e.target.value)}
            />
          </label>

          <label className="form-control">
            <span className="label-text">Type *</span>
            <input
              className="input input-bordered"
              value={form.event_type ?? ""}
              onChange={(e) => set("event_type", e.target.value)}
            />
          </label>

          <label className="form-control">
            <span className="label-text">Date (YYYY-MM-DD — optional)</span>
            <input
              className="input input-bordered"
              value={form.event_date ?? ""}
              onChange={(e) => set("event_date", e.target.value || null)}
            />
          </label>

          <label className="form-control sm:col-span-2">
            <span className="label-text">Description (optional)</span>
            <textarea
              className="textarea textarea-bordered"
              value={form.event_description ?? ""}
              onChange={(e) => set("event_description", e.target.value || null)}
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button className="btn" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={save} disabled={saving}>
            {saving ? "Saving…" : mode === "edit" ? "Save" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
