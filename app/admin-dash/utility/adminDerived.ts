"use client";
import { useMemo } from "react";
import {
  Alumni,
  Event,
  EventRegistration,
  Member,
  Role,
  VisionaryLabProject,
} from "../utility/types";

type Args = {
  roles: Role[];
  membersState: Member[];
  eventsState: Event[];
  registrationsState: EventRegistration[];
  projectMemberRoles: { project_id: number; member_id: number }[];
  alumniState: Alumni[];
  projectsState: VisionaryLabProject[];
};

// Treat "YYYY-MM-DD" as LOCAL midnight, not UTC
function parseLocalDate(d?: string | null): Date | null {
  if (!d) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]); // local midnight
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? null : dt;
}

export default function useAdminDerived({
  roles,
  membersState,
  eventsState,
  registrationsState,
  projectMemberRoles,
  alumniState,
  projectsState,
}: Args) {
  // Support role_name or role
  const roleById = useMemo(
    () =>
      new Map(
        roles.map((r: any) => [r.role_id, r.role_name ?? r.role ?? "Unassigned"])
      ),
    [roles]
  );

  const memberById = useMemo(
    () => new Map(membersState.map((m) => [m.member_id, m])),
    [membersState]
  );

  const membersByRole = useMemo(() => {
    const map = new Map<string, number>();
    membersState.forEach((m) => {
      const name = m.role_id ? roleById.get(m.role_id) ?? "Unassigned" : "Unassigned";
      map.set(name, (map.get(name) ?? 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [membersState, roleById]);

  const registrationsByEvent = useMemo(() => {
    const map = new Map<number, { registered: number; present: number }>();
    registrationsState.forEach((r: any) => {
      const rec = map.get(r.event_id) ?? { registered: 0, present: 0 };
      if (r.registered === 1) rec.registered += 1; // explicit numeric check
      if (r.attendance === 1) rec.present += 1;   // explicit numeric check
      map.set(r.event_id, rec);
    });
    return map;
  }, [registrationsState]);

  const projectTeamCounts = useMemo(() => {
    const map = new Map<number, number>();
    projectMemberRoles.forEach((pm) => {
      map.set(pm.project_id, (map.get(pm.project_id) ?? 0) + 1);
    });
    return map;
  }, [projectMemberRoles]);

  // If you don't store status, consider all as active
  const activeProjects = useMemo(
    () =>
      projectsState.filter((p: any) =>
        "status" in p ? p.status === "active" : true
      ),
    [projectsState]
  );

  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventsState
      .map((e) => ({ e, d: parseLocalDate(e.event_date as any) }))
      .filter((x): x is { e: Event; d: Date } => x.d !== null)
      .filter((x) => x.d.getTime() >= today.getTime())
      .sort((a, b) => a.d.getTime() - b.d.getTime())
      .slice(0, 5)
      .map((x) => x.e);
  }, [eventsState]);

  const kpiTotalMembers = membersState.length;
  const kpiActiveProjects = activeProjects.length;

  const kpiEventsThisMonth = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    return eventsState
      .map((e) => parseLocalDate(e.event_date as any))
      .filter((d): d is Date => d !== null)
      .filter((d) => d.getFullYear() === y && d.getMonth() === m).length;
  }, [eventsState]);

  const kpiAlumni = alumniState.length;

  return {
    roleById,
    memberById,
    membersByRole,
    registrationsByEvent,
    projectTeamCounts,
    kpiTotalMembers,
    kpiActiveProjects,
    kpiEventsThisMonth,
    kpiAlumni,
    upcomingEvents,
  };
}
