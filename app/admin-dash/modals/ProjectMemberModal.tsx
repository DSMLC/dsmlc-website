"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import SimpleTable from "../components/SimpleTable";
import { Member, VisionaryLabProject } from "../utility/types";

/* =========================  Types =========================  */
type ProjMemberRow = {
  project_id: number;
  member_id: number;
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
          className="absolute z-[200] mt-2 w-full max-h-72 overflow-auto rounded-2xl
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
  onAdd,
  onDelete,
  onClose,
}: {
  open: boolean;
  project: VisionaryLabProject;
  rows: ProjMemberRow[];
  roleById: Map<number, string>;
  members: Member[];
  onAdd: (payload: {
    project_id: number;
    member_id: number;
  }) => Promise<void> | void;
  onDelete: (payload: {
    project_id: number;
    member_id: number;
  }) => Promise<void> | void;
  onClose: () => void;
}) {
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [pickerValue, setPickerValue] = useState<number | null>(null);

  const existingIds = useMemo(
    () => new Set(rows.map((r) => r.member_id)),
    [rows]
  );

  const creatableMembers = useMemo(
    () => members.filter((m) => !existingIds.has(m.member_id)),
    [members, existingIds]
  );

  const selectedRow = useMemo(
    () => rows.find((r) => r.member_id === selectedMemberId),
    [rows, selectedMemberId]
  );

  if (!open) return null;

  const addMember = async () => {
    if (pickerValue == null) {
      alert("Select a member to add.");
      return;
    }
    if (existingIds.has(pickerValue)) {
      alert("That member is already on this project.");
      return;
    }
    try {
      setAdding(true);
      await onAdd({ project_id: project.project_id, member_id: pickerValue });
      setPickerValue(null);
      setSelectedMemberId(pickerValue);
    } catch (e: any) {
      alert(e?.message ?? "Add failed.");
    } finally {
      setAdding(false);
    }
  };

  const removeMember = async () => {
    if (!selectedRow || deleting) return;
    const label = selectedRow.member
      ? `${selectedRow.member.first_name} ${selectedRow.member.last_name}`
      : `#${selectedRow.member_id}`;
    if (
      !confirm(`Remove ${label} from "${project.name}"? This cannot be undone.`)
    )
      return;

    try {
      setDeleting(true);
      await onDelete({
        project_id: project.project_id,
        member_id: selectedRow.member_id,
      });
      setSelectedMemberId(null);
    } catch (e: any) {
      alert(e?.message ?? "Delete failed.");
    } finally {
      setDeleting(false);
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

        {/* Add picker */}
        <div className="rounded-2xl border border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-end">
            <div>
              <label className="label">
                <span className="label-text dark:text-dark-dsmlcBlack text-light-dsmlcBlack">
                  Add member to project
                </span>
              </label>
              <MemberSearchSelect
                members={creatableMembers}
                value={pickerValue}
                onChange={setPickerValue}
                placeholder="Search by name or email…"
              />
            </div>
            <button
              onClick={addMember}
              disabled={pickerValue == null || adding}
              className="inline-flex items-center justify-center
                  rounded-full border border-dsmlcTangerine
                  bg-transparent px-5 py-2 text-sm font-medium
                  text-dsmlcTangerine
                  hover:bg-dsmlcTangerine hover:text-white
                  disabled:opacity-50 disabled:cursor-not-allowed
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dsmlcTangerine/60
                  shadow-sm hover:shadow-md transition-all duration-200"
            >
              {adding ? "Adding…" : "Add"}
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
              { label: "Member", span: 2 },
              { label: "Contact", span: 1 },
              { label: "Org Role", span: 1 },
            ]}
            columns={[
              {
                key: "select",
                header: "",
                className: "w-[60px]",
                render: (r) => (
                  <div className="flex justify-center">
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
                  "min-w-[180px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
                render: (r) =>
                  r.member
                    ? `${r.member.first_name} ${r.member.last_name}`
                    : `#${r.member_id}`,
              },
              {
                key: "email",
                header: "Email",
                className:
                  "min-w-[200px] max-w-[260px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
                render: (r) =>
                  r.member?.email ? (
                    <a
                      className="link truncate block"
                      href={`mailto:${r.member.email}`}
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
            ]}
          />
          {rows.length === 0 && (
            <div className="p-4 text-sm opacity-70">
              No members on this project yet.
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center gap-2">
          <button
            disabled={!selectedRow || deleting}
            onClick={removeMember}
            className="inline-flex items-center justify-center
                rounded-full border border-dsmlcTangerine
                bg-transparent px-5 py-2 text-sm font-medium
                text-dsmlcTangerine
                hover:bg-dsmlcTangerine hover:text-white
                disabled:opacity-50 disabled:cursor-not-allowed
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dsmlcTangerine/60
                shadow-sm hover:shadow-md transition-all duration-200"
          >
            {deleting ? "Removing…" : "Remove selected"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectMembersModal;
