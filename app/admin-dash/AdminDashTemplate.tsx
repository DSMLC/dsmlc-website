"use client";
import React, { useMemo, useState, useEffect } from "react";
import {
  AdminDataDashboardTemplateProps,
  Alumni,
  Event,
  Member,
  VisionaryLabProject,
} from "./utility/types";
import { fmtDate, SECTION_CARD } from "./components/ui";
import SimpleTable from "./components/SimpleTable";
import Kpi from "./components/Kpi";
import SidebarTabs, { Tab } from "./components/SidebarTabs";
import MemberEditorModal from "./modals/MemberEditorModal";
import ProjectEditorModal from "./modals/ProjectEditorModal";
import EventEditorModal from "./modals/EventEditorModal";
import AlumniEditorModal from "./modals/AlumniEditorModal";
import { deleteRow } from "./utility/adminCrud";

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

  // Selection state (per tab)
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedAlumniMemberId, setSelectedAlumniMemberId] = useState<
    number | null
  >(null);

  const selectedMember = useMemo(
    () => membersState.find((m) => m.member_id === selectedMemberId) ?? null,
    [membersState, selectedMemberId]
  );
  const selectedProject = useMemo(
    () => projectsState.find((p) => p.project_id === selectedProjectId) ?? null,
    [projectsState, selectedProjectId]
  );
  const selectedEvent = useMemo(
    () => eventsState.find((e) => e.event_id === selectedEventId) ?? null,
    [eventsState, selectedEventId]
  );
  const selectedAlumni = useMemo(
    () =>
      alumniState.find((a) => a.member_id === selectedAlumniMemberId) ?? null,
    [alumniState, selectedAlumniMemberId]
  );

  // ======= Modals (per tab) =======
  const [memberModal, setMemberModal] = useState<{
    mode: "create" | "edit";
    initial: Partial<Member>;
  } | null>(null);

  const [projectModal, setProjectModal] = useState<{
    mode: "create" | "edit";
    initial: Partial<VisionaryLabProject>;
  } | null>(null);

  const [eventModal, setEventModal] = useState<{
    mode: "create" | "edit";
    initial: Partial<Event>;
  } | null>(null);

  const [alumniModal, setAlumniModal] = useState<{
    mode: "create" | "edit";
    initial: Partial<Alumni>;
  } | null>(null);

  // Joins & derived stats
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
    .filter((e) => !!e.event_date) // only dated events
    .slice()
    .sort(
      (a, b) =>
        new Date(a.event_date as string).getTime() -
        new Date(b.event_date as string).getTime()
    )
    .filter((e) => new Date(e.event_date as string).getTime() >= Date.now())
    .slice(0, 5);

  const kpiTotalMembers = membersState.length;
  const kpiActiveProjects = activeProjects.length;
  const kpiEventsThisMonth = eventsState.filter((e) => {
    if (!e.event_date) return false; // guard: null/empty date is not counted
    const d = new Date(e.event_date); // now typed as string
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
    );
  }).length;
  const kpiAlumni = alumniState.length;

  // Delete handlers
  // delete member function
  const onDeleteMember = async (m: Member) => {
    if (
      !confirm(`Delete ${m.first_name} ${m.last_name}? This cannot be undone.`)
    )
      return;
    const snapshot = membersState;
    setMembersState((prev) => prev.filter((x) => x.member_id !== m.member_id));
    try {
      await deleteRow("Member", "member_id", m.member_id);
      if (selectedMemberId === m.member_id) setSelectedMemberId(null);
    } catch (e: any) {
      setMembersState(snapshot);
      alert(`Delete failed: ${e?.message ?? e}`);
    }
  };

  // delete project function
  const onDeleteProject = async (p: VisionaryLabProject) => {
    if (!confirm(`Delete project "${p.name}"? This cannot be undone.`)) return;
    const snapshot = projectsState;
    setProjectsState((prev) =>
      prev.filter((x) => x.project_id !== p.project_id)
    );
    try {
      await deleteRow("VisionaryLabProject", "project_id", p.project_id);
      if (selectedProjectId === p.project_id) setSelectedProjectId(null);
    } catch (e: any) {
      setProjectsState(snapshot);
      alert(`Delete failed: ${e?.message ?? e}`);
    }
  };

  // delete event function
  const onDeleteEvent = async (ev: Event) => {
    if (!confirm(`Delete event "${ev.event_name}"? This cannot be undone.`))
      return;
    const snapshot = eventsState;
    setEventsState((prev) => prev.filter((x) => x.event_id !== ev.event_id));
    try {
      await deleteRow("Event", "event_id", ev.event_id);
      if (selectedEventId === ev.event_id) setSelectedEventId(null);
    } catch (e: any) {
      setEventsState(snapshot);
      alert(`Delete failed: ${e?.message ?? e}`);
    }
  };

  // delete alumni function
  const onDeleteAlumni = async (a: Alumni) => {
    if (
      !confirm(
        `Delete alumni row for member #${a.member_id}? This cannot be undone.`
      )
    )
      return;
    const snapshot = alumniState;
    setAlumniState((prev) => prev.filter((x) => x.member_id !== a.member_id));
    try {
      await deleteRow("Alumni", "member_id", a.member_id);
      if (selectedAlumniMemberId === a.member_id)
        setSelectedAlumniMemberId(null);
    } catch (e: any) {
      setAlumniState(snapshot);
      alert(`Delete failed: ${e?.message ?? e}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
        <SidebarTabs value={tab} onChange={setTab} />

        <div className="space-y-6">
          {/* Overview */}
          {tab === "Overview" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Kpi label="Members" value={kpiTotalMembers} />
                <Kpi label="Active V.L Projects" value={kpiActiveProjects} />
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
                        <th className="text-xs md:text-sm sticky dark:text-dark-dsmlcBlack text-light-dsmlcBlack bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite">
                          Role
                        </th>
                        <th className="text-xs md:text-sm sticky dark:text-dark-dsmlcBlack text-light-dsmlcBlack bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite">
                          Count
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {membersByRole.map(([role, count]) => (
                        <tr key={role} className="hover">
                          <td className="border-r  dark:text-dark-dsmlcBlack text-light-dsmlcBlack border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment">
                            <span>{role}</span>
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
                        <th className="text-center sticky dark:text-dark-dsmlcBlack text-light-dsmlcBlack bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite">
                          Registered
                        </th>
                        <th className="text-center sticky dark:text-dark-dsmlcBlack text-light-dsmlcBlack bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite">
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
                            <td className="text-center border-r dark:text-dark-dsmlcBlack text-light-dsmlcBlack border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment">
                              {e.event_name}
                            </td>
                            <td className="text-center whitespace-nowrap dark:text-dark-dsmlcBlack text-light-dsmlcBlack">
                              {fmtDate(e.event_date)}
                            </td>
                            <td className=" text-center dark:text-dark-dsmlcBlack text-light-dsmlcBlack">
                              {e.event_type ?? "—"}
                            </td>
                            <td className="text-center dark:text-dark-dsmlcBlack text-light-dsmlcBlack">
                              {agg.registered}
                            </td>
                            <td className="text-center dark:text-dark-dsmlcBlack text-light-dsmlcBlack">
                              {agg.present}
                            </td>
                          </tr>
                        );
                      })}
                      {upcomingEvents.length === 0 && (
                        <tr>
                          <td colSpan={5}>No upcoming events.</td>
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
                <div className="flex items-center gap-2">
                  <button
                    className="      inline-flex items-center justify-center
      rounded-full border border-dsmlcTangerine
      bg-transparent px-5 py-2 text-sm font-medium
      text-dsmlcTangerine
      hover:bg-dsmlcTangerine hover:text-white
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dsmlcTangerine/60
      shadow-sm hover:shadow-md
      transition-all duration-200"
                    onClick={() =>
                      setMemberModal({
                        mode: "create",
                        initial: {
                          first_name: "",
                          last_name: "",
                          graduated: false,
                        },
                      })
                    }
                  >
                    Add
                  </button>
                  <button
                    className="      inline-flex items-center justify-center
      rounded-full border border-dsmlcTangerine
      bg-transparent px-5 py-2 text-sm font-medium
      text-dsmlcTangerine
      hover:bg-dsmlcTangerine hover:text-white
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dsmlcTangerine/60
      shadow-sm hover:shadow-md
      transition-all duration-200"
                    disabled={!selectedMember}
                    onClick={() =>
                      selectedMember &&
                      setMemberModal({ mode: "edit", initial: selectedMember })
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="      inline-flex items-center justify-center
      rounded-full border border-dsmlcTangerine
      bg-transparent px-5 py-2 text-sm font-medium
      text-dsmlcTangerine
      hover:bg-dsmlcTangerine hover:text-white
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dsmlcTangerine/60
      shadow-sm hover:shadow-md
      transition-all duration-200"
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
                  { label: "Select", span: 1 },
                  { label: "Member", span: 2 },
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
                      <div className="flex items-center gap-2  dark:text-dark-dsmlcBlack text-light-dsmlcBlack">
                        <div className="avatar placeholder" />
                        <span>{`${m.first_name} ${m.last_name}`}</span>
                      </div>
                    ),
                  },
                  {
                    key: "role_id",
                    header: "Role",
                    className: "min-w-[120px]",
                    render: (m) => (
                      <span className="badge badge-outline  dark:text-dark-dsmlcBlack text-light-dsmlcBlack">
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
                      "min-w-[200px] max-w-[260px]  dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
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
                      "min-w-[120px]  dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
                  },
                  {
                    key: "year",
                    header: "Year",
                    className:
                      "w-[80px]  dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
                  },
                  {
                    key: "join_date",
                    header: "Joined",
                    className:
                      "w-[120px]  dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
                    render: (m) => fmtDate(m.join_date ?? null),
                  },
                  {
                    key: "graduated",
                    header: "Graduated",
                    className:
                      "w-[110px]  dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
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
          )}

          {/* Projects */}
          {tab === "Projects" && (
            <div className={SECTION_CARD}>
              <div className="flex items-center justify-between mb-4 gap-3">
                <h2 className="text-lg font-semibold text-dsmlcTangerine">
                  Visionary Lab Projects
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    className="      inline-flex items-center justify-center
      rounded-full border border-dsmlcTangerine
      bg-transparent px-5 py-2 text-sm font-medium
      text-dsmlcTangerine
      hover:bg-dsmlcTangerine hover:text-white
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dsmlcTangerine/60
      shadow-sm hover:shadow-md
      transition-all duration-200"
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
                    className="      inline-flex items-center justify-center
      rounded-full border border-dsmlcTangerine
      bg-transparent px-5 py-2 text-sm font-medium
      text-dsmlcTangerine
      hover:bg-dsmlcTangerine hover:text-white
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dsmlcTangerine/60
      shadow-sm hover:shadow-md
      transition-all duration-200"
                    disabled={!selectedProject}
                    onClick={() =>
                      selectedProject &&
                      setProjectModal({
                        mode: "edit",
                        initial: selectedProject,
                      })
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="      inline-flex items-center justify-center
      rounded-full border border-dsmlcTangerine
      bg-transparent px-5 py-2 text-sm font-medium
      text-dsmlcTangerine
      hover:bg-dsmlcTangerine hover:text-white
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dsmlcTangerine/60
      shadow-sm hover:shadow-md
      transition-all duration-200"
                    disabled={!selectedProject}
                    onClick={() =>
                      selectedProject && onDeleteProject(selectedProject)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>

              <SimpleTable<VisionaryLabProject>
                data={projectsState}
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
              <div className="flex items-center justify-between mb-4 gap-3">
                <h2 className="text-lg font-semibold text-dsmlcTangerine">
                  Events
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    className="      inline-flex items-center justify-center
      rounded-full border border-dsmlcTangerine
      bg-transparent px-5 py-2 text-sm font-medium
      text-dsmlcTangerine
      hover:bg-dsmlcTangerine hover:text-white
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dsmlcTangerine/60
      shadow-sm hover:shadow-md
      transition-all duration-200"
                    onClick={() =>
                      setEventModal({
                        mode: "create",
                        initial: { event_name: "", event_date: "" },
                      })
                    }
                  >
                    Add
                  </button>
                  <button
                    className="      inline-flex items-center justify-center
      rounded-full border border-dsmlcTangerine
      bg-transparent px-5 py-2 text-sm font-medium
      text-dsmlcTangerine
      hover:bg-dsmlcTangerine hover:text-white
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dsmlcTangerine/60
      shadow-sm hover:shadow-md
      transition-all duration-200"
                    disabled={!selectedEvent}
                    onClick={() =>
                      selectedEvent &&
                      setEventModal({ mode: "edit", initial: selectedEvent })
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="      inline-flex items-center justify-center
      rounded-full border border-dsmlcTangerine
      bg-transparent px-5 py-2 text-sm font-medium
      text-dsmlcTangerine
      hover:bg-dsmlcTangerine hover:text-white
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dsmlcTangerine/60
      shadow-sm hover:shadow-md
      transition-all duration-200"
                    disabled={!selectedEvent}
                    onClick={() =>
                      selectedEvent && onDeleteEvent(selectedEvent)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>

              <SimpleTable<Event>
                data={eventsState}
                rowKey={(e) => e.event_id}
                searchPlaceholder="Search events…"
                stickyHeader
                zebra
                verticalDividers
                columnGroups={[
                  { label: "Select", span: 1 },
                  { label: "Event", span: 2 },
                  { label: "Schedule", span: 1 },
                  { label: "Attendance", span: 2 },
                ]}
                columns={[
                  {
                    key: "select",
                    header: "",
                    className:
                      "w-[60px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
                    render: (e) => (
                      <div className="flex justify-center">
                        <input
                          type="radio"
                          name="event-select"
                          className="radio"
                          checked={selectedEventId === e.event_id}
                          onChange={() => setSelectedEventId(e.event_id)}
                          aria-label={`Select event ${e.event_name}`}
                        />
                      </div>
                    ),
                  },
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
              <div className="flex items-center justify-between mb-4 gap-3">
                <h2 className="text-lg font-semibold text-dsmlcTangerine">
                  Alumni
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    className="      inline-flex items-center justify-center
      rounded-full border border-dsmlcTangerine
      bg-transparent px-5 py-2 text-sm font-medium
      text-dsmlcTangerine
      hover:bg-dsmlcTangerine hover:text-white
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dsmlcTangerine/60
      shadow-sm hover:shadow-md
      transition-all duration-200"
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
                    className="      inline-flex items-center justify-center
      rounded-full border border-dsmlcTangerine
      bg-transparent px-5 py-2 text-sm font-medium
      text-dsmlcTangerine
      hover:bg-dsmlcTangerine hover:text-white
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dsmlcTangerine/60
      shadow-sm hover:shadow-md
      transition-all duration-200"
                    disabled={!selectedAlumni}
                    onClick={() =>
                      selectedAlumni &&
                      setAlumniModal({ mode: "edit", initial: selectedAlumni })
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="      inline-flex items-center justify-center
      rounded-full border border-dsmlcTangerine
      bg-transparent px-5 py-2 text-sm font-medium
      text-dsmlcTangerine
      hover:bg-dsmlcTangerine hover:text-white
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dsmlcTangerine/60
      shadow-sm hover:shadow-md
      transition-all duration-200"
                    disabled={!selectedAlumni}
                    onClick={() =>
                      selectedAlumni && onDeleteAlumni(selectedAlumni)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>

              <SimpleTable<Alumni>
                data={alumniState}
                rowKey={(a, i) => `${a.member_id}-${i}`}
                searchPlaceholder="Search alumni…"
                stickyHeader
                zebra
                verticalDividers
                columnGroups={[
                  { label: "Select", span: 1 },
                  { label: "Alumni", span: 1 },
                  { label: "Career", span: 2 },
                  { label: "Details", span: 2 },
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
                          onChange={() =>
                            setSelectedAlumniMemberId(a.member_id)
                          }
                          aria-label={`Select alumni for member #${a.member_id}`}
                        />
                      </div>
                    ),
                  },
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

      {/* Modals */}
      {memberModal && (
        <MemberEditorModal
          open={!!memberModal}
          mode={memberModal.mode}
          initial={memberModal.initial}
          onClose={() => setMemberModal(null)}
          onSaved={(row, mode) => {
            if (mode === "edit") {
              setMembersState((prev) =>
                prev.map((m) => (m.member_id === row.member_id ? row : m))
              );
            } else {
              setMembersState((prev) => [row, ...prev]);
              setSelectedMemberId(row.member_id);
            }
          }}
        />
      )}

      {projectModal && (
        <ProjectEditorModal
          open={!!projectModal}
          mode={projectModal.mode}
          initial={projectModal.initial}
          onClose={() => setProjectModal(null)}
          onSaved={(row, mode) => {
            if (mode === "edit") {
              setProjectsState((prev) =>
                prev.map((p) => (p.project_id === row.project_id ? row : p))
              );
            } else {
              setProjectsState((prev) => [row, ...prev]);
              setSelectedProjectId(row.project_id);
            }
          }}
        />
      )}

      {eventModal && (
        <EventEditorModal
          open={!!eventModal}
          mode={eventModal.mode}
          initial={eventModal.initial}
          onClose={() => setEventModal(null)}
          onSaved={(row, mode) => {
            if (mode === "edit") {
              setEventsState((prev) =>
                prev.map((e) => (e.event_id === row.event_id ? row : e))
              );
            } else {
              setEventsState((prev) => [row, ...prev]);
              setSelectedEventId(row.event_id);
            }
          }}
        />
      )}

      {alumniModal && (
        <AlumniEditorModal
          open={!!alumniModal}
          mode={alumniModal.mode}
          initial={alumniModal.initial}
          onClose={() => setAlumniModal(null)}
          onSaved={(row, mode) => {
            if (mode === "edit") {
              setAlumniState((prev) =>
                prev.map((a) => (a.member_id === row.member_id ? row : a))
              );
            } else {
              setAlumniState((prev) => [row, ...prev]);
              setSelectedAlumniMemberId(row.member_id);
            }
          }}
        />
      )}
    </div>
  );
};

export default AdminDataDashboardTemplate;
