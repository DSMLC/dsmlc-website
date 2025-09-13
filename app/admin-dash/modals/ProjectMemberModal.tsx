"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import SimpleTable from "../components/SimpleTable";
import {
  Member,
  VisionaryLabProject,
  VisionaryLabMemberRole,
} from "../utility/types";

/* =========================  Types =========================  */
type ProjMemberRow = {
  project_id: number;
  member_id: number;
  project_role?: string | null;
  member?: Member;
};

/* ========================= Search ========================= */
function MemberSearchSelect({
  members,
  value,
  onChange,
  placeholder = "Search by name or email…",
}: {
  members: Member[];
  value: number | null;
  onChange: (id: number | null) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const sel = members.find((m) => m.member_id === value);
    setQuery(sel ? `${sel.first_name} ${sel.last_name}` : "");
  }, [value, members]);

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        inputRef.current &&
        !inputRef.current.contains(t) &&
        listRef.current &&
        !listRef.current.contains(t)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onDown);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onDown);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const arr = !q
      ? members
      : members.filter((m) => {
          const name = `${m.first_name} ${m.last_name}`.toLowerCase();
          const email = (m.email ?? "").toLowerCase();
          return name.includes(q) || email.includes(q);
        });
    return arr.slice(0, 50);
  }, [query, members]);

  const choose = (m: Member) => {
    onChange(m.member_id);
    setQuery(`${m.first_name} ${m.last_name}`);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      setActive((a) => Math.min(a + 1, Math.max(filtered.length - 1, 0)));
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setActive((a) => Math.max(a - 1, 0));
      e.preventDefault();
    } else if (e.key === "Enter") {
      const sel = filtered[active];
      if (sel) choose(sel);
      e.preventDefault();
    }
  };

  const clear = () => {
    setQuery("");
    onChange(null);
    setOpen(true);
    setActive(0);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <div className="relative flex-1">
        <input
          ref={inputRef}
          className="input input-bordered w-full pr-9 rounded-xl
                     border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment
                     bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite
                     focus:outline-none focus:ring-2 focus:ring-dsmlcTangerine/60 focus:border-dsmlcTangerine
                     text-light-dsmlcBlack dark:text-dark-dsmlcBlack"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActive(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="pmember-search-listbox"
          role="combobox"
        />
        {query && (
          <button
            type="button"
            className="absolute inset-y-0 right-2 my-auto btn btn-ghost btn-xs rounded-full text-dsmlcTangerine"
            onClick={clear}
            aria-label="Clear"
            title="Clear"
          >
            ✕
          </button>
        )}
      </div>

      {open && (
        <ul
          ref={listRef}
          id="pmember-search-listbox"
          role="listbox"
          className="absolute left-full top-0 ml-2 z-[200] min-w-[260px] max-w-[360px] max-h-72 overflow-auto rounded-2xl
                     border border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment
                     bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite shadow-xl"
        >
          {filtered.length === 0 && (
            <li className="px-3 py-3 text-sm opacity-70 select-none text-dsmlcTangerine">
              No matches
            </li>
          )}
          {filtered.map((m, i) => {
            const isActive = i === active;
            return (
              <li
                key={m.member_id}
                role="option"
                aria-selected={isActive}
                className={`px-3 py-2 cursor-pointer flex items-center justify-between transition-colors
                  ${isActive ? "bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite" : "hover:bg-base-200/60 dark:hover:bg-black/10"}`}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(m)}
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-dsmlcTangerine">
                    {m.first_name} {m.last_name}
                  </div>
                  {m.email && (
                    <div className="truncate text-xs opacity-70 text-light-dsmlcBlack dark:text-dark-dsmlcBlack">
                      {m.email}
                    </div>
                  )}
                </div>
                <span
                  className="ml-3 shrink-0 rounded-full border px-2 py-0.5 text-[10px] opacity-70
                                  border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment
                                  text-light-dsmlcBlack dark:text-dark-dsmlcBlack"
                >
                  #{m.member_id}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ========================= Modal ========================= */
function ProjectMembersModal({
  open,
  project,
  rows,
  roleById,
  members,
  onSaved,
  onDelete,
  onClose,
}: {
  open: boolean;
  project: VisionaryLabProject;
  rows: ProjMemberRow[];
  roleById: Map<number, string>;
  members: Member[];
  onSaved: (
    row: VisionaryLabMemberRole,
    mode: "create" | "edit"
  ) => Promise<void> | void;
  onDelete: (payload: {
    project_id: number;
    member_id: number;
  }) => Promise<void> | void;
  onClose: () => void;
}) {
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);

  // Inline editor (mirror EventRegistrationsModal)
  const [editor, setEditor] = useState<{
    mode: "create" | "edit";
    values: {
      member_id: number | null;
      project_role: string;
    };
    saving?: boolean;
  } | null>(null);

  const [deleting, setDeleting] = useState(false);

  const selectedRow: ProjMemberRow | undefined = useMemo(
    () => rows.find((r) => r.member_id === selectedMemberId),
    [rows, selectedMemberId]
  );

  const existingMemberIds = useMemo(
    () => new Set(rows.map((r) => r.member_id)),
    [rows]
  );

  const creatableMembers = useMemo(
    () => members.filter((m) => !existingMemberIds.has(m.member_id)),
    [members, existingMemberIds]
  );

  if (!open) return null;

  const startCreate = () => {
    setEditor({
      mode: "create",
      values: {
        member_id: null,
        project_role: "",
      },
    });
  };

  const startEdit = () => {
    if (!selectedRow) return;
    setEditor({
      mode: "edit",
      values: {
        member_id: selectedRow.member_id,
        project_role: selectedRow.project_role ?? "",
      },
    });
  };

  const confirmDelete = async () => {
    if (!selectedRow || deleting) return;
    const displayName = selectedRow.member
      ? `${selectedRow.member.first_name} ${selectedRow.member.last_name}`
      : `#${selectedRow.member_id}`;
    if (
      !confirm(
        `Remove ${displayName} from project "${project.name}"? This cannot be undone.`
      )
    ) {
      return;
    }
    try {
      setDeleting(true);
      await onDelete({
        project_id: project.project_id,
        member_id: selectedRow.member_id,
      });
      setSelectedMemberId(null);
      setEditor((ed) =>
        ed && ed.values.member_id === selectedRow.member_id ? null : ed
      );
    } catch (e: any) {
      console.error(e);
      alert(e?.message ?? "Delete failed.");
    } finally {
      setDeleting(false);
    }
  };

  const cancelEditor = () => setEditor(null);

  const saveEditor = async () => {
    if (!editor) return;
    const { member_id, project_role } = editor.values;

    if (!member_id) {
      alert("Please choose a member.");
      return;
    }
    if (editor.mode === "create" && existingMemberIds.has(member_id)) {
      alert("That member is already on this project.");
      return;
    }

    const payload: VisionaryLabMemberRole = {
      project_id: project.project_id,
      member_id,
      project_role,
    };

    try {
      setEditor((e) => (e ? { ...e, saving: true } : e));
      await onSaved(payload, editor.mode);
      setEditor(null);
      if (editor.mode === "create") setSelectedMemberId(member_id);
    } catch (e: any) {
      console.error(e);
      alert(e?.message ?? "Save failed.");
      setEditor((ed) => (ed ? { ...ed, saving: false } : ed));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="relative w-[min(1024px,92vw)] max-h-[85vh] bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite
                   rounded-2xl shadow-xl border border-light-dsmlcEnhancedParchment
                   dark:border-dark-dsmlcEnhancedParchment p-6 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-dsmlcTangerine">
              Project Members — {project.name}
            </h3>
            <p className="text-sm opacity-80 dark:text-dark-dsmlcBlack text-light-dsmlcBlack">
              ID #{project.project_id}{" "}
              {project.project_type ? `· ${project.project_type}` : ""}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={startCreate}
              className="inline-flex items-center justify-center
                rounded-full border border-dsmlcTangerine
                bg-transparent px-4 py-1.5 text-sm font-medium
                text-dsmlcTangerine
                hover:bg-dsmlcTangerine hover:text-white
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dsmlcTangerine/60
                shadow-sm hover:shadow-md transition-all duration-200"
            >
              Add
            </button>
            <button
              disabled={!selectedRow}
              onClick={startEdit}
              className="inline-flex items-center justify-center
                rounded-full border border-dsmlcTangerine
                bg-transparent px-4 py-1.5 text-sm font-medium
                text-dsmlcTangerine
                hover:bg-dsmlcTangerine hover:text-white
                disabled:opacity-50 disabled:cursor-not-allowed
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dsmlcTangerine/60
                shadow-sm hover:shadow-md transition-all duration-200"
            >
              Edit
            </button>
            <button
              disabled={!selectedRow || deleting}
              onClick={confirmDelete}
              className="inline-flex items-center justify-center
                rounded-full border border-dsmlcTangerine
                bg-transparent px-4 py-1.5 text-sm font-medium
                text-dsmlcTangerine
                hover:bg-dsmlcTangerine hover:text-white
                disabled:opacity-50 disabled:cursor-not-allowed
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dsmlcTangerine/60
                shadow-sm hover:shadow-md transition-all duration-200"
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center
                rounded-full border border-dsmlcTangerine
                bg-transparent px-4 py-1.5 text-sm font-medium
                text-dsmlcTangerine
                hover:bg-dsmlcTangerine hover:text-white
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dsmlcTangerine/60
                shadow-sm hover:shadow-md transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>

        {/* Members table */}
        <div className="overflow-auto rounded-xl border border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment">
          <SimpleTable<ProjMemberRow>
            data={rows}
            rowKey={(r) => `${r.project_id}-${r.member_id}`}
            searchPlaceholder="Search project members…"
            stickyHeader
            zebra
            verticalDividers
            columnGroups={[
              { label: "Select", span: 1 },
              { label: "Member", span: 2 }, // Name + Member ID
              { label: "Contact", span: 1 }, // Email
              { label: "Org Role", span: 1 }, // Org Role
              { label: "Project Role", span: 1 }, // Project Role
            ]}
            columns={[
              {
                key: "select",
                header: "",
                className: "w-[56px]",
                render: (r) => (
                  <div className="flex justify-center items-center">
                    <input
                      type="radio"
                      name="pmember-select"
                      className="radio"
                      checked={selectedMemberId === r.member_id}
                      onChange={() => setSelectedMemberId(r.member_id)}
                      aria-label={`Select project member #${r.member_id}`}
                    />
                  </div>
                ),
              },
              {
                key: "name",
                header: "Name",
                className:
                  "min-w-[180px] max-w-[220px] truncate dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
                render: (r) =>
                  r.member ? (
                    <span className="truncate block">{`${r.member.first_name} ${r.member.last_name}`}</span>
                  ) : (
                    `#${r.member_id}`
                  ),
              },
              {
                key: "memberId",
                header: "Member ID",
                className:
                  "w-[110px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
                render: (r) => (
                  <span
                    className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px]
                    border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment"
                  >
                    #{r.member_id}
                  </span>
                ),
              },
              {
                key: "email",
                header: "Email",
                className:
                  "min-w-[210px] max-w-[260px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
                render: (r) =>
                  r.member?.email ? (
                    <a
                      className="link truncate block"
                      href={`mailto:${r.member.email}`}
                      title={r.member.email}
                    >
                      {r.member.email}
                    </a>
                  ) : (
                    "—"
                  ),
              },
              {
                key: "orgRole",
                header: "Role",
                className:
                  "min-w-[120px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
                render: (r) =>
                  r.member?.role_id
                    ? (roleById.get(r.member.role_id) ?? "Unassigned")
                    : "Unassigned",
              },
              {
                key: "projectRole",
                header: "Project Role",
                className:
                  "min-w-[140px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
                render: (r) => r.project_role ?? "Unassigned",
              },
            ]}
          />
          {rows.length === 0 && (
            <div className="p-4 text-sm opacity-70">
              No members on this project yet.
            </div>
          )}
        </div>

        {/* Inline editor */}
        {editor && (
          <div className="mt-4 rounded-2xl border border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-dsmlcTangerine">
                {editor.mode === "create"
                  ? "Add project member"
                  : "Edit project member"}
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Member selector (only on create) */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text dark:text-dark-dsmlcBlack text-light-dsmlcBlack">
                    Member:
                  </span>
                </label>

                {editor.mode === "create" ? (
                  <MemberSearchSelect
                    members={creatableMembers}
                    value={editor.values.member_id}
                    onChange={(id) =>
                      setEditor((prev) =>
                        prev
                          ? {
                              ...prev,
                              values: { ...prev.values, member_id: id },
                            }
                          : prev
                      )
                    }
                    placeholder="Search by name or email…"
                  />
                ) : (
                  <input
                    className="input input-bordered rounded-xl
                               border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment
                               bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite
                               text-light-dsmlcBlack dark:text-dark-dsmlcBlack"
                    value={
                      selectedRow?.member
                        ? `${selectedRow.member.first_name} ${selectedRow.member.last_name}`
                        : `#${editor.values.member_id}`
                    }
                    disabled
                  />
                )}
              </div>

              {/* Project Role (text) */}
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text dark:text-dark-dsmlcBlack text-light-dsmlcBlack">
                    Project Role:
                  </span>
                </label>
                <input
                  className="input input-bordered rounded-xl
                             border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment
                             bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite
                             text-light-dsmlcBlack dark:text-dark-dsmlcBlack"
                  placeholder="e.g., Developer, PM, Designer…"
                  value={editor.values.project_role}
                  onChange={(e) =>
                    setEditor((prev) =>
                      prev
                        ? {
                            ...prev,
                            values: {
                              ...prev.values,
                              project_role: e.target.value,
                            },
                          }
                        : prev
                    )
                  }
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex items-center gap-2">
              <button
                className="inline-flex items-center justify-center
                  rounded-full border border-dsmlcTangerine
                  bg-transparent px-5 py-2 text-sm font-medium
                  text-dsmlcTangerine
                  hover:bg-dsmlcTangerine hover:text-white
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dsmlcTangerine/60
                  shadow-sm hover:shadow-md
                  transition-all duration-200"
                disabled={editor.saving}
                onClick={saveEditor}
              >
                {editor.saving ? "Saving…" : "Save"}
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
                disabled={editor.saving}
                onClick={cancelEditor}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectMembersModal;
