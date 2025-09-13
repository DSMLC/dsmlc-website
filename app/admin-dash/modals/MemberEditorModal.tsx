"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Member } from "../utility/types";
import { insertRow, updateRow } from "../utility/adminCrud";

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

  // simple mount flag for entrance animation
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (open) setMounted(true);
    else setMounted(false);
  }, [open]);

  // Reset form when switching between edit/create or when initial changes
  useEffect(() => {
    setForm(mode === "edit" ? initial : {});
  }, [initial, mode]);

  const set = useCallback(
    <K extends keyof Member>(k: K, v: Member[K]) =>
      setForm((f) => ({ ...f, [k]: v })),
    []
  );

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

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="member-modal-title"
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
        className={`relative w-full max-w-3xl sm:max-w-4xl mx-auto bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite border border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment
        transition-all duration-200 ease-out dark:text-dark-dsmlcBlack text-light-dsmlcBlack
        ${mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-[0.98]"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-4 border border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment backdrop-blur">
          <h3
            id="member-modal-title"
            className="text-lg sm:text-xl font-semibold text-dsmlcTangerine"
          >
            {mode === "edit" ? "Edit Member" : "Add Member"}
            {mode === "edit" && form.member_id != null ? (
              <span className="dark:text-dark-dsmlcBlack text-light-dsmlcBlack ml-2 text-sm ">
                • ID #{form.member_id}
              </span>
            ) : null}
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
            {mode === "edit" && (
              <label className="form-control">
                <span className="label-text font-medium">Member ID</span>
                <input
                  className="input input-bordered dark:text-dark-dsmlcBlack text-light-dsmlcBlack w-full bg-white /40 dark:bg-black/25"
                  value={form.member_id ?? ""}
                  disabled
                  readOnly
                />
              </label>
            )}

            <label className="form-control">
              <span className="label-text font-medium">First name *</span>
              <input
                autoFocus
                className="input input-bordered text-black w-full focus-visible:ring-2 focus-visible:ring-primary/50"
                value={form.first_name ?? ""}
                onChange={(e) => set("first_name", e.target.value)}
                placeholder="Jane"
              />
            </label>

            <label className="form-control">
              <span className="label-text font-medium">Last name *</span>
              <input
                className="input input-bordered text-black w-full focus-visible:ring-2 focus-visible:ring-primary/50"
                value={form.last_name ?? ""}
                onChange={(e) => set("last_name", e.target.value)}
                placeholder="Doe"
              />
            </label>

            <label className="form-control sm:col-span-2">
              <span className="label-text font-medium">Email</span>
              <input
                type="email"
                className="input input-bordered text-black w-full focus-visible:ring-2 focus-visible:ring-primary/50"
                value={form.email ?? ""}
                onChange={(e) => set("email", e.target.value || ("" as any))}
                placeholder="name@ucalgary.ca"
              />
            </label>

            <label className="form-control">
              <span className="label-text font-medium">UCID</span>
              <input
                className="input input-bordered text-black w-full focus-visible:ring-2 focus-visible:ring-primary/50"
                value={form.ucid ?? ""}
                onChange={(e) => set("ucid", e.target.value || ("" as any))}
                placeholder="30012345"
              />
            </label>

            <label className="form-control">
              <span className="label-text font-medium">Major</span>
              <input
                className="input input-bordered text-black w-full focus-visible:ring-2 focus-visible:ring-primary/50"
                value={form.major ?? ""}
                onChange={(e) => set("major", e.target.value || ("" as any))}
                placeholder="Computer Science"
              />
            </label>

            <label className="form-control">
              <span className="label-text font-medium">Role ID</span>
              <input
                type="number"
                className="input input-bordered text-black w-full focus-visible:ring-2 focus-visible:ring-primary/50"
                value={form.role_id ?? ""}
                onChange={(e) =>
                  set(
                    "role_id",
                    e.target.value ? Number(e.target.value) : (null as any)
                  )
                }
                placeholder="e.g., 2"
                inputMode="numeric"
              />
            </label>

            <label className="form-control">
              <span className="label-text font-medium">Year</span>
              <input
                type="number"
                className="input input-bordered text-black w-full focus-visible:ring-2 focus-visible:ring-primary/50"
                value={form.year ?? ""}
                onChange={(e) =>
                  set(
                    "year",
                    e.target.value ? Number(e.target.value) : (null as any)
                  )
                }
                placeholder="e.g., 3"
                inputMode="numeric"
              />
            </label>

            <label className="form-control">
              <span className="label-text font-medium">Joined</span>
              {/* Using date input keeps YYYY-MM-DD format */}
              <input
                type="date"
                className="input input-bordered text-black w-full focus-visible:ring-2 focus-visible:ring-primary/50"
                placeholder="2025-09-01"
                value={form.join_date ?? ""}
                onChange={(e) =>
                  set("join_date", e.target.value || (null as any))
                }
              />
            </label>

            <div className="form-control">
              <span className="label-text font-medium">Graduated</span>
              <label className="label cursor-pointer justify-start gap-3 p-0 mt-2">
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={!!form.graduated}
                  onChange={(e) => set("graduated", e.target.checked)}
                />
              </label>
            </div>
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
