"use client";
import React, { useEffect, useState } from "react";
import { VisionaryLabProject } from "../utility/types";
import { insertRow, updateRow } from "../utility/adminCrud";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initial: Partial<VisionaryLabProject>;
  onClose: () => void;
  onSaved: (row: VisionaryLabProject, mode: "create" | "edit") => void;
};

export default function ProjectEditorModal({
  open,
  mode,
  initial,
  onClose,
  onSaved,
}: Props) {
  const [form, setForm] = useState<Partial<VisionaryLabProject>>(initial);
  const [saving, setSaving] = useState(false);

  useEffect(() => setForm(initial), [initial]);

  const set = <K extends keyof VisionaryLabProject>(
    k: K,
    v: VisionaryLabProject[K]
  ) => setForm((f) => ({ ...f, [k]: v }));

  // helper: convert empty strings to undefined (for optional string fields)
  const u = (v?: string | null) => (v && v.trim().length ? v : undefined);

  const save = async () => {
    try {
      setSaving(true);
      let saved: VisionaryLabProject;

      const payload = {
        name: form.name ?? "",
        project_type: u(form.project_type), // was null → now undefined when empty
        description: u(form.description), // was null → now undefined when empty
        start_date: u(form.start_date), // was null → now undefined when empty
        end_date: form.end_date && form.end_date.trim() ? form.end_date : null, // this column allows null
        status: form.status ?? "planned",
        project_lead: form.project_lead ?? null, // this column allows null
      };

      if (mode === "edit") {
        if (form.project_id == null)
          throw new Error("Missing project_id for edit");
        saved = await updateRow<VisionaryLabProject>(
          "VisionaryLabProject",
          "project_id",
          form.project_id,
          payload
        );
      } else {
        saved = await insertRow<VisionaryLabProject>(
          "VisionaryLabProject",
          payload
        );
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
      <div className="relative w-full max-w-3xl mx-4 rounded-2xl bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite border border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment shadow-xl p-6">
        <h3 className="text-xl font-semibold text-dsmlcTangerine mb-6">
          {mode === "edit" ? "Edit Project" : "Add Project"}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="form-control">
            <span className="label-text">Name</span>
            <input
              className="input input-bordered"
              value={form.name ?? ""}
              onChange={(e) => set("name", e.target.value)}
            />
          </label>

          <label className="form-control">
            <span className="label-text">Type</span>
            <input
              className="input input-bordered"
              value={form.project_type ?? ""}
              onChange={(e) => set("project_type", e.target.value)}
            />
          </label>

          <label className="form-control sm:col-span-2">
            <span className="label-text">Description</span>
            <textarea
              className="textarea textarea-bordered"
              value={form.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
            />
          </label>

          <label className="form-control">
            <span className="label-text">Start date (YYYY-MM-DD)</span>
            <input
              className="input input-bordered"
              value={form.start_date ?? ""}
              onChange={(e) => set("start_date", e.target.value)}
            />
          </label>

          <label className="form-control">
            <span className="label-text">End date (YYYY-MM-DD or blank)</span>
            <input
              className="input input-bordered"
              value={form.end_date ?? ""}
              onChange={(e) => set("end_date", e.target.value || null)}
            />
          </label>

          <label className="form-control">
            <span className="label-text">Status</span>
            <select
              className="select select-bordered"
              value={form.status ?? "planned"}
              onChange={(e) => set("status", e.target.value)}
            >
              <option value="planned">planned</option>
              <option value="active">active</option>
              <option value="paused">paused</option>
              <option value="completed">completed</option>
            </select>
          </label>

          <label className="form-control">
            <span className="label-text">Project Lead (member_id)</span>
            <input
              type="number"
              className="input input-bordered"
              value={form.project_lead ?? ""}
              onChange={(e) =>
                set(
                  "project_lead",
                  e.target.value ? Number(e.target.value) : null
                )
              }
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
