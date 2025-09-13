"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import SimpleTable from "../components/SimpleTable";
import { fmtDate } from "../components/ui";
import { Event, Member, EventRegistration } from "../utility/types";

type RegRow = EventRegistration & { member?: Member };

// Helpers for display
const yesNo = (n: number | null | undefined) =>
  n === 1 ? "Yes" : n === 0 ? "No" : "—";
const presentAbsent = (n: number | null | undefined) =>
  n === 1 ? "present" : n === 0 ? "absent" : "Unassigned";

/* ========================= Searchable member ========================= */

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

  // Reflect external selection in the input
  useEffect(() => {
    const sel = members.find((m) => m.member_id === value);
    setQuery(sel ? `${sel.first_name} ${sel.last_name}` : "");
  }, [value, members]);

  // Close on outside click / Esc
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
    return arr.slice(0, 50); // cap list size
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
          aria-controls="member-search-listbox"
          role="combobox"
        />
        {query && (
          <button
            type="button"
            className="absolute inset-y-0 right-2 my-auto btn btn-ghost btn-xs rounded-full text-dsmlcTangerine "
            onClick={clear}
            aria-label="Clear"
            title="Clear"
          >
            ✕
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <ul
          ref={listRef}
          id="member-search-listbox"
          role="listbox"
          className="absolute left-full top-0 mr-2 z-[200] w-72 max-h-72 overflow-auto rounded-2xl
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
                onMouseDown={(e) => e.preventDefault()} // keep input focus
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

function EventRegistrationsModal({
  open,
  event,
  rows,
  roleById,
  members,
  onSaved,
  onDelete,
  onClose,
}: {
  open: boolean;
  event: Event;
  rows: RegRow[];
  roleById: Map<number, string>;
  members: Member[];
  onSaved: (
    row: EventRegistration,
    mode: "create" | "edit"
  ) => Promise<void> | void;
  onDelete: (keys: {
    event_id: number;
    member_id: number;
  }) => Promise<void> | void;
  onClose: () => void;
}) {
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);

  // Inline editor state (numeric fields)
  const [editor, setEditor] = useState<{
    mode: "create" | "edit";
    values: {
      member_id: number | null;
      registered: number | null; // 1=yes, 0=no, null=unknown
      attendance: number | null; // 1=present, 0=absent, null=unknown
    };
    saving?: boolean;
  } | null>(null);

  const [deleting, setDeleting] = useState(false);

  const selectedRow: RegRow | undefined = useMemo(
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
        registered: null,
        attendance: null,
      },
    });
  };

  const startEdit = () => {
    if (!selectedRow) return;
    setEditor({
      mode: "edit",
      values: {
        member_id: selectedRow.member_id,
        registered:
          selectedRow.registered === 1 || selectedRow.registered === 0
            ? selectedRow.registered
            : null,
        attendance:
          selectedRow.attendance === 1 || selectedRow.attendance === 0
            ? selectedRow.attendance
            : null,
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
        `Remove registration for ${displayName} from "${event.event_name}"? This cannot be undone.`
      )
    ) {
      return;
    }
    try {
      setDeleting(true);
      await onDelete({
        event_id: event.event_id,
        member_id: selectedRow.member_id,
      });
      setSelectedMemberId(null);
      // If editor was open for this row, close it
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

  const parseNumeric = (v: string): number | null =>
    v === "" ? null : Number(v);

  const saveEditor = async () => {
    if (!editor) return;
    const { member_id, registered, attendance } = editor.values;

    if (!member_id) {
      alert("Please choose a member.");
      return;
    }
    if (editor.mode === "create" && existingMemberIds.has(member_id)) {
      alert("That member is already registered for this event.");
      return;
    }
    // Coerce to numbers (null allowed)
    const payload: EventRegistration = {
      event_id: event.event_id,
      member_id,
      registered: registered ?? 0, // if unset, store 0 by default
      attendance: attendance, // can be null if unknown
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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Modal */}
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
              Registrations — {event.event_name}
            </h3>
            <p className="text-sm opacity-80 dark:text-dark-dsmlcBlack text-light-dsmlcBlack">
              {fmtDate(event.event_date)}{" "}
              {event.event_type ? `· ${event.event_type}` : ""}
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

        {/* Body: table */}
        <div className="overflow-auto rounded-xl border border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment">
          <SimpleTable<RegRow>
            data={rows}
            rowKey={(r) => `${r.event_id}-${r.member_id}`}
            searchPlaceholder="Search registrations…"
            stickyHeader
            zebra
            verticalDividers
            columnGroups={[
              { label: "Select", span: 1 },
              { label: "Member", span: 2 },
              { label: "Contact", span: 1 },
              { label: "Status", span: 2 },
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
                      name="reg-select"
                      className="radio"
                      checked={selectedMemberId === r.member_id}
                      onChange={() => setSelectedMemberId(r.member_id)}
                      aria-label={`Select registration for member #${r.member_id}`}
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
                key: "role",
                header: "Role",
                className:
                  "min-w-[120px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
                render: (r) => {
                  const m = r.member;
                  return m?.role_id
                    ? (roleById.get(m.role_id) ?? "Unassigned")
                    : "Unassigned";
                },
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
                key: "registered",
                header: "Registered (num)",
                className:
                  "w-[150px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
                render: (r) =>
                  `${r.registered ?? "—"} (${yesNo(r.registered)})`,
              },
              {
                key: "attendance",
                header: "Attendance (num)",
                className:
                  "w-[170px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
                render: (r) =>
                  `${r.attendance ?? "—"} (${presentAbsent(r.attendance)})`,
              },
            ]}
          />
          {rows.length === 0 && (
            <div className="p-4 text-sm opacity-70">
              No registrations for this event.
            </div>
          )}
        </div>

        {/* Inline editor */}
        {editor && (
          <div className="mt-4 rounded-2xl border border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-dsmlcTangerine">
                {editor.mode === "create"
                  ? "Add registration"
                  : "Edit registration"}
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Member selector (searchable) */}
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

              {/* Registered (numeric) */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text dark:text-dark-dsmlcBlack text-light-dsmlcBlack">
                    Registered:
                  </span>
                </label>
                <select
                  className="select select-bordered rounded-xl dark:text-dark-dsmlcBlack text-light-dsmlcBlack m-auto
                             border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment
                             bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite
                             focus:outline-none focus:ring-2 focus:ring-dsmlcTangerine focus:border-dsmlcTangerine"
                  value={editor.values.registered ?? ""}
                  onChange={(e) =>
                    setEditor((prev) =>
                      prev
                        ? {
                            ...prev,
                            values: {
                              ...prev.values,
                              registered: parseNumeric(e.target.value),
                            },
                          }
                        : prev
                    )
                  }
                >
                  <option
                    className="dark:text-dark-dsmlcBlack text-light-dsmlcBlack"
                    value=""
                  >
                    — (Unassigned)
                  </option>
                  <option
                    className="dark:text-dark-dsmlcBlack text-light-dsmlcBlack"
                    value="1"
                  >
                    1 (Yes)
                  </option>
                  <option
                    className="dark:text-dark-dsmlcBlack text-light-dsmlcBlack"
                    value="0"
                  >
                    0 (No)
                  </option>
                </select>
              </div>

              {/* Attendance (numeric) */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text dark:text-dark-dsmlcBlack text-light-dsmlcBlack">
                    Attendance:
                  </span>
                </label>
                <select
                  className="select select-bordered rounded-xl dark:text-dark-dsmlcBlack text-light-dsmlcBlack
                             border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment
                             bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite
                             focus:outline-none focus:ring-2 focus:ring-dsmlcTangerine/60 focus:border-dsmlcTangerine"
                  value={editor.values.attendance ?? ""}
                  onChange={(e) =>
                    setEditor((prev) =>
                      prev
                        ? {
                            ...prev,
                            values: {
                              ...prev.values,
                              attendance: parseNumeric(e.target.value),
                            },
                          }
                        : prev
                    )
                  }
                >
                  <option
                    className="dark:text-dark-dsmlcBlack text-light-dsmlcBlack"
                    value=""
                  >
                    — (Unassigned)
                  </option>
                  <option
                    className="dark:text-dark-dsmlcBlack text-light-dsmlcBlack"
                    value="1"
                  >
                    1 (present)
                  </option>
                  <option
                    className="dark:text-dark-dsmlcBlack text-light-dsmlcBlack"
                    value="0"
                  >
                    0 (absent)
                  </option>
                </select>
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

export default EventRegistrationsModal;
