"use client";
import React from "react";
import SimpleTable from "../components/SimpleTable";
import { SECTION_CARD, fmtDate } from "../components/ui";
import { Member } from "../utility/types";

type Props = {
  members: Member[];
  roleById: Map<number, string>;
  selectedMemberId: number | null;
  setSelectedMemberId: (id: number | null) => void;
  setMemberModal: React.Dispatch<
    React.SetStateAction<{
      mode: "create" | "edit";
      initial: Partial<Member>;
    } | null>
  >;
  onDeleteMember: (m: Member) => Promise<void>;
};

export default function MembersTab({
  members,
  roleById,
  selectedMemberId,
  setSelectedMemberId,
  setMemberModal,
  onDeleteMember,
}: Props) {
  const selectedMember =
    members.find((m) => m.member_id === selectedMemberId) ?? null;

  return (
    <div className={SECTION_CARD}>
      <div className="flex items-center justify-between mb-4 gap-3">
        <h2 className="text-lg font-semibold text-dsmlcTangerine">Members</h2>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center justify-center rounded-full border border-dsmlcTangerine bg-transparent px-5 py-2 text-sm font-medium text-dsmlcTangerine hover:bg-dsmlcTangerine hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dsmlcTangerine/60 shadow-sm hover:shadow-md transition-all duration-200"
            onClick={() =>
              setMemberModal({
                mode: "create",
                initial: { first_name: "", last_name: "", graduated: false },
              })
            }
          >
            Add
          </button>
          <button
            className="inline-flex items-center justify-center rounded-full border border-dsmlcTangerine bg-transparent px-5 py-2 text-sm font-medium text-dsmlcTangerine hover:bg-dsmlcTangerine hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dsmlcTangerine/60 shadow-sm hover:shadow-md transition-all duration-200"
            disabled={!selectedMember}
            onClick={() =>
              selectedMember &&
              setMemberModal({ mode: "edit", initial: selectedMember })
            }
          >
            Edit
          </button>
          <button
            className="inline-flex items-center justify-center rounded-full border border-dsmlcTangerine bg-transparent px-5 py-2 text-sm font-medium text-dsmlcTangerine hover:bg-dsmlcTangerine hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dsmlcTangerine/60 shadow-sm hover:shadow-md transition-all duration-200"
            disabled={!selectedMember}
            onClick={() => selectedMember && onDeleteMember(selectedMember)}
          >
            Delete
          </button>
        </div>
      </div>

      <SimpleTable<Member>
        data={members}
        rowKey={(m) => m.member_id}
        searchPlaceholder="Search member..."
        stickyHeader
        zebra
        verticalDividers
        columnGroups={[
          { label: "Select", span: 1 },
          { label: "Member", span: 3 },
          { label: "Contact", span: 1 },
          { label: "Academics", span: 2 },
          { label: "Status", span: 2 },
        ]}
        columns={[
          {
            key: "select",
            header: "",
            className: "w-[60px]",
            render: (m) => (
              <div className="flex justify-center">
                <input
                  type="radio"
                  name="member-select"
                  className="radio"
                  checked={selectedMemberId === m.member_id}
                  onChange={() => setSelectedMemberId(m.member_id)}
                  aria-label={`Select ${m.first_name} ${m.last_name}`}
                />
              </div>
            ),
          },
          {
            key: "name",
            header: "Name",
            className: "min-w-[160px]",
            render: (m) => (
              <div className="flex items-center gap-2 dark:text-dark-dsmlcBlack text-light-dsmlcBlack">
                <div className="avatar placeholder" />
                <span>{`${m.first_name} ${m.last_name}`}</span>
              </div>
            ),
          },
          {
            key: "member_id",
            header: "ID",
            className:
              "w-[90px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
            render: (m) => (
              <span
                className="rounded-full border px-2 py-0.5 text-xs opacity-80
                border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment"
              >
                #{m.member_id}
              </span>
            ),
          },
          {
            key: "role_id",
            header: "Role",
            className: "min-w-[120px]",
            render: (m) => (
              <span className="badge badge-outline dark:text-dark-dsmlcBlack text-light-dsmlcBlack">
                {m.role_id
                  ? (roleById.get(m.role_id) ?? "Unassigned")
                  : "Unassigned"}
              </span>
            ),
          },
          {
            key: "email",
            header: "Email",
            className:
              "min-w-[200px] max-w-[260px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
            render: (m) =>
              m.email ? (
                <a className="link truncate block" href={`mailto:${m.email}`}>
                  {m.email}
                </a>
              ) : (
                "—"
              ),
          },
          {
            key: "major",
            header: "Major",
            className:
              "min-w-[120px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
          },
          {
            key: "year",
            header: "Year",
            className:
              "w-[80px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
          },
          {
            key: "join_date",
            header: "Joined",
            className:
              "w-[120px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
            render: (m) => (m.join_date ? fmtDate(m.join_date) : "—"),
          },
          {
            key: "graduated",
            header: "Graduated",
            className:
              "w-[110px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
            render: (m) => (
              <span
                className={
                  "px-2 py-0.5 rounded-full text-xs " +
                  (m.graduated
                    ? "bg-green-500 text-green-1000"
                    : "bg-red-500 text-red-1000")
                }
              >
                {m.graduated ? "Yes" : "No"}
              </span>
            ),
          },
        ]}
      />
    </div>
  );
}
