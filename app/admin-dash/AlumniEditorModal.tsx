"use client";
import React, { useEffect, useState } from "react";
import { Alumni } from "./types";
import { insertRow, updateRow } from "./adminCrud";

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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl mx-4 rounded-2xl bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite border border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment shadow-xl p-6">
        <h3 className="text-xl font-semibold text-dsmlcTangerine mb-6">
          {mode === "edit" ? "Edit Alumni" : "Add Alumni"}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="form-control">
            <span className="label-text">Member ID</span>
            <input
              type="number"
              className="input input-bordered"
              value={form.member_id ?? ""}
              onChange={(e) =>
                set(
                  "member_id",
                  e.target.value ? Number(e.target.value) : (null as any)
                )
              }
              disabled={mode === "edit"}
            />
          </label>

          <label className="form-control">
            <span className="label-text">Graduation year</span>
            <input
              type="number"
              className="input input-bordered"
              value={form.graduation_year ?? ""}
              onChange={(e) =>
                set(
                  "graduation_year",
                  e.target.value ? Number(e.target.value) : null
                )
              }
            />
          </label>

          <label className="form-control">
            <span className="label-text">Company</span>
            <input
              className="input input-bordered"
              value={form.company ?? ""}
              onChange={(e) => set("company", e.target.value)}
            />
          </label>

          <label className="form-control">
            <span className="label-text">Position</span>
            <input
              className="input input-bordered"
              value={form.position ?? ""}
              onChange={(e) => set("position", e.target.value)}
            />
          </label>

          <label className="form-control sm:col-span-2">
            <span className="label-text">LinkedIn URL</span>
            <input
              className="input input-bordered"
              value={form.linkedin ?? ""}
              onChange={(e) => set("linkedin", e.target.value)}
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
