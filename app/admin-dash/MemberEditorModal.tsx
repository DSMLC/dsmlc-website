"use client";
import React, { useEffect, useState } from "react";
import { Member } from "./types";
import { insertRow, updateRow } from "./adminCrud";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initial: Partial<Member>;
  onClose: () => void;
  onSaved: (row: Member, mode: "create" | "edit") => void;
};

export default function MemberEditorModal({
  open,
  mode,
  initial,
  onClose,
  onSaved,
}: Props) {
  const [form, setForm] = useState<Partial<Member>>(initial);
  const [saving, setSaving] = useState(false);

  // Reset form when switching between edit/create or when initial changes
  useEffect(() => {
    setForm(mode === "edit" ? initial : {});
  }, [initial, mode]);

  const set = <K extends keyof Member>(k: K, v: Member[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const fn = form.first_name?.trim();
    const ln = form.last_name?.trim();
    if (!fn) return "First name is required.";
    if (!ln) return "Last name is required.";
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
      let saved: Member;

      // Build a clean payload
      const payload: Partial<Member> = {
        first_name: (form.first_name ?? "").trim(),
        last_name: (form.last_name ?? "").trim(),
        email: form.email?.trim() ? form.email.trim() : null,
        ucid: form.ucid?.trim() ? form.ucid.trim() : null,
        major: form.major?.trim() ? form.major.trim() : null,
        role_id:
          typeof form.role_id === "number"
            ? form.role_id
            : form.role_id
              ? Number(form.role_id)
              : null,
        year:
          typeof form.year === "number"
            ? form.year
            : form.year
              ? Number(form.year)
              : null,
        graduated: !!form.graduated,
        join_date: form.join_date?.trim() ? form.join_date.trim() : null,
      };

      if (mode === "edit") {
        if (form.member_id == null)
          throw new Error("Missing member_id for edit");
        saved = await updateRow<Member>(
          "Member",
          "member_id",
          form.member_id,
          payload
        );
      } else {
        const { member_id, ...body } = payload as any;
        saved = await insertRow<Member>("Member", body);
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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-3xl mx-4 rounded-2xl bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite border border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment shadow-xl p-6">
        <h3 className="text-xl font-semibold text-dsmlcTangerine mb-6">
          {mode === "edit" ? "Edit Member" : "Add Member"}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="form-control">
            <span className="label-text">First name *</span>
            <input
              className="input input-bordered"
              value={form.first_name ?? ""}
              onChange={(e) => set("first_name", e.target.value)}
            />
          </label>

          <label className="form-control">
            <span className="label-text">Last name *</span>
            <input
              className="input input-bordered"
              value={form.last_name ?? ""}
              onChange={(e) => set("last_name", e.target.value)}
            />
          </label>

          <label className="form-control sm:col-span-2">
            <span className="label-text">Email</span>
            <input
              type="email"
              className="input input-bordered"
              value={form.email ?? ""}
              onChange={(e) => set("email", e.target.value || ("" as any))}
              placeholder="name@ucalgary.ca"
            />
          </label>

          <label className="form-control">
            <span className="label-text">UCID</span>
            <input
              className="input input-bordered"
              value={form.ucid ?? ""}
              onChange={(e) => set("ucid", e.target.value || ("" as any))}
              placeholder="30012345"
            />
          </label>

          <label className="form-control">
            <span className="label-text">Major</span>
            <input
              className="input input-bordered"
              value={form.major ?? ""}
              onChange={(e) => set("major", e.target.value || ("" as any))}
              placeholder="Computer Science"
            />
          </label>

          <label className="form-control">
            <span className="label-text">Role ID</span>
            <input
              type="number"
              className="input input-bordered"
              value={form.role_id ?? ""}
              onChange={(e) =>
                set(
                  "role_id",
                  e.target.value ? Number(e.target.value) : (null as any)
                )
              }
              placeholder="e.g., 2"
            />
          </label>

          <label className="form-control">
            <span className="label-text">Year</span>
            <input
              type="number"
              className="input input-bordered"
              value={form.year ?? ""}
              onChange={(e) =>
                set(
                  "year",
                  e.target.value ? Number(e.target.value) : (null as any)
                )
              }
              placeholder="e.g., 3"
            />
          </label>

          <label className="form-control">
            <span className="label-text">Joined (YYYY-MM-DD)</span>
            <input
              className="input input-bordered"
              placeholder="2025-09-01"
              value={form.join_date ?? ""}
              onChange={(e) =>
                set("join_date", e.target.value || (null as any))
              }
            />
          </label>

          <label className="form-control">
            <span className="label-text">Graduated</span>
            <input
              type="checkbox"
              className="toggle"
              checked={!!form.graduated}
              onChange={(e) => set("graduated", e.target.checked)}
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
