"use client";

import React, { useMemo, useState } from "react";

/** =========================
 *  ERD-aligned data types
 *  ========================= */
export type Role = { role_id: number; role: string };

export type Member = {
  member_id: number;
  first_name: string;
  last_name: string;
  email?: string;
  ucid?: string;
  major?: string;
  role_id?: number | null;
  year?: number | null; // current year of study
  graduated?: boolean | null; // true if graduated
};

export type Event = {
  event_id: number;
  event_name: string;
  event_description?: string;
  event_type?: string;
  event_date: string; // ISO date
};

export type EventRegistration = {
  event_id: number;
  member_id: number;
  registered: boolean;
  attendance?: "present" | "absent" | "late" | null;
};

export type VisionaryLabProject = {
  project_id: number;
  name: string;
  project_type?: string;
  description?: string;
  start_date?: string; // ISO date
  end_date?: string | null; // ISO date or null
  status?: "planned" | "active" | "paused" | "completed" | string;
  project_lead?: number | null; // member_id (FK)
};

export type VisionaryLabMemberRole = {
  project_id: number;
  member_id: number;
  project_role: string; // e.g., "Developer", "PM"
};

export type Alumni = {
  member_id: number; // FK to Member
  graduation_year?: number | null;
  linkedin?: string | null;
  company?: string | null;
  position?: string | null;
};

/** The template’s Data prop — plain arrays mapped to the ERD */
export type AdminDataDashboardData = {
  roles: Role[];
  members: Member[];
  events: Event[];
  registrations: EventRegistration[];
  projects: VisionaryLabProject[];
  projectMemberRoles: VisionaryLabMemberRole[];
  alumni: Alumni[];
};

export interface AdminDataDashboardTemplateProps {
  Data: AdminDataDashboardData;
}

/** -------------------------
 *  Small utilities
 *  ------------------------- */
const fmtDate = (d?: string | null) =>
  !d
    ? "—"
    : new Date(d).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

const cn = (...c: (string | false | null | undefined)[]) =>
  c.filter(Boolean).join(" ");

/** A tiny client-side table with search + pagination (no external libs) */
function SimpleTable<T>({
  data,
  columns,
  rowKey,
  searchPlaceholder = "Search…",
  pageSize = 10,
}: {
  data: T[];
  columns: {
    key: keyof T | string;
    header: string;
    render?: (row: T) => React.ReactNode;
  }[];
  rowKey: (row: T, idx: number) => string | number;
  searchPlaceholder?: string;
  pageSize?: number;
}) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!q.trim()) return data;
    const lc = q.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        const val =
          typeof col.key === "string"
            ? (row as any)[col.key]
            : (row as any)[col.key as any];
        return String(val ?? "")
          .toLowerCase()
          .includes(lc);
      })
    );
  }, [q, data, columns]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const start = (page - 1) * pageSize;
  const pageData = filtered.slice(start, start + pageSize);

  return (
    <div className="w-full">
      <div className="mb-3">
        <input
          className="input input-bordered w-full"
          placeholder={searchPlaceholder}
          value={q}
          onChange={(e) => {
            setPage(1);
            setQ(e.target.value);
          }}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              {columns.map((c, i) => (
                <th key={i} className="text-xs md:text-sm">
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.map((row, i) => (
              <tr key={rowKey(row, i)} className="hover">
                {columns.map((c, j) => (
                  <td key={j} className="text-xs md:text-sm">
                    {c.render
                      ? c.render(row)
                      : String((row as any)[c.key] ?? "—")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="join grid grid-cols-3 mt-3">
        <button
          className="join-item btn btn-sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          «
        </button>
        <button className="join-item btn btn-sm" disabled>
          Page {page} / {totalPages}
        </button>
        <button
          className="join-item btn btn-sm"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          »
        </button>
      </div>
    </div>
  );
}

/** KPI card */
function Kpi({
  label,
  value,
  hint,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="p-4 rounded-2xl bg-base-200 dark:bg-base-300 border border-base-300">
      <div className="text-sm opacity-70">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
      {hint && <div className="text-xs opacity-60 mt-1">{hint}</div>}
    </div>
  );
}

/** =========================================
 *  MAIN DASHBOARD TEMPLATE (no dependencies)
 *  ========================================= */
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

  // Joins & derived stats
  const roleById = useMemo(
    () => new Map(roles.map((r) => [r.role_id, r.role])),
    [roles]
  );
  const memberById = useMemo(
    () => new Map(members.map((m) => [m.member_id, m])),
    [members]
  );

  const membersByRole = useMemo(() => {
    const map = new Map<string, number>();
    members.forEach((m) => {
      const name = m.role_id
        ? (roleById.get(m.role_id) ?? "Unassigned")
        : "Unassigned";
      map.set(name, (map.get(name) ?? 0) + 1);
    });
    // Use Array.from to avoid downlevel iteration issues
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [members, roleById]);

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

  const activeProjects = projects.filter((p) => p.status === "active");
  const upcomingEvents = events
    .slice()
    .sort(
      (a, b) =>
        new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
    )
    .filter((e) => new Date(e.event_date).getTime() >= Date.now())
    .slice(0, 5);

  // KPIs
  const kpiTotalMembers = members.length;
  const kpiActiveProjects = activeProjects.length;
  const kpiEventsThisMonth = events.filter((e) => {
    const d = new Date(e.event_date);
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
    );
  }).length;
  const kpiAlumni = alumni.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Admin Data Dashboard
          </h1>
          <p className="opacity-70 text-sm md:text-base">
            ERD-driven view of members, roles, events, projects, and alumni.
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi label="Members" value={kpiTotalMembers} />
        <Kpi label="Active Projects" value={kpiActiveProjects} />
        <Kpi label="Events (this month)" value={kpiEventsThisMonth} />
        <Kpi label="Alumni" value={kpiAlumni} />
      </div>

      {/* Members by role */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="card-title">Members by Role</h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Role</th>
                  <th className="text-right">Count</th>
                </tr>
              </thead>
              <tbody>
                {membersByRole.map(([role, count]) => (
                  <tr key={role}>
                    <td>{role}</td>
                    <td className="text-right">{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Upcoming events with live reg/attendance summary */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="card-title">Upcoming Events</h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th className="text-right">Registered</th>
                  <th className="text-right">Present</th>
                </tr>
              </thead>
              <tbody>
                {upcomingEvents.map((e) => {
                  const agg = registrationsByEvent.get(e.event_id) ?? {
                    registered: 0,
                    present: 0,
                  };
                  return (
                    <tr key={e.event_id}>
                      <td>{e.event_name}</td>
                      <td>{fmtDate(e.event_date)}</td>
                      <td>{e.event_type ?? "—"}</td>
                      <td className="text-right">{agg.registered}</td>
                      <td className="text-right">{agg.present}</td>
                    </tr>
                  );
                })}
                {upcomingEvents.length === 0 && (
                  <tr>
                    <td colSpan={5} className="opacity-60">
                      No upcoming events.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Projects directory (joined with lead + team size) */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="card-title">Projects</h2>
          <SimpleTable
            data={projects}
            rowKey={(p) => p.project_id}
            searchPlaceholder="Search projects…"
            columns={[
              { key: "name", header: "Name" },
              { key: "project_type", header: "Type" },
              {
                key: "project_lead",
                header: "Project Lead",
                render: (p) => {
                  const lead = p.project_lead
                    ? memberById.get(p.project_lead)
                    : undefined;
                  return lead ? `${lead.first_name} ${lead.last_name}` : "—";
                },
              },
              {
                key: "status",
                header: "Status",
                render: (p) => (
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-xs",
                      p.status === "active" &&
                        "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300",
                      p.status === "planned" &&
                        "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
                      p.status === "paused" &&
                        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300",
                      p.status === "completed" && "bg-neutral/10"
                    )}
                  >
                    {p.status ?? "—"}
                  </span>
                ),
              },
              {
                key: "team",
                header: "Team",
                render: (p) => projectTeamCounts.get(p.project_id) ?? 0,
              },
              {
                key: "start_date",
                header: "Start",
                render: (p) => fmtDate(p.start_date),
              },
              {
                key: "end_date",
                header: "End",
                render: (p) => fmtDate(p.end_date ?? null),
              },
            ]}
          />
        </div>
      </div>

      {/* Members directory */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="card-title">Members</h2>
        </div>
        <div className="card-body pt-0">
          <SimpleTable
            data={members}
            rowKey={(m) => m.member_id}
            searchPlaceholder="Search members…"
            columns={[
              {
                key: "name",
                header: "Name",
                render: (m) => `${m.first_name} ${m.last_name}`,
              },
              {
                key: "role_id",
                header: "Role",
                render: (m) =>
                  m.role_id
                    ? (roleById.get(m.role_id) ?? "Unassigned")
                    : "Unassigned",
              },
              { key: "email", header: "Email" },
              { key: "major", header: "Major" },
              { key: "year", header: "Year" },
              {
                key: "graduated",
                header: "Graduated",
                render: (m) => (m.graduated ? "Yes" : "No"),
              },
            ]}
          />
        </div>
      </div>

      {/* Alumni directory */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="card-title">Alumni</h2>
        </div>
        <div className="card-body pt-0">
          <SimpleTable
            data={alumni}
            rowKey={(a, i) => `${a.member_id}-${i}`}
            searchPlaceholder="Search alumni…"
            columns={[
              {
                key: "member_id",
                header: "Name",
                render: (a) => {
                  const m = memberById.get(a.member_id);
                  return m
                    ? `${m.first_name} ${m.last_name}`
                    : `#${a.member_id}`;
                },
              },
              { key: "graduation_year", header: "Grad Year" },
              { key: "company", header: "Company" },
              { key: "position", header: "Position" },
              {
                key: "linkedin",
                header: "LinkedIn",
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
      </div>
    </div>
  );
};

export default AdminDataDashboardTemplate;
