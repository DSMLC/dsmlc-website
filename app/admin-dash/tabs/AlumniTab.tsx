"use client";
import React from "react";
import SimpleTable from "../components/SimpleTable";
import { SECTION_CARD } from "../components/ui";
import { Alumni, Member } from "../utility/types";

type Props = {
  alumni: Alumni[];
  memberById: Map<number, Member>;
  selectedAlumniMemberId: number | null;
  setSelectedAlumniMemberId: (id: number | null) => void;
  setAlumniModal: React.Dispatch<
    React.SetStateAction<{
      mode: "create" | "edit";
      initial: Partial<Alumni>;
    } | null>
  >;
  onDeleteAlumni: (a: Alumni) => Promise<void>;
};

export default function AlumniTab({
  alumni,
  memberById,
  selectedAlumniMemberId,
  setSelectedAlumniMemberId,
  setAlumniModal,
  onDeleteAlumni,
}: Props) {
  const selectedAlumni =
    alumni.find((a) => a.member_id === selectedAlumniMemberId) ?? null;

  return (
    <div className={SECTION_CARD}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h2 className="text-base sm:text-lg font-semibold text-dsmlcTangerine">
          Alumni
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="inline-flex items-center justify-center rounded-full border border-dsmlcTangerine bg-transparent px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-dsmlcTangerine hover:bg-dsmlcTangerine hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dsmlcTangerine/60 shadow-sm hover:shadow-md transition-all duration-200"
            onClick={() =>
              setAlumniModal({
                mode: "create",
                initial: { member_id: undefined },
              })
            }
          >
            Add
          </button>
          <button
            className="inline-flex items-center justify-center rounded-full border border-dsmlcTangerine bg-transparent px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-dsmlcTangerine hover:bg-dsmlcTangerine hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dsmlcTangerine/60 shadow-sm hover:shadow-md transition-all duration-200"
            disabled={!selectedAlumni}
            onClick={() =>
              selectedAlumni &&
              setAlumniModal({ mode: "edit", initial: selectedAlumni })
            }
          >
            Edit
          </button>
          <button
            className="inline-flex items-center justify-center rounded-full border border-dsmlcTangerine bg-transparent px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-dsmlcTangerine hover:bg-dsmlcTangerine hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dsmlcTangerine/60 shadow-sm hover:shadow-md transition-all duration-200"
            disabled={!selectedAlumni}
            onClick={() => selectedAlumni && onDeleteAlumni(selectedAlumni)}
          >
            Delete
          </button>
        </div>
      </div>

      <SimpleTable<Alumni>
        data={alumni}
        rowKey={(a, i) => `${a.member_id}-${i}`}
        searchPlaceholder="Search alumni…"
        stickyHeader
        zebra
        verticalDividers
        columnGroups={[
          { label: "Select", span: 1 },
          { label: "Alumni", span: 2 }, // Name + Member ID
          { label: "Career", span: 2 }, // Company + Previous Position
          { label: "Details", span: 2 }, // Grad Year + LinkedIn
        ]}
        columns={[
          {
            key: "select",
            header: "",
            className:
              "w-[60px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
            render: (a) => (
              <div className="flex justify-center">
                <input
                  type="radio"
                  name="alumni-select"
                  className="radio"
                  checked={selectedAlumniMemberId === a.member_id}
                  onChange={() => setSelectedAlumniMemberId(a.member_id)}
                  aria-label={`Select alumni for member #${a.member_id}`}
                />
              </div>
            ),
          },
          {
            key: "name",
            header: "Name",
            className:
              "min-w-[160px] max-w-[220px] truncate dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
            render: (a) => {
              const m = memberById.get(a.member_id);
              return m ? (
                <span className="truncate block">{`${m.first_name} ${m.last_name}`}</span>
              ) : (
                `#${a.member_id}`
              );
            },
          },
          {
            key: "memberId",
            header: "Member ID",
            className:
              "w-[110px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
            render: (a) => (
              <span
                className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px]
                border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment"
              >
                #{a.member_id}
              </span>
            ),
          },
          {
            key: "company",
            header: "Company",
            className:
              "min-w-[160px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
          },
          {
            key: "position",
            header: "Previous Position",
            className:
              "min-w-[160px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
          },
          {
            key: "graduation_year",
            header: "Grad Year",
            className:
              "w-[110px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
          },
          {
            key: "linkedin",
            header: "LinkedIn",
            className:
              "w-[110px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
            render: (a) =>
              a.linkedin ? (
                <a
                  className="link"
                  href={a.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  Profile
                </a>
              ) : (
                "—"
              ),
          },
        ]}
      />
    </div>
  );
}
