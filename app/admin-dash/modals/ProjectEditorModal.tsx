"use client";
import React, { useEffect, useState } from "react";
import { VisionaryLabProject } from "../utility/types";
import { insertRow, updateRow, upsertRow } from "../utility/adminCrud";

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

  // match Member modal
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(open);
  }, [open]);

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
        project_type: u(form.project_type),
        description: u(form.description),
        start_date: u(form.start_date),
        end_date: form.end_date && form.end_date.trim() ? form.end_date : null, // column allows null
        status: form.status ?? "planned",
        project_lead: form.project_lead ?? null, // column allows null
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

      // If a project lead is set, ensure they're in the project members table as "leader"
      if (saved.project_id != null && saved.project_lead != null) {
        try {
          await upsertRow<any>(
            "VisionaryLabMemberRole",
            {
              project_id: saved.project_id,
              member_id: saved.project_lead,
              project_role: "leader",
            },
            ["project_id", "member_id"]
          );
        } catch (e: any) {
          // surface the issue
          console.error("Auto-assign leader to project members failed:", e);
          alert(
            `Project saved, but failed to auto-assign the leader to project members: ${
              e?.message ?? e
            }`
          );
        }
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
      aria-labelledby="project-modal-title"
      onKeyDown={onKeyDown}
    >
      {/* Backdrop (click to close) */}
      <button
        aria-label="Close"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`relative w-full max-w-3xl sm:max-w-4xl mx-auto
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
            id="project-modal-title"
            className="text-lg sm:text-xl font-semibold text-dsmlcTangerine"
          >
            {mode === "edit" ? "Edit Project" : "Add Project"}
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
              <span className="label-text font-medium">Name</span>
              <input
                className="input input-bordered text-black w-full focus-visible:ring-2 focus-visible:ring-primary/50"
                value={form.name ?? ""}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Project name"
              />
            </label>

            <label className="form-control">
              <span className="label-text font-medium">Type</span>
              <input
                className="input input-bordered text-black w-full focus-visible:ring-2 focus-visible:ring-primary/50"
                value={form.project_type ?? ""}
                onChange={(e) => set("project_type", e.target.value)}
                placeholder="e.g., Web, ML, Outreach"
              />
            </label>

            <label className="form-control sm:col-span-2">
              <span className="label-text font-medium">Description</span>
              <textarea
                className="textarea textarea-bordered text-black w-full focus-visible:ring-2 focus-visible:ring-primary/50 min-h-[7rem]"
                value={form.description ?? ""}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Brief description of the project..."
              />
            </label>

            <label className="form-control">
              <span className="label-text font-medium">Start date</span>
              <input
                type="date"
                className="input input-bordered text-black w-full focus-visible:ring-2 focus-visible:ring-primary/50"
                value={form.start_date ?? ""}
                onChange={(e) => set("start_date", e.target.value)}
              />
            </label>

            <label className="form-control">
              <span className="label-text font-medium">
                End date (optional)
              </span>
              <input
                type="date"
                className="input input-bordered text-black w-full focus-visible:ring-2 focus-visible:ring-primary/50"
                value={form.end_date ?? ""}
                onChange={(e) => set("end_date", e.target.value || null)}
              />
            </label>

            <label className="form-control">
              <span className="label-text font-medium">Status</span>
              <select
                className="select select-bordered text-black w-full focus-visible:ring-2 focus-visible:ring-primary/50"
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
              <span className="label-text font-medium">
                Project Lead (member_id)
              </span>
              <input
                type="number"
                inputMode="numeric"
                className="input input-bordered text-black w-full focus-visible:ring-2 focus-visible:ring-primary/50"
                value={form.project_lead ?? ""}
                onChange={(e) =>
                  set(
                    "project_lead",
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                placeholder="e.g., 42"
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
