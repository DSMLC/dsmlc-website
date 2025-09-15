"use client";
import React from "react";
import SimpleTable from "../components/SimpleTable";
import { SECTION_CARD, fmtDate } from "../components/ui";
import { Member, VisionaryLabProject } from "../utility/types";

type Props = {
  projects: VisionaryLabProject[];
  memberById: Map<number, Member>;
  projectTeamCounts: Map<number, number>;
  selectedProjectId: number | null;
  setSelectedProjectId: (id: number | null) => void;
  setProjectModal: React.Dispatch<
    React.SetStateAction<{
      mode: "create" | "edit";
      initial: Partial<VisionaryLabProject>;
    } | null>
  >;
  setProjMembersModal: React.Dispatch<
    React.SetStateAction<{ project: VisionaryLabProject } | null>
  >;
  onDeleteProject: (p: VisionaryLabProject) => Promise<void>;
};

export default function ProjectsTab({
  projects,
  memberById,
  projectTeamCounts,
  selectedProjectId,
  setSelectedProjectId,
  setProjectModal,
  setProjMembersModal,
  onDeleteProject,
}: Props) {
  const selectedProject =
    projects.find((p) => p.project_id === selectedProjectId) ?? null;

  return (
    <div className={SECTION_CARD}>
      <div className="flex items-center justify-between mb-4 gap-3">
        <h2 className="text-lg font-semibold text-dsmlcTangerine">
          Visionary Lab Projects
        </h2>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center justify-center rounded-full border border-dsmlcTangerine bg-transparent px-5 py-2 text-sm font-medium text-dsmlcTangerine hover:bg-dsmlcTangerine hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dsmlcTangerine/60 shadow-sm hover:shadow-md transition-all duration-200"
            onClick={() =>
              setProjectModal({
                mode: "create",
                initial: { name: "", status: "planned" },
              })
            }
          >
            Add
          </button>
          <button
            className="inline-flex items-center justify-center rounded-full border border-dsmlcTangerine bg-transparent px-5 py-2 text-sm font-medium text-dsmlcTangerine hover:bg-dsmlcTangerine hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dsmlcTangerine/60 shadow-sm hover:shadow-md transition-all duration-200"
            disabled={!selectedProject}
            onClick={() =>
              selectedProject &&
              setProjectModal({ mode: "edit", initial: selectedProject })
            }
          >
            Edit
          </button>
          <button
            className="inline-flex items-center justify-center rounded-full border border-dsmlcTangerine bg-transparent px-5 py-2 text-sm font-medium text-dsmlcTangerine hover:bg-dsmlcTangerine hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dsmlcTangerine/60 shadow-sm hover:shadow-md transition-all duration-200"
            disabled={!selectedProject}
            onClick={() => selectedProject && onDeleteProject(selectedProject)}
          >
            Delete
          </button>
          <button
            className="inline-flex items-center justify-center rounded-full border border-dsmlcTangerine bg-transparent px-5 py-2 text-sm font-medium text-dsmlcTangerine hover:bg-dsmlcTangerine hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dsmlcTangerine/60 shadow-sm hover:shadow-md transition-all duration-200"
            disabled={!selectedProject}
            onClick={() =>
              selectedProject &&
              setProjMembersModal({ project: selectedProject })
            }
          >
            Manage members
          </button>
        </div>
      </div>

      <SimpleTable<VisionaryLabProject>
        data={projects}
        rowKey={(p) => p.project_id}
        searchPlaceholder="Search projects…"
        stickyHeader
        zebra
        verticalDividers
        columnGroups={[
          { label: "Select", span: 1 },
          { label: "Project", span: 2 },
          { label: "People", span: 2 },
          { label: "Timeline", span: 2 },
          { label: "Status", span: 1 },
        ]}
        columns={[
          {
            key: "select",
            header: "",
            className: "w-[60px]",
            render: (p) => (
              <div className="flex justify-center">
                <input
                  type="radio"
                  name="project-select"
                  className="radio"
                  checked={selectedProjectId === p.project_id}
                  onChange={() => setSelectedProjectId(p.project_id)}
                  aria-label={`Select project ${p.name}`}
                />
              </div>
            ),
          },
          {
            key: "name",
            header: "Name",
            className:
              "min-w-[180px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
          },
          {
            key: "project_type",
            header: "Type",
            className:
              "min-w-[120px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
          },
          {
            key: "project_lead",
            header: "Project Lead",
            className:
              "min-w-[160px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
            render: (p) => {
              const lead = p.project_lead
                ? memberById.get(p.project_lead)
                : undefined;
              return lead ? `${lead.first_name} ${lead.last_name}` : "—";
            },
          },
          {
            key: "team",
            header: "Team",
            className:
              "w-[80px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
            render: (p) => projectTeamCounts.get(p.project_id) ?? 0,
          },
          {
            key: "start_date",
            header: "Start",
            className:
              "w-[120px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
            render: (p) => fmtDate(p.start_date),
          },
          {
            key: "end_date",
            header: "End",
            className:
              "w-[120px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
            render: (p) => fmtDate(p.end_date ?? null),
          },
          {
            key: "status",
            header: "Status",
            className:
              "min-w-[120px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
            render: (p) => (
              <span
                className={
                  "px-2 py-0.5 rounded-full text-xs " +
                  (p.status === "active"
                    ? "bg-green-500 text-green-1000"
                    : p.status === "planned"
                      ? "bg-blue-500 text-blue-1000"
                      : p.status === "paused"
                        ? "bg-yellow-500 text-yellow-1000"
                        : "bg-neutral/10")
                }
              >
                {p.status ?? "—"}
              </span>
            ),
          },
        ]}
      />
    </div>
  );
}
