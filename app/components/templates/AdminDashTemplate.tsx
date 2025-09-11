"use client";
import React, { useMemo, useState } from "react";

export type Role = { role_id: number; role: string };

export type Member = {
  member_id: number;
  first_name: string;
  last_name: string;
  email?: string;
  ucid?: string;
  major?: string;
  role_id?: number | null;
  year?: number | null;
  graduated?: boolean | null; // true if graduated
  join_date?: string | null;
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

const SECTION_CARD =
  "p-6 bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite " +
  "border dark:border-dark-dsmlcEnhancedParchment border-light-dsmlcEnhancedParchment " +
  "shadow-lg dark:shadow-dark-dsmlcParchment shadow-light-dsmlcParchment rounded-4xl";

function SimpleTable<T>({
  data,
  columns,
  rowKey,
  searchPlaceholder = "Search…",
  pageSize = 10,
  columnGroups,
  stickyHeader = true,
  zebra = true,
  verticalDividers = true,
}: {
  data: T[];
  columns: {
    key: keyof T | string;
    header: string;
    render?: (row: T) => React.ReactNode;
    className?: string;
  }[];
  rowKey: (row: T, idx: number) => string | number;
  searchPlaceholder?: string;
  pageSize?: number;
  columnGroups?: { label: string; span: number }[];
  stickyHeader?: boolean;
  zebra?: boolean;
  verticalDividers?: boolean;
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

  const tableClass = cn("table", zebra && "table-zebra", "w-full");

  const headCellBase = cn(
    "text-xs md:text-sm font-semibold",
    stickyHeader && "sticky bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite",
    verticalDividers &&
      "border-r border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment last:border-r-0"
  );

  const bodyCellBase = cn(
    "text-xs md:text-sm  align-middle whitespace-nowrap",
    verticalDividers &&
      "border-r border-light-dsmlcEnhancedParchment/70 dark:border-dark-dsmlcEnhancedParchment/70 last:border-r-0"
  );

  return (
    <div className="w-full">
      <div className="mb-3">
        <input
          className="input input-bordered w-full "
          placeholder={searchPlaceholder}
          value={q}
          onChange={(e) => {
            setPage(1);
            setQ(e.target.value);
          }}
        />
      </div>

      <div className="overflow-x-auto rounded-3xl">
        <table className={tableClass}>
          <thead>
            {columnGroups && columnGroups.length > 0 && (
              <tr>
                {columnGroups.map((g, i) => (
                  <th
                    key={`grp-${i}`}
                    colSpan={g.span}
                    className={cn(
                      headCellBase,
                      "uppercase tracking-wide text-[11px] md:text-xs",
                      "text-neutral-600 dark:text-neutral-300",
                      "border-b border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment"
                    )}
                  >
                    {g.label}
                  </th>
                ))}
              </tr>
            )}
            {/* Regular column headers */}
            <tr>
              {columns.map((c, i) => (
                <th
                  key={i}
                  className={cn(
                    headCellBase,
                    "text-neutral-700 dark:text-neutral-200",
                    "border-b border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment",
                    c.className
                  )}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.map((row, i) => (
              <tr key={rowKey(row, i)} className="hover">
                {columns.map((c, j) => (
                  <td key={j} className={cn(bodyCellBase, c.className)}>
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
      <div className="join grid grid-cols-3 mt-3 text-dsmlcTangerine">
        <button
          className="join-item btn-primary btn-sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          «
        </button>
        <button className="join-item btn btn-sm" disabled>
          Page {page} / {totalPages}
        </button>
        <button
          className="join-item btn-primary btn-sm"
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
    <div className={SECTION_CARD}>
      <div className="text-sm font-semibold font-redHat text-dsmlcTangerine">
        {label}
      </div>
      <div className="dark:text-dark-dsmlcBlack text-light-dsmlcBlack text-2xl font-redHat">
        {value}
      </div>
      {hint && (
        <div className="dark:text-dark-dsmlcBlack text-light-dsmlcBlack text-xs opacity-60 mt-1">
          {hint}
        </div>
      )}
    </div>
  );
}

/** Tabs (vertical left sidebar) */
const TABS = ["Overview", "Members", "Projects", "Events", "Alumni"] as const;
type Tab = (typeof TABS)[number];

function SidebarTabs({
  value,
  onChange,
}: {
  value: Tab;
  onChange: (t: Tab) => void;
}) {
  return (
    <aside className={SECTION_CARD}>
      <nav className="flex flex-col gap-2">
        {TABS.map((t) => {
          const active = value === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => onChange(t)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-xl border transition text-xl font-redHat text-dsmlcTangerine",
                active
                  ? "bg-black/5 dark:bg-white/10 border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment"
                  : "bg-transparent hover:bg-black/5 dark:hover:bg-white/10 border-transparent"
              )}
              aria-current={active ? "page" : undefined}
            >
              {t}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

// MAIN DASHBOARD TEMPLATE (left tabs, separated tables)
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
    <div className="space-y-4">
      {/* Layout: left sidebar tabs + right content */}
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
              <h2 className="text-lg font-semibold mb-4 text-dsmlcTangerine">
                Members
              </h2>
              <SimpleTable
                data={members}
                rowKey={(m) => m.member_id}
                searchPlaceholder="Search members…"
                stickyHeader
                zebra
                verticalDividers
                columnGroups={[
                  { label: "Member", span: 2 }, // Name, Role
                  { label: "Contact", span: 1 }, // Email
                  { label: "Academics", span: 2 }, // Major, Year
                  { label: "Status", span: 2 }, // Joined, Graduated
                ]}
                columns={[
                  {
                    key: "name",
                    header: "Name",
                    className: "min-w-[160px]",
                    render: (m) => (
                      <div className="flex items-center gap-2">
                        <div className="avatar placeholder"></div>
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
                        className={cn(
                          "px-2 py-0.5 rounded-full text-xs",
                          m.graduated
                            ? "bg-green-500 text-green-1000"
                            : "bg-red-500 text-red-1000"
                        )}
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
              <h2 className="text-lg font-semibold mb-4 text-dsmlcTangerine">
                Projects
              </h2>
              <SimpleTable
                data={projects}
                rowKey={(p) => p.project_id}
                searchPlaceholder="Search projects…"
                stickyHeader
                zebra
                verticalDividers
                columnGroups={[
                  { label: "Project", span: 2 }, // Name, Type
                  { label: "People", span: 2 }, // Lead, Team
                  { label: "Timeline", span: 2 }, // Start, End
                  { label: "Status", span: 1 }, // Status
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
                        className={cn(
                          "px-2 py-0.5 rounded-full text-xs",
                          p.status === "active" &&
                            "bg-green-500 text-green-1000",
                          p.status === "planned" &&
                            "bg-blue-500 text-blue-1000",
                          p.status === "paused" &&
                            "bg-yellow-500 text-yellow-1000",
                          p.status === "completed" && "bg-neutral/10"
                        )}
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
              <SimpleTable
                data={events}
                rowKey={(e) => e.event_id}
                searchPlaceholder="Search events…"
                stickyHeader
                zebra
                verticalDividers
                columnGroups={[
                  { label: "Event", span: 2 }, // Name, Type
                  { label: "Schedule", span: 1 }, // Date
                  { label: "Attendance", span: 2 }, // Registered, Present
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
              <SimpleTable
                data={alumni}
                rowKey={(a, i) => `${a.member_id}-${i}`}
                searchPlaceholder="Search alumni…"
                stickyHeader
                zebra
                verticalDividers
                columnGroups={[
                  { label: "Alumni", span: 1 }, // Name
                  { label: "Career", span: 2 }, // Company, Position
                  { label: "Details", span: 2 }, // Grad Year, LinkedIn
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
    </div>
  );
};

export default AdminDataDashboardTemplate;
