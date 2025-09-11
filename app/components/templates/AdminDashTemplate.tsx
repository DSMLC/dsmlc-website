"use client";
import React, { useMemo, useState, useEffect } from "react";
import {
  AdminDataDashboardData,
  AdminDataDashboardTemplateProps,
  Alumni,
  Event,
  EventRegistration,
  Member,
  Role,
  VisionaryLabMemberRole,
  VisionaryLabProject,
} from "../../admin-dash/types";
import { fmtDate, SECTION_CARD } from "../../admin-dash/ui";
import SimpleTable from "../../admin-dash/SimpleTable";
import Kpi from "../../admin-dash/Kpi";
import SidebarTabs, { Tab, TABS } from "../../admin-dash/SidebarTabs";
import MemberEditorModal from "../../admin-dash/MemberEditorModal";
import { deleteRow } from "../../admin-dash/adminCrud";

const AdminDataDashboardTemplate: React.FC<AdminDataDashboardTemplateProps> = ({
  Data,
}) => {
  const {
    roles,
    members,
    events,
    registrations,
    projects,
    projectMemberRoles,
    alumni,
  } = Data;

  const [tab, setTab] = useState<Tab>("Overview");

  // Local state mirrors for optimistic updates
  const [membersState, setMembersState] = useState<Member[]>(members);
  const [projectsState, setProjectsState] =
    useState<VisionaryLabProject[]>(projects);
  const [eventsState, setEventsState] = useState<Event[]>(events);
  const [alumniState, setAlumniState] = useState<Alumni[]>(alumni);

  useEffect(() => {
    setMembersState(members);
    setProjectsState(projects);
    setEventsState(events);
    setAlumniState(alumni);
  }, [members, projects, events, alumni]);

  // Modal state
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const onMemberSaved = (updated: Member) => {
    setMembersState((prev) =>
      prev.map((m) => (m.member_id === updated.member_id ? updated : m))
    );
  };

  const onDeleteMember = async (m: Member) => {
    if (
      !confirm(`Delete ${m.first_name} ${m.last_name}? This cannot be undone.`)
    )
      return;

    const snapshot = membersState;
    setMembersState((prev) => prev.filter((x) => x.member_id !== m.member_id));
    try {
      await deleteRow("Member", "member_id", m.member_id);
    } catch (e: any) {
      setMembersState(snapshot);
      alert(`Delete failed: ${e?.message ?? e}`);
    }
  };

  // Selection state for toolbar actions (outside the table)
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const selectedMember = useMemo(
    () => membersState.find((m) => m.member_id === selectedMemberId) ?? null,
    [membersState, selectedMemberId]
  );

  // Joins & derived stats (use *State arrays)
  const roleById = useMemo(
    () => new Map(roles.map((r) => [r.role_id, r.role])),
    [roles]
  );
  const memberById = useMemo(
    () => new Map(membersState.map((m) => [m.member_id, m])),
    [membersState]
  );

  const membersByRole = useMemo(() => {
    const map = new Map<string, number>();
    membersState.forEach((m) => {
      const name = m.role_id
        ? (roleById.get(m.role_id) ?? "Unassigned")
        : "Unassigned";
      map.set(name, (map.get(name) ?? 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [membersState, roleById]);

  const registrationsByEvent = useMemo(() => {
    const map = new Map<number, { registered: number; present: number }>();
    registrations.forEach((r) => {
      const rec = map.get(r.event_id) ?? { registered: 0, present: 0 };
      if (r.registered) rec.registered += 1;
      if (r.attendance === "present") rec.present += 1;
      map.set(r.event_id, rec);
    });
    return map;
  }, [registrations]);

  const projectTeamCounts = useMemo(() => {
    const map = new Map<number, number>();
    projectMemberRoles.forEach((pm) => {
      map.set(pm.project_id, (map.get(pm.project_id) ?? 0) + 1);
    });
    return map;
  }, [projectMemberRoles]);

  const activeProjects = projectsState.filter((p) => p.status === "active");
  const upcomingEvents = eventsState
    .slice()
    .sort(
      (a, b) =>
        new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
    )
    .filter((e) => new Date(e.event_date).getTime() >= Date.now())
    .slice(0, 5);

  const kpiTotalMembers = membersState.length;
  const kpiActiveProjects = activeProjects.length;
  const kpiEventsThisMonth = eventsState.filter((e) => {
    const d = new Date(e.event_date);
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
    );
  }).length;
  const kpiAlumni = alumniState.length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
        {/* Sidebar */}
        <SidebarTabs value={tab} onChange={setTab} />

        {/* Content */}
        <div className="space-y-6">
          {/* Overview */}
          {tab === "Overview" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Kpi label="Members" value={kpiTotalMembers} />
                <Kpi label="Active Projects" value={kpiActiveProjects} />
                <Kpi label="Events (this month)" value={kpiEventsThisMonth} />
                <Kpi label="Alumni" value={kpiAlumni} />
              </div>

              <div className={SECTION_CARD}>
                <h2 className="text-lg font-semibold mb-4 text-dsmlcTangerine">
                  Members by Role
                </h2>
                <div className="overflow-x-auto">
                  <table className="table-fixed w-full">
                    <thead>
                      <tr>
                        <th className="text-xs md:text-sm sticky dark:text-dark-dsmlcBlack text-light-dsmlcBlack bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite border-b border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment">
                          Role
                        </th>
                        <th className="text-xs md:text-sm sticky dark:text-dark-dsmlcBlack text-light-dsmlcBlack bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite border-b border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment">
                          Count
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {membersByRole.map(([role, count]) => (
                        <tr key={role} className="hover">
                          <td className="border-r border-light-dsmlcEnhancedParchment/70 dark:border-dark-dsmlcEnhancedParchment/70">
                            <span className="dark:text-dark-dsmlcBlack text-light-dsmlcBlack">
                              {role}
                            </span>
                          </td>
                          <td className="text-center dark:text-dark-dsmlcBlack text-light-dsmlcBlack">
                            {count}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className={SECTION_CARD}>
                <h2 className="text-lg font-semibold mb-4 text-dsmlcTangerine">
                  Upcoming Events
                </h2>
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th className="sticky dark:text-dark-dsmlcBlack text-light-dsmlcBlack bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite">
                          Name
                        </th>
                        <th className="sticky dark:text-dark-dsmlcBlack text-light-dsmlcBlack bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite">
                          Date
                        </th>
                        <th className="sticky dark:text-dark-dsmlcBlack text-light-dsmlcBlack bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite">
                          Type
                        </th>
                        <th className="text-right dark:text-dark-dsmlcBlack text-light-dsmlcBlack sticky bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite">
                          Registered
                        </th>
                        <th className="text-right dark:text-dark-dsmlcBlack text-light-dsmlcBlack sticky bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite">
                          Present
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingEvents.map((e) => {
                        const agg = registrationsByEvent.get(e.event_id) ?? {
                          registered: 0,
                          present: 0,
                        };
                        return (
                          <tr key={e.event_id} className="hover">
                            <td className="border-r border-light-dsmlcEnhancedParchment/70 dark:border-dark-dsmlcEnhancedParchment/70">
                              {e.event_name}
                            </td>
                            <td className="whitespace-nowrap">
                              {fmtDate(e.event_date)}
                            </td>
                            <td>{e.event_type ?? "—"}</td>
                            <td className="text-right">{agg.registered}</td>
                            <td className="text-right">{agg.present}</td>
                          </tr>
                        );
                      })}
                      {upcomingEvents.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="dark:text-dark-dsmlcBlack text-light-dsmlcBlack"
                          >
                            No upcoming events.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Members */}
          {tab === "Members" && (
            <div className={SECTION_CARD}>
              <div className="flex items-center justify-between mb-4 gap-3">
                <h2 className="text-lg font-semibold text-dsmlcTangerine">
                  Members
                </h2>
                {/* Toolbar (outside the table) */}
                <div className="flex items-center gap-2">
                  <button
                    className="btn btn-sm"
                    disabled={!selectedMember}
                    onClick={() =>
                      selectedMember && setEditingMember(selectedMember)
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    disabled={!selectedMember}
                    onClick={() =>
                      selectedMember && onDeleteMember(selectedMember)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>

              <SimpleTable<Member>
                data={membersState}
                rowKey={(m) => m.member_id}
                searchPlaceholder="Search member..."
                stickyHeader
                zebra
                verticalDividers
                columnGroups={[
                  { label: "Select", span: 1 }, // NEW: selection column
                  { label: "Member", span: 2 }, // Name, Role
                  { label: "Contact", span: 1 }, // Email
                  { label: "Academics", span: 2 }, // Major, Year
                  { label: "Status", span: 2 }, // Joined, Graduated
                  // Actions group removed
                ]}
                columns={[
                  // Selection radio
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
                      <div className="flex items-center gap-2">
                        <div className="avatar placeholder" />
                        <span className="dark:text-dark-dsmlcBlack text-light-dsmlcBlack">{`${m.first_name} ${m.last_name}`}</span>
                      </div>
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
                        <a
                          className="link truncate block"
                          href={`mailto:${m.email}`}
                        >
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
                    render: (m) => fmtDate(m.join_date ?? null),
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
                  // Actions column removed
                ]}
              />

              {/* Edit Modal */}
              {editingMember && (
                <MemberEditorModal
                  open={!!editingMember}
                  onClose={() => setEditingMember(null)}
                  initial={editingMember}
                  onSaved={onMemberSaved}
                />
              )}
            </div>
          )}

          {/* Projects */}
          {tab === "Projects" && (
            <div className={SECTION_CARD}>
              <h2 className="text-lg font-semibold mb-4 text-dsmlcTangerine">
                Projects
              </h2>
              <SimpleTable<VisionaryLabProject>
                data={projectsState}
                rowKey={(p) => p.project_id}
                searchPlaceholder="Search projects…"
                stickyHeader
                zebra
                verticalDividers
                columnGroups={[
                  { label: "Project", span: 2 },
                  { label: "People", span: 2 },
                  { label: "Timeline", span: 2 },
                  { label: "Status", span: 1 },
                ]}
                columns={[
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
                      return lead
                        ? `${lead.first_name} ${lead.last_name}`
                        : "—";
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
          )}

          {/* Events */}
          {tab === "Events" && (
            <div className={SECTION_CARD}>
              <h2 className="text-lg font-semibold mb-4 text-dsmlcTangerine">
                Events
              </h2>
              <SimpleTable<Event>
                data={eventsState}
                rowKey={(e) => e.event_id}
                searchPlaceholder="Search events…"
                stickyHeader
                zebra
                verticalDividers
                columnGroups={[
                  { label: "Event", span: 2 },
                  { label: "Schedule", span: 1 },
                  { label: "Attendance", span: 2 },
                ]}
                columns={[
                  {
                    key: "event_name",
                    header: "Name",
                    className:
                      "min-w-[200px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
                  },
                  {
                    key: "event_type",
                    header: "Type",
                    className:
                      "min-w-[120px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
                  },
                  {
                    key: "event_date",
                    header: "Date",
                    className:
                      "w-[120px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
                    render: (e) => fmtDate(e.event_date),
                  },
                  {
                    key: "registered",
                    header: "Registered",
                    className:
                      "w-[120px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
                    render: (e) =>
                      registrationsByEvent.get(e.event_id)?.registered ?? 0,
                  },
                  {
                    key: "present",
                    header: "Present",
                    className:
                      "w-[120px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
                    render: (e) =>
                      registrationsByEvent.get(e.event_id)?.present ?? 0,
                  },
                ]}
              />
            </div>
          )}

          {/* Alumni */}
          {tab === "Alumni" && (
            <div className={SECTION_CARD}>
              <h2 className="text-lg font-semibold mb-4 text-dsmlcTangerine">
                Alumni
              </h2>
              <SimpleTable<Alumni>
                data={alumniState}
                rowKey={(a, i) => `${a.member_id}-${i}`}
                searchPlaceholder="Search alumni…"
                stickyHeader
                zebra
                verticalDividers
                columnGroups={[
                  { label: "Alumni", span: 1 },
                  { label: "Career", span: 2 },
                  { label: "Details", span: 2 },
                ]}
                columns={[
                  {
                    key: "member_id",
                    header: "Name",
                    className:
                      "min-w-[160px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
                    render: (a) => {
                      const m = memberById.get(a.member_id);
                      return m
                        ? `${m.first_name} ${m.last_name}`
                        : `#${a.member_id}`;
                    },
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
          )}
        </div>
      </div>

      {/* Member modal */}
      {editingMember && (
        <MemberEditorModal
          open={!!editingMember}
          onClose={() => setEditingMember(null)}
          initial={editingMember}
          onSaved={onMemberSaved}
        />
      )}
    </div>
  );
};

export default AdminDataDashboardTemplate;
